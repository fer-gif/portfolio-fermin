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

      // El científico vive adentro de la puerta, pegado a su borde izquierdo:
      // al correr la puerta, él entra desde la izquierda empujándola.
      gsap
        .timeline({ onComplete: terminar, delay: 0.4 })
        .to(".intro-puerta", { xPercent: 100, duration: 2.8, ease: "power2.inOut" })
        // el contenedor es el scope: hay que apuntarlo directo, no por selector
        .to(ref.current, { opacity: 0, duration: 0.25 }, "-=0.1");
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
        <p className="absolute inset-x-0 top-[18vh] text-center font-mono text-[7vw] font-bold uppercase tracking-[0.1em] text-lab-fondo/80 sm:text-[5vw]">
          Laboratorio
        </p>
        <p className="absolute inset-x-0 top-[18vh] mt-[9vw] text-center font-mono text-[10px] uppercase tracking-[0.3em] text-lab-fondo/60 sm:mt-[6.5vw] sm:text-sm">
          puerta cerrada · empujar
        </p>
        <div className="absolute inset-y-0 left-0 w-2 bg-lab-fondo/70" />
        {/* las manos quedan sobre el borde de la puerta */}
        <div className="absolute bottom-[10vh] left-0 -translate-x-[88%]">
          <PersonajeSVG pose="empujando" className="h-[44vh] w-auto sm:h-[52vh]" />
        </div>
      </div>
    </div>
  );
}
