"use client";

import { useRef } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";

// Escena 2: un mismo club en muchas versiones que colapsan en una sola.
const VARIANTES = [
  { texto: "VDV", x: -38, y: -28 },
  { texto: "villa diaz", x: 34, y: -32 },
  { texto: "Villa D. Velez", x: -44, y: 10 },
  { texto: "V. Díaz Vélez", x: 40, y: 14 },
  { texto: "VILLA DIAZ VELEZ", x: -10, y: 34 },
  { texto: "Villa Díaz Velez", x: 22, y: -8 },
];

export function EscenaMultiverso() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Estado inicial explícito: cada versión en su lugar, el club final escondido.
      gsap.set(".variante", {
        opacity: 0,
        scale: 0.6,
        x: (i: number) => `${VARIANTES[i].x}vw`,
        y: (i: number) => `${VARIANTES[i].y}vh`,
      });
      gsap.set(".final", { opacity: 0, scale: 0.5 });
      linea
        .to(".variante", { opacity: 1, scale: 1, duration: 1, stagger: 0.15 })
        .to(".variante", { x: 0, y: 0, duration: 2, ease: "power3.inOut", stagger: 0.05 }, "+=1")
        .to(".variante", { opacity: 0, scale: 0.3, duration: 0.5 }, "-=0.4")
        .to(".final", { opacity: 1, scale: 1, duration: 1, ease: "back.out(2)" }, "-=0.2");
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative grid h-full place-items-center">
      {VARIANTES.map((v) => (
        <span
          key={v.texto}
          className="variante absolute rounded-md border border-lab-borde bg-lab-panel px-3 py-1.5 font-mono text-sm"
        >
          {v.texto}
        </span>
      ))}
      <div className="final absolute rounded-xl border-2 border-lab-portal bg-lab-panel px-6 py-4 text-center">
        <span className="block text-2xl font-bold">Villa Díaz Vélez</span>
        <span className="font-mono text-xs text-lab-tenue">1 club · 6 versiones fusionadas</span>
      </div>
      <p className="absolute top-10 font-mono text-sm text-lab-tenue">Escena 2 · Multiverso</p>
    </div>
  );
}
