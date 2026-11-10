"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "./gsap";
import { Portal } from "./Portal";
import { conectarViaje, empezoLaVuelta, esperarLlegada } from "./viajes";

// El viaje por portal entre páginas. Vive en el layout raíz: la capa del
// vacío (el espacio entre dimensiones, con el portal girando) tapa el cambio
// de página mientras la nueva se arma.
//
// Con View Transitions son dos pasos (el CSS está en globals.css, "el viaje
// por portal"):
// 1. Ida: el navegador fotografía la pantalla tal como está y el portal se
//    abre y se la traga girando. Debajo queda el vacío, con el portal real.
// 2. Mientras tanto se cambia de página. Cuando la nueva avisa que está
//    lista, vuelta: el portal escupe la página nueva, que sale girando desde
//    el centro, y se cierra.
// Sin View Transitions, el vacío se enciende y se apaga con un fundido.
export function Viaje() {
  const router = useRouter();
  const capa = useRef<HTMLDivElement>(null);
  const anillo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = document.documentElement;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let viajando = false;

    const mostrarVacio = () => {
      gsap.set(capa.current, { autoAlpha: 1 });
      gsap.set(anillo.current, { autoAlpha: 1, scale: 1, rotation: 0 });
      anillo.current?.classList.add("abierto");
    };
    const ocultarVacio = () => {
      gsap.set([capa.current, anillo.current], { autoAlpha: 0 });
      anillo.current?.classList.remove("abierto");
    };

    const viajar = async (href: string) => {
      const vacio = capa.current;
      const portal = anillo.current;
      if (viajando) return;
      if (reducido || !vacio || !portal) {
        router.push(href);
        return;
      }
      viajando = true;
      const llegada = esperarLlegada();
      try {
        if (typeof document.startViewTransition === "function") {
          // 1. ida: el portal (con nombre propio) aparece en la foto de después
          raiz.classList.add("viaje-ida");
          const ida = document.startViewTransition(() => {
            portal.style.viewTransitionName = "viaje-portal";
            mostrarVacio();
          });
          ida.ready.catch(() => {});
          await ida.updateCallbackDone.catch(() => {});
          router.push(href);
          await Promise.all([ida.finished.catch(() => {}), llegada]);
          raiz.classList.remove("viaje-ida");

          // 2. vuelta: ahora el portal está en la foto de antes y se cierra
          raiz.classList.add("viaje-vuelta");
          const vuelta = document.startViewTransition(() => {
            portal.style.viewTransitionName = "";
            ocultarVacio();
          });
          vuelta.ready.then(empezoLaVuelta, empezoLaVuelta);
          await vuelta.finished.catch(() => {});
        } else {
          mostrarVacio();
          await gsap
            .timeline()
            .fromTo(vacio, { opacity: 0 }, { opacity: 1, duration: 0.35 })
            .fromTo(portal, { scale: 0, rotation: -160 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(1.4)" }, 0);
          router.push(href);
          await llegada;
          empezoLaVuelta();
          await gsap
            .timeline()
            .to(portal, { scale: 0, rotation: 200, duration: 0.45, ease: "back.in(1.4)" })
            .to(vacio, { opacity: 0, duration: 0.4 }, 0.1);
          ocultarVacio();
        }
      } finally {
        raiz.classList.remove("viaje-ida", "viaje-vuelta");
        portal.style.viewTransitionName = "";
        empezoLaVuelta();
        viajando = false;
      }
    };

    conectarViaje((href) => void viajar(href));
    return () => conectarViaje(null);
  }, [router]);

  return (
    // por encima de todo, también del menú y del científico
    <div ref={capa} aria-hidden className="viaje-vacio pointer-events-none invisible fixed inset-0 z-[60]">
      <Portal ref={anillo} />
    </div>
  );
}
