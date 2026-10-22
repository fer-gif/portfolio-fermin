"use client";

import { useRef } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";

interface Enlace {
  etiqueta: string;
  url: string;
}

// La salida del laboratorio: quién soy y por dónde contactarme.
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
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".linea", { opacity: 0, y: 20 });
      linea.to(".linea", { opacity: 1, y: 0, duration: 0.6, stagger: 0.25 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="max-w-xl text-center">
        <p className="linea font-mono text-sm text-lab-portal">~/salida</p>
        <h2 className="linea mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{nombre}</h2>
        <p className="linea mt-4 text-lg text-lab-tenue">{presentacion}</p>
        <ul className="linea mt-8 flex flex-wrap justify-center gap-3 font-mono text-sm">
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
        {repositorio && (
          <p className="linea mt-8 font-mono text-xs text-lab-tenue">
            este laboratorio también es código:{" "}
            <a href={repositorio} target="_blank" rel="noopener noreferrer" className="text-lab-portal underline underline-offset-4">
              ver el repo ↗
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
