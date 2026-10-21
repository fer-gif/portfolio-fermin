"use client";

import { useEffect } from "react";
import {
  RuntimeLoader,
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceEnum,
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
const VERSION = 3;

// Las poses que conoce el archivo Rive (rive/cientifico/generar.mjs).
// Las demás caen en "quieto".
const POSES_RIVE = new Set(["quieto", "senalando", "sorprendido", "eureka"]);

// El científico animado en Rive. Respira, parpadea y cambia de pose según
// el dato `pose` del view model del archivo. Mientras carga, se ve el SVG.
export function PersonajeRive({ pose, className = "" }: { pose: Pose; className?: string }) {
  const { rive, RiveComponent } = useRive({
    src: `/personaje/cientifico.riv?v=${VERSION}`,
    stateMachine: "Personaje",
    autoplay: true,
    onLoadError: () => console.warn("No se pudo cargar el personaje Rive; queda el SVG de respaldo."),
  });
  const modelo = useViewModel(rive, { useDefault: true });
  const instancia = useViewModelInstance(modelo, { rive });
  const { setValue } = useViewModelInstanceEnum("pose", instancia);

  useEffect(() => {
    setValue(POSES_RIVE.has(pose) ? pose : "quieto");
  }, [pose, setValue]);

  return (
    <div className={`relative aspect-[400/340] ${className}`}>
      {!rive && <PersonajeSVG pose={pose} className="absolute inset-0 m-auto h-[88%] w-auto" />}
      <RiveComponent className={`h-full w-full transition-opacity duration-500 ${rive ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}
