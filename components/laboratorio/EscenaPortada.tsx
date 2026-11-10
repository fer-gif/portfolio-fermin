"use client";

import { useRef } from "react";
import { useEscena, useGSAP } from "@/components/recorrido";

// La primera pantalla, la que deja ver la puerta al correrse: de quién es el
// portafolio y a qué se dedica. Nada más.
export function EscenaPortada({ nombre, titulo }: { nombre: string; titulo: string }) {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  // "Programador y Data Analyst": la "y" va a mano, como una nota.
  const [antes, despues] = titulo.split(" y ");

  useGSAP(
    () => {
      // Al bajar, se va la pista y el cartel se aleja apenas antes del relevo.
      linea
        .to(".pista", { opacity: 0, duration: 0.3 })
        .to(".cartel", { scale: 0.95, y: -16, duration: 1, ease: "power1.in" }, 0);
    },
    { scope: ref },
  );

  return (
    // Abajo queda lugar para el científico y su globo.
    <div ref={ref} className="flex h-full flex-col items-center justify-center px-4 text-center sm:pb-[4svh]">
      <header className="cartel">
        <p className="font-mano text-2xl text-lab-portal sm:text-[min(2.6vw,4.4svh)]">el portafolio de</p>
        <h1 className="brillo-portal font-display text-[25vw] leading-[0.82] font-extrabold uppercase sm:text-[min(17vw,29svh)]">
          {nombre}
        </h1>
        <p className="mt-3 font-display text-[7vw] leading-tight font-bold sm:mt-[2svh] sm:text-[min(3.4vw,5.6svh)]">
          {despues ? (
            <>
              {antes} <span className="font-mano font-normal text-lab-portal">y</span> {despues}
            </>
          ) : (
            titulo
          )}
        </p>
      </header>
      <p className="pista mt-[7svh] font-mano text-lg text-lab-tenue sm:text-xl">
        bajá <span className="flecha-pista inline-block">↓</span>
      </p>
    </div>
  );
}
