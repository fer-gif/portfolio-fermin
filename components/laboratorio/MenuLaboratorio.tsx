"use client";

import { useState } from "react";
import { useDirector, useEscenaActual } from "@/components/recorrido";

interface Destino {
  escena: string;
  etiqueta: string;
}

// Atajo para quien no quiere hacer el recorrido completo:
// un menú fijo que lleva directo a cualquier mesa.
export function MenuLaboratorio({ destinos }: { destinos: Destino[] }) {
  const director = useDirector();
  const actual = useEscenaActual();
  const [abierto, setAbierto] = useState(false);

  const ir = (escena: string) => {
    setAbierto(false);
    director.irA(escena);
  };

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
        <ul className="w-56 rounded-xl border border-lab-borde bg-lab-panel/95 p-2 font-mono text-sm backdrop-blur">
          {destinos.map((d) => (
            <li key={d.escena}>
              <button
                type="button"
                onClick={() => ir(d.escena)}
                className={`w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-lab-borde ${
                  actual === d.escena ? "text-lab-portal" : ""
                }`}
              >
                {d.etiqueta}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
