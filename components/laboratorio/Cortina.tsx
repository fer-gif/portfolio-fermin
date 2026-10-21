"use client";

import { useRef, useState } from "react";
import { gsap, useDirector, useGSAP } from "@/components/recorrido";
import { PersonajeSVG } from "@/components/personaje/PersonajeSVG";

const CLAVE_SESION = "intro-vista";

// La intro: la puerta del laboratorio tapa todo y el científico entra y la
// empuja hasta sacarla de la pantalla. Se ve una vez por sesión; si el
// visitante llega con un #ancla o pide reducir movimiento, se saltea.
export function Cortina() {
  const ref = useRef<HTMLDivElement>(null);
  const director = useDirector();
  const [visible, setVisible] = useState(true);

  useGSAP(
    () => {
      const terminar = () => {
        document.documentElement.classList.add("intro-lista");
        director.pausarScroll(false);
        setVisible(false);
        try {
          sessionStorage.setItem(CLAVE_SESION, "1");
        } catch {}
      };

      let yaVista = false;
      try {
        yaVista = sessionStorage.getItem(CLAVE_SESION) === "1";
      } catch {}
      const saltar =
        yaVista || window.location.hash !== "" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (saltar) {
        terminar();
        return;
      }

      director.pausarScroll(true);
      window.scrollTo(0, 0);

      gsap
        .timeline({ onComplete: terminar, delay: 0.3 })
        // entra caminando
        .fromTo(".intro-personaje", { x: "-30vw" }, { x: "12vw", duration: 1.1, ease: "power2.out" })
        // apoya las manos y empuja: la puerta se va con él
        .to(".intro-personaje", { x: "115vw", duration: 2, ease: "power2.inOut" }, "+=0.35")
        .to(".intro-puerta", { xPercent: 100, duration: 2, ease: "power2.inOut" }, "<")
        // el contenedor es el scope: hay que apuntarlo directo, no por selector
        .to(ref.current, { opacity: 0, duration: 0.25 });
    },
    { scope: ref },
  );

  if (!visible) return null;

  return (
    <div ref={ref} className="intro-capa fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {/* la puerta del laboratorio */}
      <div className="intro-puerta absolute inset-0 border-l border-lab-borde bg-lab-panel">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-lab-borde) 1px, transparent 1px), linear-gradient(90deg, var(--color-lab-borde) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-y-0 left-0 w-1 bg-lab-portal/70 shadow-[0_0_24px_4px_rgba(126,227,91,0.35)]" />
      </div>
      <PersonajeSVG
        pose="empujando"
        className="intro-personaje absolute bottom-[14vh] left-0 h-[34vh] w-auto sm:h-[42vh]"
      />
    </div>
  );
}
