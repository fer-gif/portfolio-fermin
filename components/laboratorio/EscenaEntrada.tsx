"use client";

import { useRef } from "react";
import { useEscena, useGSAP } from "@/components/recorrido";

// La puerta del laboratorio: el nombre enorme te recibe y al scrollear se abre paso.
export function EscenaEntrada({ nombre, titulo }: { nombre: string; titulo: string }) {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Todo visible desde el primer momento; al scrollear el cartel se abre paso.
      linea
        .to(".pista", { opacity: 0, duration: 0.4 })
        .to(".cartel", { scale: 0.85, opacity: 0, y: -60, duration: 1.5, ease: "power2.in" }, "<+=0.2");
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4 text-center">
      <div className="cartel">
        <p className="font-mono text-sm text-lab-portal sm:text-base">~/el laboratorio de</p>
        <h1 className="mt-2 text-[26vw] leading-[0.9] font-extrabold tracking-tighter uppercase sm:text-[16vw]">
          {nombre}
        </h1>
        <p className="mt-4 text-lg text-lab-tenue sm:text-xl">{titulo}</p>
        <p className="pista mt-10 font-mono text-xs text-lab-tenue">scrolleá para entrar ↓</p>
      </div>
    </div>
  );
}
