"use client";

import { useState } from "react";
import { useDirector, useEscenaActual } from "@/components/recorrido";

export interface Destino {
  escena: string;
  etiqueta: string;
  /** Las dimensiones de un proyecto. */
  hijos?: { escena: string; etiqueta: string }[];
}

// Atajo para quien no quiere hacer el recorrido completo:
// un menú fijo que lleva directo a cualquier mesa o dimensión.
export function MenuLaboratorio({ destinos }: { destinos: Destino[] }) {
  const director = useDirector();
  const actual = useEscenaActual();
  const [abierto, setAbierto] = useState(false);

  const ir = (escena: string) => {
    setAbierto(false);
    director.irA(escena);
  };

  const boton = (escena: string, etiqueta: string, hijo = false) => (
    <button
      type="button"
      onClick={() => ir(escena)}
      className={`w-full rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-lab-borde ${
        hijo ? "pl-6 text-xs text-lab-tenue hover:text-lab-texto" : ""
      } ${actual === escena ? "text-lab-portal" : ""}`}
    >
      {etiqueta}
    </button>
  );

  return (
    <nav className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        className="rounded-full border border-lab-borde bg-lab-panel/90 px-4 py-2 font-mono text-xs text-lab-tenue backdrop-blur transition-colors hover:border-lab-portal hover:text-lab-portal"
      >
        {abierto ? "cerrar ×" : "saltar a ☰"}
      </button>
      {abierto && (
        <ul
          className="max-h-[70svh] w-64 overflow-y-auto rounded-xl border border-lab-borde bg-lab-panel/95 p-2 font-mono text-sm backdrop-blur"
          data-lenis-prevent
        >
          {destinos.map((d) => (
            <li key={d.escena}>
              {boton(d.escena, d.etiqueta)}
              {d.hijos?.map((h) => (
                <div key={h.escena}>{boton(h.escena, h.etiqueta, true)}</div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
