"use client";

import { useEffect } from "react";
import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceEnum,
} from "@rive-app/react-canvas";
import type { Pose } from "./guion";
import { PersonajeSVG } from "./PersonajeSVG";

// Las poses que conoce el archivo Rive (rive/cientifico/generar.mjs).
// Las demás caen en "quieto".
const POSES_RIVE = new Set(["quieto", "senalando", "sorprendido", "eureka"]);

// El científico animado en Rive. Respira, parpadea y cambia de pose según
// el dato `pose` del view model del archivo. Mientras carga, se ve el SVG.
export function PersonajeRive({ pose, className = "" }: { pose: Pose; className?: string }) {
  const { rive, RiveComponent } = useRive({
    src: "/personaje/cientifico.riv",
    stateMachine: "Personaje",
    autoplay: true,
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
