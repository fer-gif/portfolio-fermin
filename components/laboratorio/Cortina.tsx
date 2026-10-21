"use client";

import { useRef, useState } from "react";
import { gsap, useDirector, useGSAP } from "@/components/recorrido";
import { PersonajeEmpujando } from "@/components/personaje/PersonajeEmpujando";

// La intro: la puerta del laboratorio tapa todo y el científico entra y la
// empuja hasta sacarla de la pantalla. Se ve en cada carga; si el visitante
// llega con un #ancla o pide reducir movimiento, se saltea.
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
      };

      const saltar =
        window.location.hash !== "" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
        // arranca costando y después se va de una: esfuerzo
        .to(".intro-puerta", { xPercent: 100, duration: 2.8, ease: "power3.inOut" })
        // el contenedor es el scope: hay que apuntarlo directo, no por selector
        .to(ref.current, { opacity: 0, duration: 0.25 }, "-=0.1");
    },
    { scope: ref },
  );

  if (!visible) return null;

  return (
    <div ref={ref} className="intro-capa fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {/* la puerta: clara y limpia, el inverso del fondo oscuro que revela */}
      <div className="intro-puerta absolute inset-0 bg-lab-texto">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-lab-fondo/15" />
        {/* el científico viaja con la puerta, con las manos apoyadas en su borde */}
        <div className="absolute bottom-[8vh] left-0 -translate-x-[93%] sm:bottom-[10vh]">
          <PersonajeEmpujando className="h-[40vh] w-auto sm:h-[52vh]" />
        </div>
      </div>
    </div>
  );
}
