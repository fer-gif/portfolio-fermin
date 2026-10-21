"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";

// Portal de entrada a un proyecto: título, gancho, y al scrollear el portal
// se abre y te rodea.
export function EscenaPortal({ titulo, gancho, etiqueta }: { titulo: string; gancho: ReactNode; etiqueta?: string }) {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".portal", { scale: 0, rotate: -90 });
      linea
        .to(".portal", { scale: 1, rotate: 0, duration: 2, ease: "power2.out" })
        .to(".cartel", { opacity: 0, scale: 0.9, duration: 1 }, "<+=1")
        .to(".portal", { scale: 6, duration: 2, ease: "power2.in" });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div
        className="portal absolute size-64 rounded-full border-[14px] border-lab-portal shadow-[0_0_80px_20px_rgba(126,227,91,0.35)]"
        style={{ background: "radial-gradient(circle, #0b0f0c 40%, #7ee35b 100%)" }}
      />
      <div className="cartel relative max-w-2xl text-center">
        {etiqueta && <p className="font-mono text-sm text-lab-portal">{etiqueta}</p>}
        <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-7xl">{titulo}</h1>
        <p className="mt-5 text-lg text-lab-tenue">{gancho}</p>
        <p className="mt-10 font-mono text-xs text-lab-tenue">scrolleá para abrir el portal ↓</p>
      </div>
    </div>
  );
}
