"use client";

import { useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "./gsap";
import { crearDirector, DirectorContext } from "./director";

// Contenedor de un recorrido: suaviza el scroll (Lenis), lo sincroniza con
// ScrollTrigger y pone a disposición el Director para todo lo que hay adentro.
export function Recorrido({ children }: { children: ReactNode }) {
  const [director] = useState(crearDirector);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);

    // Un solo reloj: GSAP mueve a Lenis, y Lenis avisa a ScrollTrigger.
    const tick = (tiempo: number) => lenis.raf(tiempo * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // El body es flex: ScrollTrigger no reserva espacio de scroll al clavar una
  // escena cuyo padre es flex, así que las escenas viven en un bloque normal.
  return (
    <DirectorContext value={director}>
      <div className="relative block w-full">{children}</div>
    </DirectorContext>
  );
}
