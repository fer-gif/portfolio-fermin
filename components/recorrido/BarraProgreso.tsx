"use client";

import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "./gsap";

// Línea finita arriba de todo: cuánto del recorrido completo lleva el visitante.
export function BarraProgreso() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (st) => {
        if (ref.current) ref.current.style.transform = `scaleX(${st.progress})`;
      },
    });
  });

  return (
    <div className="fixed top-0 left-0 z-50 h-0.5 w-full bg-lab-borde">
      <div ref={ref} className="h-full origin-left bg-lab-portal" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
