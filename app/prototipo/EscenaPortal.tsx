"use client";

import { useRef } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";

// Escena 1: aparece el título, se abre un portal y te traga.
export function EscenaPortal() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // El título se ve desde el primer momento, sin scrollear.
      // Lo que aparece después arranca escondido.
      gsap.set(".portal", { scale: 0, rotate: -90 });
      linea
        .to(".portal", { scale: 1, rotate: 0, duration: 2, ease: "power2.out" })
        .to(".titulo", { opacity: 0, scale: 0.9, duration: 1 }, "<+=1")
        .to(".portal", { scale: 14, duration: 2, ease: "power2.in" })
        .to(".portal", { opacity: 0, duration: 0.5 }, "-=0.3");
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center">
      <div
        className="portal absolute size-64 rounded-full border-[14px] border-lab-portal shadow-[0_0_80px_20px_rgba(126,227,91,0.35)]"
        style={{ background: "radial-gradient(circle, #0b0f0c 40%, #7ee35b 100%)" }}
      />
      <h1 className="titulo relative text-center text-5xl font-bold">
        Escena 1 · Portal
        <span className="mt-4 block font-mono text-base font-normal text-lab-tenue">
          scrolleá para abrirlo
        </span>
      </h1>
    </div>
  );
}
