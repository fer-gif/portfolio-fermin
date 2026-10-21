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
      {/* la puerta del laboratorio: verde portal, bien distinta del fondo oscuro que revela */}
      <div className="intro-puerta absolute inset-0 bg-lab-portal">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(#0b0f0c 1px, transparent 1px), linear-gradient(90deg, #0b0f0c 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <p className="absolute inset-x-0 top-[18vh] text-center font-mono text-[9vw] font-bold uppercase tracking-[0.2em] text-lab-fondo/80 sm:text-[6vw]">
          Laboratorio
        </p>
        <p className="absolute inset-x-0 top-[18vh] mt-[11vw] text-center font-mono text-xs uppercase tracking-[0.3em] text-lab-fondo/60 sm:mt-[7.5vw] sm:text-sm">
          puerta cerrada · empujar
        </p>
        <div className="absolute inset-y-0 left-0 w-2 bg-lab-fondo/70" />
      </div>
      <PersonajeSVG
        pose="empujando"
        className="intro-personaje absolute bottom-[10vh] left-0 h-[44vh] w-auto sm:h-[52vh]"
      />
    </div>
  );
}
