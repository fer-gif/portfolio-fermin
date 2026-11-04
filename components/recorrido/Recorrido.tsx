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
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      // Un panel con `data-desborda` se queda con la rueda solo si tiene más
      // contenido del que entra; si no, la página sigue bajando normalmente.
      prevent: (nodo) => nodo.hasAttribute("data-desborda") && nodo.scrollHeight > nodo.clientHeight + 1,
    });
    lenis.on("scroll", ScrollTrigger.update);

    // Ir a una escena: al punto donde ya se ve (data-llegada, en pantallas),
    // no a su borde. Se mide desde el pin-spacer: la sección clavada está
    // fija arriba y su propia posición no dice dónde empieza.
    const ir = (escena: string, inmediato = false) => {
      const seccion = document.getElementById(escena);
      if (!seccion) return;
      const ancla = seccion.parentElement?.classList.contains("pin-spacer") ? seccion.parentElement : seccion;
      const llegada = Number(seccion.dataset.llegada ?? 0) * window.innerHeight;
      // Lenis guarda el alto de la página y lo actualiza con retraso: recién
      // armadas las escenas clavadas, todavía cree que mide una pantalla y
      // recortaría el salto a 0.
      lenis.resize();
      lenis.scrollTo(ancla, { offset: llegada, duration: 1.4, immediate: inmediato, force: true });
    };
    director.conectarNavegacion(
      (escena) => ir(escena),
      (pausado) => (pausado ? lenis.stop() : lenis.start()),
    );

    // Si se llega con un #escena (o desde /proyectos/:slug), el navegador
    // saltó antes de que existieran las escenas clavadas: con todo medido, se
    // va ahí de una.
    const destino = decodeURIComponent(window.location.hash.slice(1));
    let cuadroAncla = 0;
    if (destino && destino !== "entrada" && document.getElementById(destino)) {
      cuadroAncla = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        ir(destino, true);
      });
    }

    // Un solo reloj: GSAP mueve a Lenis, y Lenis avisa a ScrollTrigger.
    const tick = (tiempo: number) => lenis.raf(tiempo * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      cancelAnimationFrame(cuadroAncla);
      director.conectarNavegacion(() => {}, () => {});
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [director]);

  // El body es flex: ScrollTrigger no reserva espacio de scroll al clavar una
  // escena cuyo padre es flex, así que las escenas viven en un bloque normal.
  return (
    <DirectorContext value={director}>
      <div className="relative block w-full">{children}</div>
    </DirectorContext>
  );
}
