"use client";

import { useDirector, useEscenaActual } from "@/components/recorrido";

export interface Capitulo {
  /** Escena a la que lleva el punto. */
  escena: string;
  etiqueta: string;
  /** Prefijos de las escenas que pertenecen a este capítulo (sus dimensiones). */
  prefijos?: string[];
}

// Una columna de puntos a la derecha, siempre visible en pantalla grande:
// dónde estás en el recorrido y a dónde podés saltar. En celular alcanza con
// el menú "saltar a".
export function BarraCapitulos({ capitulos }: { capitulos: Capitulo[] }) {
  const director = useDirector();
  const actual = useEscenaActual();
  const indiceActivo = capitulos.findIndex(
    (c) => actual === c.escena || c.prefijos?.some((p) => actual?.startsWith(p)),
  );

  return (
    // Solo el punto recibe el mouse: la etiqueta (invisible hasta el hover) no
    // tiene que taparle el clic a lo que hay detrás, como la tabla de surf.
    <nav
      aria-label="Capítulos"
      className="pointer-events-none fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 flex-col items-end gap-1 sm:flex"
    >
      {capitulos.map((c, i) => {
        const activo = i === indiceActivo;
        return (
          <button
            key={c.escena}
            type="button"
            onClick={() => director.irA(c.escena)}
            aria-current={activo ? "step" : undefined}
            className="group pointer-events-none flex items-center gap-2"
          >
            <span
              className={`translate-x-1 font-mono text-[11px] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 ${
                activo ? "text-lab-portal" : "text-lab-tenue"
              }`}
            >
              {c.etiqueta}
            </span>
            <span className="pointer-events-auto flex size-6 items-center justify-center">
              <span
                className={`block rounded-full border transition-all ${
                  activo
                    ? "size-3 border-lab-portal bg-lab-portal shadow-[0_0_10px_rgba(151,206,76,0.6)]"
                    : "size-2 border-lab-tenue/60 bg-transparent group-hover:border-lab-portal"
                }`}
              />
            </span>
          </button>
        );
      })}
    </nav>
  );
}
