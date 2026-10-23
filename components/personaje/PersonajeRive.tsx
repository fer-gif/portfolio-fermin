"use client";

import { useEffect, useRef } from "react";
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

// El científico animado en Rive. Respira, parpadea, cambia de pose según el
// dato `pose` y sigue el mouse con los ojos. Mientras carga, se ve el SVG.
// `direccion` -1 lo da vuelta (mira a la izquierda); el dibujo mira a la derecha.
export function PersonajeRive({
  pose,
  direccion = 1,
  className = "",
}: {
  pose: Pose;
  direccion?: 1 | -1;
  className?: string;
}) {
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
