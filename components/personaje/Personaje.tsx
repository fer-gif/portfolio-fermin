"use client";

import { useEffect, useRef, useState } from "react";
import { useDicho, useDirector, useEscenaActual, usePasoActual } from "@/components/recorrido";
import { desbloquear } from "@/components/laboratorio/logros";
import { fraseDelCientifico } from "@/components/laboratorio/objetos";
import type { Guion, Linea, Pose } from "./guion";
import { PersonajeRive } from "./PersonajeRive";
import { useMaquinaDeEscribir, useReducirMovimiento } from "./useMaquinaDeEscribir";
import { useReacciones } from "./useReacciones";
import "./personaje.css";

const SILENCIO: Linea = { texto: "" };
/** Distancia a cada borde de la pantalla (coincide con `left-4`). */
const MARGEN = 16;
/** Velocidad de caminata: alturas del personaje por segundo. */
const VELOCIDAD = 1.8;

function posicionDe(linea: Linea): number {
  if (linea.posicion !== undefined) return Math.min(1, Math.max(0, linea.posicion));
  return linea.lado === "derecha" ? 1 : 0;
}

// El científico del laboratorio. Lee del Director en qué escena está el
// visitante y busca en el guion qué decir, qué pose tomar y dónde pararse.
// Si la posición cambia, camina hasta ahí (mirando hacia donde va) y recién
// al llegar habla. Si el visitante toca algo (o lo toca a él), dice eso por
// encima del guion un rato y después vuelve a la escena.
export function Personaje({ guion, esperarIntro = false }: { guion: Guion; esperarIntro?: boolean }) {
  const director = useDirector();
  const escena = useEscenaActual();
  const dicho = useDicho();
  const base: Linea =
    (escena ? guion.escenas[escena] : undefined) ?? guion.inicial ?? SILENCIO;
  // En una escena por pasos, el científico dice la línea del paso actual.
  const paso = usePasoActual(base.pasos?.length ?? 0);
  const lineaEscena: Linea = base.pasos?.[paso] ? { ...base, ...base.pasos[paso] } : base;
  const linea: Linea = dicho
    ? { ...lineaEscena, texto: dicho.texto, pose: (dicho.pose as Pose | undefined) ?? lineaEscena.pose }
    : lineaEscena;
  const posicion = posicionDe(lineaEscena);
  const reducido = useReducirMovimiento();

  useReacciones(director);

  // Al cambiar de escena, lo que decía por fuera del guion se corta.
  useEffect(() => {
    director.callar();
  }, [escena, director]);

  const contenedor = useRef<HTMLElement>(null);
  const figura = useRef<HTMLDivElement>(null);
  const x = useRef(0);
  const [caminando, setCaminando] = useState(false);
  const [direccion, setDireccion] = useState<1 | -1>(1);

  // Camina a paso constante hasta la posición de la línea. Al llegar se da
  // vuelta hacia el centro de la pantalla, que es donde está lo que comenta.
  useEffect(() => {
    const el = contenedor.current;
    const fig = figura.current;
    if (!el || !fig) return;

    const destino = () => posicion * Math.max(0, window.innerWidth - fig.offsetWidth - MARGEN * 2);
    const colocar = (px: number) => {
      x.current = px;
      el.style.transform = `translateX(${px}px)`;
    };
    const miraAlLlegar: 1 | -1 = posicion > 0.5 ? -1 : 1;
    let cuadro = 0;
    let ultimo = 0;

    const paso = (t: number) => {
      const dt = Math.min(0.05, (t - ultimo) / 1000);
      ultimo = t;
      const velocidad = fig.offsetHeight * VELOCIDAD;
      const resta = destino() - x.current;
      if (Math.abs(resta) <= velocidad * dt) {
        colocar(destino());
        setCaminando(false);
        setDireccion(miraAlLlegar);
        cuadro = 0;
        return;
      }
      colocar(x.current + Math.sign(resta) * velocidad * dt);
      cuadro = requestAnimationFrame(paso);
    };

    const ir = () => {
      if (cuadro) cancelAnimationFrame(cuadro);
      const resta = destino() - x.current;
      if (reducido || Math.abs(resta) < 2) {
        colocar(destino());
        setCaminando(false);
        setDireccion(miraAlLlegar);
        cuadro = 0;
        return;
      }
      setCaminando(true);
      setDireccion(resta > 0 ? 1 : -1);
      ultimo = performance.now();
      cuadro = requestAnimationFrame(paso);
    };

    // Arranca en el próximo cuadro (y no en el render) y se reacomoda si cambia el ancho.
    cuadro = requestAnimationFrame(ir);
    window.addEventListener("resize", ir);
    return () => {
      window.removeEventListener("resize", ir);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, [posicion, reducido]);

  const pose = caminando ? "caminando" : (linea.pose ?? "quieto");
  // Mientras camina no habla: el globo aparece al llegar y recién ahí se escribe.
  const texto = caminando ? "" : linea.texto;
  const { visible, escribiendo } = useMaquinaDeEscribir(texto);
  const aLaDerecha = posicion > 0.5;

  const hablar = () => {
    const frase = fraseDelCientifico();
    director.decir(frase.texto, frase.pose);
    desbloquear("cientifico");
  };

  const globo = [
    "personaje-globo absolute bottom-full mb-2 w-max max-w-[80vw] rounded-2xl border border-lab-portal/40 bg-lab-panel/95 px-3 py-1.5 font-mano text-lg leading-tight backdrop-blur sm:bottom-6 sm:mb-0 sm:max-w-xs sm:px-4 sm:py-2.5 sm:text-2xl",
    aLaDerecha
      ? "right-0 rounded-br-sm sm:right-full sm:mr-3 sm:rounded-br-2xl sm:rounded-tr-sm"
      : "left-0 rounded-bl-sm sm:left-full sm:ml-3 sm:rounded-bl-2xl sm:rounded-tl-sm",
  ].join(" ");

  return (
    <aside
      ref={contenedor}
      className={[
        "personaje-contenedor pointer-events-none fixed bottom-2 left-4 z-50 will-change-transform",
        esperarIntro ? "espera-intro" : "",
      ].join(" ")}
      aria-live="polite"
    >
      <div ref={figura} className={`personaje-cuerpo relative w-max ${linea.pose === "ausente" ? "ausente" : ""}`}>
        <div
          role="button"
          tabIndex={0}
          aria-label="Hacer hablar al científico"
          title="Tocame"
          onClick={hablar}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              hablar();
            }
          }}
          className="personaje-figura pointer-events-auto cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-lab-portal"
        >
          <PersonajeRive pose={pose} direccion={direccion} className="h-24 sm:h-44" />
        </div>
        {texto && (
          <div className={globo}>
            {visible}
            {escribiendo && <span className="personaje-cursor text-lab-portal">▍</span>}
          </div>
        )}
      </div>
    </aside>
  );
}
