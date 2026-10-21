"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import { useDirector } from "./director";

// Una Escena es una pantalla que se queda clavada mientras el visitante
// scrollea. El scroll no mueve la página: avanza la línea de tiempo de la
// escena. Lo que hay adentro agrega sus animaciones a esa línea con useEscena().

interface ContextoEscena {
  id: string;
  linea: gsap.core.Timeline;
}

const EscenaContext = createContext<ContextoEscena | null>(null);

export function useEscena(): ContextoEscena {
  const ctx = useContext(EscenaContext);
  if (!ctx) throw new Error("useEscena tiene que usarse dentro de <Escena>");
  return ctx;
}

export function Escena({
  id,
  duracion = 1,
  className = "",
  children,
}: {
  id: string;
  /** Cuánto scroll dura la escena, en alturas de pantalla. */
  duracion?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const director = useDirector();
  // La línea de tiempo existe desde el primer render para que los hijos
  // (cuyos efectos corren antes que el de este componente) puedan sumarle tweens.
  const [linea] = useState(() => gsap.timeline({ paused: true }));

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: () => `+=${duracion * 100}%`,
        pin: true,
        scrub: 0.6,
        animation: linea,
        onToggle: (st) => {
          if (st.isActive) director.fijar({ escena: id, progreso: st.progress });
        },
        onUpdate: (st) => {
          if (st.isActive) director.fijar({ progreso: st.progress });
        },
      });
    },
    { scope: ref, dependencies: [id, duracion] },
  );

  return (
    <EscenaContext value={{ id, linea }}>
      <section
        ref={ref}
        data-escena={id}
        className={`relative h-svh w-full overflow-hidden ${className}`}
      >
        {children}
      </section>
    </EscenaContext>
  );
}
