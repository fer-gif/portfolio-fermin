"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "./gsap";
import { crearDirector, DirectorContext } from "./director";
import { Portal } from "./Portal";

// Contenedor de un recorrido: suaviza el scroll (Lenis), lo sincroniza con
// ScrollTrigger y pone a disposición el Director para todo lo que hay adentro.
export function Recorrido({ children }: { children: ReactNode }) {
  const [director] = useState(crearDirector);
  const capaSalto = useRef<HTMLDivElement>(null);
  const anilloSalto = useRef<HTMLDivElement>(null);
  const destello = useRef<HTMLDivElement>(null);

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
    const llegar = (escena: string) => {
      const seccion = document.getElementById(escena);
      if (!seccion) return;
      const ancla = seccion.parentElement?.classList.contains("pin-spacer") ? seccion.parentElement : seccion;
      const llegada = Number(seccion.dataset.llegada ?? 0) * window.innerHeight;
      // Lenis guarda el alto de la página y lo actualiza con retraso: recién
      // armadas las escenas clavadas, todavía cree que mide una pantalla y
      // recortaría el salto a 0.
      lenis.resize();
      lenis.scrollTo(ancla, { offset: llegada, immediate: true, force: true });
    };

    // Un salto pedido por el visitante (vidriera, menú, capítulos) pasa por
    // un portal, y se cambia de lugar de una, sin desfilar por todas las
    // escenas del medio.
    let saltando = false;
    let scrollPausado = false;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const raiz = document.documentElement;
    const saltar = (escena: string) => {
      const capa = capaSalto.current;
      const anillo = anilloSalto.current;
      const verde = destello.current;
      if (!document.getElementById(escena) || saltando) return;
      if (reducido || !capa || !anillo || !verde) return llegar(escena);
      saltando = true;

      // Con View Transitions, el navegador saca una foto de la pantalla tal
      // como está (fondo, escena, científico, botones) y otra del portal
      // abierto, aparte. Mientras la página real ya cambió de lugar, el CSS
      // (globals.css, "el salto por portal") abre el portal, le hace tragarse
      // la foto girando y del otro lado hace salir el destino. Son dos fotos
      // que se mueven enteras: no hay que volver a pintar nada en el camino.
      if (typeof document.startViewTransition === "function") {
        gsap.set(capa, { autoAlpha: 1 });
        gsap.set(verde, { opacity: 0 });
        gsap.set(anillo, { autoAlpha: 1, scale: 1, rotation: 0 });
        anillo.style.viewTransitionName = "salto-portal";
        raiz.classList.add("salto-portal");
        lenis.stop();
        const transicion = document.startViewTransition(() => {
          // en la foto de después el portal ya no está: solo queda el de antes
          anillo.style.viewTransitionName = "";
          gsap.set([capa, anillo], { autoAlpha: 0 });
          llegar(escena);
        });
        transicion.ready.catch(() => {});
        transicion.finished.finally(() => {
          raiz.classList.remove("salto-portal");
          if (!scrollPausado) lenis.start();
          saltando = false;
        });
        return;
      }

      // Sin View Transitions: el portal se abre, la pantalla se llena de
      // verde, se cambia de lugar y el portal se cierra sobre el destino.
      anillo.classList.add("abierto");
      gsap
        .timeline({
          onComplete: () => {
            anillo.classList.remove("abierto");
            saltando = false;
          },
        })
        .set(capa, { autoAlpha: 1 })
        .fromTo(anillo, { autoAlpha: 1, scale: 0.05, rotation: -120 }, { scale: 1.8, rotation: 20, duration: 0.55, ease: "power2.in" })
        .fromTo(verde, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power1.in" }, 0.36)
        .add(() => llegar(escena))
        .to(verde, { opacity: 0, duration: 0.4, ease: "power1.out" }, "+=0.12")
        .to(anillo, { scale: 0, rotation: 170, duration: 0.5, ease: "back.in(1.2)" }, "<+=0.05")
        .set(capa, { autoAlpha: 0 });
    };

    director.conectarNavegacion(saltar, (pausado) => {
      scrollPausado = pausado;
      if (pausado) lenis.stop();
      else if (!raiz.classList.contains("salto-portal")) lenis.start();
    });

    // Si se llega con un #escena (o desde /proyectos/:slug), el navegador
    // saltó antes de que existieran las escenas clavadas: con todo medido, se
    // va ahí de una.
    const destino = decodeURIComponent(window.location.hash.slice(1));
    let cuadroAncla = 0;
    if (destino && destino !== "entrada" && document.getElementById(destino)) {
      cuadroAncla = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        llegar(destino);
      });
    }

    // Un solo reloj: GSAP mueve a Lenis, y Lenis avisa a ScrollTrigger.
    const tick = (tiempo: number) => lenis.raf(tiempo * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      cancelAnimationFrame(cuadroAncla);
      raiz.classList.remove("salto-portal");
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
      {/* la capa del salto: por encima de las escenas, debajo del menú y del científico */}
      <div ref={capaSalto} aria-hidden className="pointer-events-none invisible fixed inset-0 z-[45]">
        <div ref={destello} className="salto-destello absolute inset-0 opacity-0" />
        <Portal ref={anilloSalto} />
      </div>
    </DirectorContext>
  );
}
