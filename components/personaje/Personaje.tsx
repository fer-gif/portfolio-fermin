"use client";

import { useEffect, useRef, useState } from "react";
import { useEscenaActual, usePasoActual } from "@/components/recorrido";
import type { Guion, Linea } from "./guion";
import { PersonajeRive } from "./PersonajeRive";
import { useMaquinaDeEscribir, useReducirMovimiento } from "./useMaquinaDeEscribir";
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
// al llegar habla.
export function Personaje({ guion, esperarIntro = false }: { guion: Guion; esperarIntro?: boolean }) {
  const escena = useEscenaActual();
  const base: Linea =
    (escena ? guion.escenas[escena] : undefined) ?? guion.inicial ?? SILENCIO;
  // En una escena por pasos, el científico dice la línea del paso actual.
  const paso = usePasoActual(base.pasos?.length ?? 0);
  const linea: Linea = base.pasos?.[paso] ? { ...base, ...base.pasos[paso] } : base;
  const posicion = posicionDe(linea);
  const reducido = useReducirMovimiento();

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

  const globo = [
    "personaje-globo absolute bottom-full mb-2 w-max max-w-[80vw] rounded-2xl border border-lab-borde bg-lab-panel/95 px-3 py-2 text-xs leading-snug backdrop-blur sm:bottom-6 sm:mb-0 sm:max-w-xs sm:px-4 sm:py-3 sm:text-sm",
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
        <PersonajeRive pose={pose} direccion={direccion} className="h-24 sm:h-44" />
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
