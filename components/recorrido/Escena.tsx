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
  solapar = true,
  cubierta = true,
  className = "",
  children,
}: {
  id: string;
  /** Cuánto scroll dura la animación de la escena, en alturas de pantalla. */
  duracion?: number;
  /**
   * La escena sube y cubre a la anterior en vez de esperar a que se vaya:
   * sin huecos de scroll común entre escenas. La primera del recorrido va en false.
   */
  solapar?: boolean;
  /**
   * La escena siguiente la va a cubrir: se agrega una pantalla de espera al
   * final, con la animación ya terminada, para que la tapen quieta y no a medias.
   * La última del recorrido va en false.
   */
  cubierta?: boolean;
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
      // Los hijos ya sumaron sus tweens (sus efectos corren antes). La espera
      // final ocupa exactamente la pantalla extra que dura la cobertura.
      if (cubierta && linea.duration() > 0) {
        linea.to({}, { duration: linea.duration() / duracion });
      }
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: () => `+=${(duracion + (cubierta ? 1 : 0)) * 100}%`,
        pin: true,
        pinSpacing: true,
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
    { scope: ref, dependencies: [id, duracion, cubierta] },
  );

  return (
    <EscenaContext value={{ id, linea }}>
      <section
        ref={ref}
        id={id}
        data-escena={id}
        className={[
          // Fondo opaco para poder cubrir a la escena anterior.
          // En celular reserva lugar arriba (botones fijos) y abajo (personaje).
          "relative h-svh w-full overflow-hidden bg-lab-fondo pt-14 pb-36 sm:pt-0 sm:pb-0",
          // Sombra en el borde superior: se lee como un panel que sube, no como un corte.
          solapar ? "-mt-[100svh] shadow-[0_-24px_48px_rgba(0,0,0,0.55)]" : "",
          className,
        ].join(" ")}
      >
        {children}
      </section>
    </EscenaContext>
  );
}
