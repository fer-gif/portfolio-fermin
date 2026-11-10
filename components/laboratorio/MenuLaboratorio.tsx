"use client";

import { useState } from "react";
import Link from "next/link";
import { useDirector, useEscenaActual, viajar } from "@/components/recorrido";

/**
 * A dónde lleva una línea del menú: a una escena de esta página (`escena`) o
 * a otra página, pasando por el portal (`href`). Sin ninguno de los dos es un
 * título que agrupa a sus `hijos`.
 */
export interface Destino {
  etiqueta: string;
  escena?: string;
  href?: string;
  /** Las paradas de un proyecto, o los proyectos de la vidriera. */
  hijos?: Destino[];
}

// Atajo para quien no quiere hacer el recorrido completo:
// un menú fijo que lleva directo a cualquier parada o proyecto.
export function MenuLaboratorio({ destinos }: { destinos: Destino[] }) {
  const director = useDirector();
  const actual = useEscenaActual();
  const [abierto, setAbierto] = useState(false);

  const ir = (d: Destino) => {
    setAbierto(false);
    if (d.escena) director.irA(d.escena);
    else if (d.href) viajar(d.href);
  };

  const boton = (d: Destino, hijo = false) =>
    d.escena || d.href ? (
      <button
        type="button"
        onClick={() => ir(d)}
        className={`w-full rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-lab-borde ${
          hijo ? "pl-6 text-xs text-lab-tenue hover:text-lab-texto" : ""
        } ${d.escena && actual === d.escena ? "text-lab-portal" : ""}`}
      >
        {d.etiqueta}
      </button>
    ) : (
      <p className="px-3 pt-2 pb-1 text-[10px] tracking-wider text-lab-tenue uppercase">{d.etiqueta}</p>
    );

  return (
    <nav className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        className="rounded-full border border-lab-borde bg-lab-panel px-4 py-2 font-mono text-xs text-lab-tenue transition-colors hover:border-lab-portal hover:text-lab-portal"
      >
        {abierto ? "cerrar ×" : "saltar a ☰"}
      </button>
      {abierto && (
        <div className="flex w-64 flex-col gap-2">
          <ul
            className="max-h-[60svh] overflow-y-auto rounded-xl border border-lab-borde bg-lab-panel p-2 font-mono text-sm"
            data-lenis-prevent
          >
            {destinos.map((d) => (
              <li key={d.escena ?? d.href ?? d.etiqueta}>
                {boton(d)}
                {d.hijos?.map((h) => (
                  <div key={h.escena ?? h.href ?? h.etiqueta}>{boton(h, true)}</div>
                ))}
              </li>
            ))}
          </ul>
          <Link
            href="/directo"
            className="rounded-xl border border-lab-borde bg-lab-panel px-3 py-2 text-right font-mono text-xs text-lab-tenue transition-colors hover:border-lab-portal hover:text-lab-portal"
          >
            modo directo · sin recorrido ↗
          </Link>
        </div>
      )}
    </nav>
  );
}
