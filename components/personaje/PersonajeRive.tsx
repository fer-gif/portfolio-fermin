"use client";

import { useEffect, useRef, useState } from "react";
import {
  RuntimeLoader,
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceEnum,
  useViewModelInstanceNumber,
} from "@rive-app/react-canvas";
import type { Pose } from "./guion";
import { PersonajeSVG } from "./PersonajeSVG";

// El motor de Rive (WASM) se sirve desde el propio sitio: por defecto se
// descarga de unpkg.com y los bloqueadores de los navegadores lo frenan.
// Copia de node_modules/@rive-app/canvas/rive.wasm (misma versión del paquete).
if (typeof window !== "undefined") {
  RuntimeLoader.setWasmUrl("/personaje/rive.wasm");
}

// Subir este número cada vez que cambia public/personaje/cientifico.riv,
// para que el navegador no muestre una versión vieja del personaje.
const VERSION = 6;

// Las poses que conoce el archivo Rive (rive/cientifico/generar.mjs).
// Las demás caen en "quieto".
const POSES_RIVE = new Set(["quieto", "senalando", "sorprendido", "eureka", "caminando"]);

// A cuántos píxeles del personaje la mirada llega al tope (-1 / 1).
const ALCANCE_MIRADA = 420;

// Milisegundos mínimos entre dos dibujos del personaje (~30 por segundo; un
// poco menos de 33,3 para no saltear cuadros por redondeo del navegador).
const INTERVALO_CUADRO = 30;

// A 30 cuadros por segundo la respiración, el parpadeo y la caminata se ven
// igual y el costo baja a la mitad. Se envuelve la función que Rive pide en
// cada cuadro: si no pasó el intervalo, pide el próximo sin dibujar (el tiempo
// se acumula, así la animación no se pone lenta). Devuelve cómo deshacerlo.
function limitarCuadros(rive: unknown, intervalo: number) {
  const motor = rive as {
    _boundDraw?: (t: number) => void;
    frameRequestId: number | null;
    scheduleRendering: () => void;
  };
  const dibujar = motor._boundDraw;
  if (typeof dibujar !== "function") return undefined;
  let ultimo = 0;
  motor._boundDraw = (t: number) => {
    if (t - ultimo < intervalo) {
      motor.frameRequestId = null;
      motor.scheduleRendering();
      return;
    }
    ultimo = t;
    dibujar(t);
  };
  return () => {
    motor._boundDraw = dibujar;
  };
}

interface Props {
  pose: Pose;
  direccion?: 1 | -1;
  className?: string;
}

// El motor de Rive pesa 2 MB: se pide recién cuando terminó la intro (el
// científico fijo no se ve antes) y el navegador está libre, así no compite
// con lo que hace falta para ver la página. Hasta entonces, el SVG.
function useCargarRive() {
  const [cargar, setCargar] = useState(false);
  useEffect(() => {
    const raiz = document.documentElement;
    let espera = 0;
    const pedir = () => {
      espera = window.requestIdleCallback
        ? window.requestIdleCallback(() => setCargar(true), { timeout: 2500 })
        : window.setTimeout(() => setCargar(true), 300);
    };
    if (raiz.classList.contains("intro-lista")) {
      pedir();
      return () => (window.cancelIdleCallback ?? window.clearTimeout)(espera);
    }
    const observador = new MutationObserver(() => {
      if (!raiz.classList.contains("intro-lista")) return;
      observador.disconnect();
      pedir();
    });
    observador.observe(raiz, { attributes: true, attributeFilter: ["class"] });
    return () => {
      observador.disconnect();
      (window.cancelIdleCallback ?? window.clearTimeout)(espera);
    };
  }, []);
  return cargar;
}

// El científico: el SVG hasta que llega el motor de Rive, y después el Rive.
export function PersonajeRive(props: Props) {
  const cargar = useCargarRive();
  if (!cargar) {
    return (
      <div
        className={`relative aspect-[400/340] ${props.className ?? ""}`}
        style={{ transform: (props.direccion ?? 1) < 0 ? "scaleX(-1)" : undefined }}
      >
        <PersonajeSVG pose={props.pose} className="absolute inset-0 m-auto h-[88%] w-auto" />
      </div>
    );
  }
  return <RiveVivo {...props} />;
}

// El científico animado en Rive. Respira, parpadea, cambia de pose según el
// dato `pose` y sigue el mouse con los ojos. Mientras carga, se ve el SVG.
// `direccion` -1 lo da vuelta (mira a la izquierda); el dibujo mira a la derecha.
function RiveVivo({ pose, direccion = 1, className = "" }: Props) {
  const contenedor = useRef<HTMLDivElement>(null);
  const direccionRef = useRef(direccion);
  useEffect(() => {
    direccionRef.current = direccion;
  }, [direccion]);
  const { rive, RiveComponent } = useRive({
    src: `/personaje/cientifico.riv?v=${VERSION}`,
    stateMachine: "Personaje",
    autoplay: true,
    onLoadError: () => console.warn("No se pudo cargar el personaje Rive; queda el SVG de respaldo."),
  });
  const modelo = useViewModel(rive, { useDefault: true });
  const instancia = useViewModelInstance(modelo, { rive });
  const { setValue: fijarPose } = useViewModelInstanceEnum("pose", instancia);
  const { setValue: fijarMiradaX } = useViewModelInstanceNumber("miradaX", instancia);
  const { setValue: fijarMiradaY } = useViewModelInstanceNumber("miradaY", instancia);

  useEffect(() => {
    fijarPose(POSES_RIVE.has(pose) ? pose : "quieto");
  }, [pose, fijarPose]);

  // Rive dibuja 60 veces por segundo y cada dibujo (en canvas 2D) le cuesta
  // varios milisegundos al procesador, aunque el científico solo respire.
  useEffect(() => (rive ? limitarCuadros(rive, INTERVALO_CUADRO) : undefined), [rive]);

  // Los ojos siguen el puntero. Solo donde hay mouse: en el celular no hay
  // nada que seguir y los ojos quedan al frente.
  useEffect(() => {
    if (!instancia || !window.matchMedia("(hover: hover)").matches) return;

    let objetivo = { x: 0, y: 0 };
    let actual = { x: 0, y: 0 };
    let cuadro = 0;

    const animar = () => {
      // se acerca suavemente al objetivo: la mirada no "salta"
      actual = { x: actual.x + (objetivo.x - actual.x) * 0.15, y: actual.y + (objetivo.y - actual.y) * 0.15 };
      // si está dado vuelta, la mirada también
      fijarMiradaX(actual.x * direccionRef.current);
      fijarMiradaY(actual.y);
      if (Math.abs(objetivo.x - actual.x) > 0.002 || Math.abs(objetivo.y - actual.y) > 0.002) {
        cuadro = requestAnimationFrame(animar);
      } else {
        cuadro = 0;
      }
    };
    const pedirCuadro = () => {
      if (!cuadro) cuadro = requestAnimationFrame(animar);
    };

    const alMover = (e: PointerEvent) => {
      const caja = contenedor.current?.getBoundingClientRect();
      if (!caja) return;
      // los ojos están en el tercio superior del personaje
      const centroX = caja.left + caja.width * 0.5;
      const centroY = caja.top + caja.height * 0.3;
      objetivo = {
        x: Math.max(-1, Math.min(1, (e.clientX - centroX) / ALCANCE_MIRADA)),
        y: Math.max(-1, Math.min(1, (e.clientY - centroY) / ALCANCE_MIRADA)),
      };
      pedirCuadro();
    };
    const alSalir = () => {
      objetivo = { x: 0, y: 0 };
      pedirCuadro();
    };

    window.addEventListener("pointermove", alMover);
    document.addEventListener("pointerleave", alSalir);
    return () => {
      window.removeEventListener("pointermove", alMover);
      document.removeEventListener("pointerleave", alSalir);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, [instancia, fijarMiradaX, fijarMiradaY]);

  return (
    <div
      ref={contenedor}
      className={`relative aspect-[400/340] transition-transform duration-300 ${className}`}
      style={{ transform: direccion < 0 ? "scaleX(-1)" : undefined }}
    >
      {!rive && <PersonajeSVG pose={pose} className="absolute inset-0 m-auto h-[88%] w-auto" />}
      <RiveComponent className={`h-full w-full transition-opacity duration-500 ${rive ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}
