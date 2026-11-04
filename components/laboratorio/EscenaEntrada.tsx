"use client";

import { useRef } from "react";
import { useEscena, useGSAP } from "@/components/recorrido";

// La puerta del laboratorio: el nombre enorme te recibe y al scrollear se lo
// traga el portal que lleva al primer experimento.
export function EscenaEntrada({ nombre, titulo }: { nombre: string; titulo: string }) {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Todo visible desde el primer momento. Al scrollear se va la pista y el
      // cartel se achica apenas: enseguida se abre el portal y se lo traga.
      linea
        .to(".pista", { opacity: 0, duration: 0.4 })
        .to(".cartel", { scale: 0.94, y: -16, duration: 1, ease: "power1.in" }, "<+=0.1");
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4 text-center">
      <div className="cartel">
        <p className="font-mano text-2xl text-lab-portal sm:text-3xl">el laboratorio de</p>
        <h1 className="brillo-portal font-display mt-1 text-[26vw] leading-[0.9] font-extrabold tracking-tight uppercase sm:text-[16vw]">
          {nombre}
        </h1>
        <p className="mt-4 text-lg text-lab-tenue sm:text-xl">{titulo}</p>
        <p className="pista mt-10 font-mano text-xl text-lab-tenue">scrolleá para entrar ↓</p>
      </div>
    </div>
  );
}
