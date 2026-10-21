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
}: {
  nombre: string;
  presentacion: string;
  enlaces: Enlace[];
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
      </div>
    </div>
  );
}
