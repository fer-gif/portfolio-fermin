"use client";

import { MarcoArtefacto } from "@/components/laboratorio/MarcoArtefacto";

// Pendiente: selector de sector + gráfico de dependencia,
// con los datos procesados en ./data.
export default function Artefacto() {
  return (
    <MarcoArtefacto titulo="Medidor de dependencia">
      Acá va el selector de sector (autos, autopartes, trigo).
    </MarcoArtefacto>
  );
}
