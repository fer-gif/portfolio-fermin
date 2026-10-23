"use client";

import { useEffect, useRef } from "react";
import { gsap, useDirector, useEscena, useEscenaActual, useGSAP } from "@/components/recorrido";
import { desbloquear, LOGROS, useLogros } from "./logros";

interface Enlace {
  etiqueta: string;
  url: string;
}

// La salida del laboratorio: quién soy, por dónde contactarme, y la repisa
// del visitante con lo que desbloqueó (y lo que le falta, con el camino).
export function EscenaSalida({
  nombre,
  presentacion,
  enlaces,
  cv,
  repositorio,
}: {
  nombre: string;
  presentacion: string;
  enlaces: Enlace[];
  /** Ruta al CV en PDF; si no hay, no se muestra el botón. */
  cv?: string | null;
  /** Repo de este mismo sitio. */
  repositorio?: string;
}) {
  const { linea } = useEscena();
  const director = useDirector();
  const escena = useEscenaActual();
  const logros = useLogros();
  const ref = useRef<HTMLDivElement>(null);
  const faltan = LOGROS.filter((l) => !logros.includes(l.id) && l.id !== "salida");

  // Llegar hasta acá también cuenta.
  useEffect(() => {
    if (escena === "salida") desbloquear("salida");
  }, [escena]);

  useGSAP(
    () => {
      gsap.set(".linea", { opacity: 0, y: 20 });
      linea.to(".linea", { opacity: 1, y: 0, duration: 0.6, stagger: 0.2 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4 sm:pt-[9svh]">
      <div className="max-h-full max-w-xl overflow-y-auto text-center" data-desborda>
        <p className="linea font-mano text-2xl text-lab-portal">hasta acá llegamos. gracias por bajar.</p>
        <h2 className="linea brillo-portal font-display mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{nombre}</h2>
        <p className="linea mt-3 text-lg text-lab-tenue">{presentacion}</p>
        <ul className="linea mt-6 flex flex-wrap justify-center gap-3 font-mono text-sm">
          {cv && (
            <li>
              <a
                href={cv}
                download
                className="rounded-full border border-lab-portal bg-lab-portal px-4 py-2 text-lab-fondo transition-colors hover:bg-transparent hover:text-lab-portal"
              >
                descargar CV ↓
              </a>
            </li>
          )}
          {enlaces.map((e) => (
            <li key={e.url}>
              <a
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-lab-borde px-4 py-2 transition-colors hover:border-lab-portal hover:text-lab-portal"
              >
                {e.etiqueta} ↗
              </a>
            </li>
          ))}
        </ul>

        <div className="linea mx-auto mt-6 max-w-md rounded-2xl border border-lab-borde bg-lab-panel/70 p-4 text-left">
          <p className="font-mano text-xl text-lab-portal">
            desbloqueaste {logros.length} de {LOGROS.length} experimentos
          </p>
          {faltan.length === 0 ? (
            <p className="mt-1 text-sm text-lab-tenue">Todos. Probaste cada cosa del laboratorio: eso ya dice bastante de vos.</p>
          ) : (
            <>
              <p className="mt-1 text-xs text-lab-tenue">Te faltan estos. Tocá uno y te llevo.</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {faltan.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => l.escena && director.irA(l.escena)}
                      disabled={!l.escena}
                      title={l.pista}
                      className="rounded-full border border-lab-borde px-2.5 py-1 font-mono text-[11px] text-lab-tenue transition-colors hover:border-lab-portal hover:text-lab-portal disabled:cursor-help disabled:hover:border-lab-borde disabled:hover:text-lab-tenue"
                    >
                      {l.nombre}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {repositorio && (
          <p className="linea mt-6 font-mano text-lg text-lab-tenue">
            este laboratorio también es código:{" "}
            <a href={repositorio} target="_blank" rel="noopener noreferrer" className="garabato text-lab-portal">
              ver el repo ↗
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
