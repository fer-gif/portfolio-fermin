"use client";

import { FichaTecnica } from "@/components/laboratorio/FichaTecnica";
import type { Proyecto } from "@/proyectos";
import { ENDPOINTS } from "../api";

// Ficha común más la fila con los endpoints de la API.
export function Ficha({ proyecto }: { proyecto: Proyecto }) {
  return (
    <FichaTecnica
      proyecto={proyecto}
      filasExtra={[
        {
          etiqueta: "API",
          contenido: (
            <span className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs">
              {Object.entries(ENDPOINTS).map(([k, url]) => (
                <a key={k} href={url} target="_blank" rel="noopener noreferrer" className="text-lab-portal underline underline-offset-4">
                  /{k}
                </a>
              ))}
            </span>
          ),
        },
      ]}
    />
  );
}
