"use client";

import { useEffect, useRef } from "react";
import { gsap, useDirector, useEscena, useEscenaActual, useGSAP } from "@/components/recorrido";
import { CajaDeHerramientas } from "./CajaDeHerramientas";
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
  herramientas = [],
}: {
  nombre: string;
  presentacion: string;
  enlaces: Enlace[];
  /** Ruta al CV en PDF; si no hay, no se muestra el botón. */
  cv?: string | null;
  /** Repo de este mismo sitio. */
  repositorio?: string;
  /** Con qué trabajo, agrupado (lib/perfil.ts). */
  herramientas?: { grupo: string; items: string[] }[];
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
    // Una tarjeta grande sobre la pared (así el texto no queda encima de los
    // cuadros): arriba quién soy y el contacto; abajo, en dos columnas, con qué
    // trabajo y los experimentos que le faltan al visitante.
    <div ref={ref} className="grid h-full place-items-center px-4 sm:pt-[7svh] sm:pb-[4svh]">
      <div
        className="max-h-full w-full max-w-4xl overflow-y-auto rounded-3xl border border-lab-borde bg-lab-panel p-5 text-center shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] sm:p-8"
        data-desborda
      >
        <p className="linea font-mano text-2xl text-lab-portal">hasta acá llegamos. gracias por bajar.</p>
        <h2 className="linea brillo-portal font-display mt-1 text-4xl font-extrabold sm:text-6xl">{nombre}</h2>
        <p className="linea mx-auto mt-2 max-w-xl text-lg text-lab-tenue">{presentacion}</p>
        <ul className="linea mt-5 flex flex-wrap justify-center gap-3 font-mono text-sm">
          {cv && (
            <li>
              <a
                href={cv}
                download
                className="inline-block rounded-full border border-lab-portal bg-lab-portal px-4 py-2 text-lab-fondo transition-colors hover:bg-transparent hover:text-lab-portal"
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
                className="inline-block rounded-full border border-lab-borde px-4 py-2 transition-colors hover:border-lab-portal hover:text-lab-portal"
              >
                {e.etiqueta} ↗
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-7 grid gap-5 border-t border-lab-borde pt-6 text-left md:grid-cols-[1.35fr_1fr] md:gap-8">
          {herramientas.length > 0 && (
            <div className="linea">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-lab-tenue">con qué trabajo</p>
              <CajaDeHerramientas herramientas={herramientas} />
            </div>
          )}

          <div className="linea">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-lab-tenue">tu recorrido</p>
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
