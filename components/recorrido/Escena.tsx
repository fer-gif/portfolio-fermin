"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import { useDirector } from "./director";

// Una Escena es una pantalla que se queda clavada mientras el visitante
// scrollea. El scroll no mueve la página: avanza la línea de tiempo de la
// escena. Lo que hay adentro agrega sus animaciones a esa línea con useEscena().
//
// Las escenas son transparentes: el laboratorio vive fijo detrás de todas
// (FondoLaboratorio) y nunca se mueve. Lo único que entra y sale es el
// contenido: cada escena se apaga al final de su tramo y la siguiente aparece
// recién cuando se clava.

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
   * La escena arranca donde termina la anterior, sin huecos de scroll común
   * entre escenas. La primera del recorrido va en false.
   */
  solapar?: boolean;
  /**
   * Después de la animación hay una pantalla extra de scroll: la escena se
   * queda quieta un momento y después se apaga, mientras la siguiente llega.
   * La última del recorrido va en false.
   */
  cubierta?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const contenido = useRef<HTMLDivElement>(null);
  const director = useDirector();
  // La línea de tiempo existe desde el primer render para que los hijos
  // (cuyos efectos corren antes que el de este componente) puedan sumarle tweens.
  const [linea] = useState(() => gsap.timeline({ paused: true }));

  useGSAP(
    () => {
      const seccion = ref.current;
      const caja = contenido.current;
      if (!seccion || !caja) return;

      // El solapamiento se aplica recién acá, con el motor andando: si viviera
      // en el CSS, antes de que cargue el JS las escenas se apilarían todas en
      // una sola pantalla. ScrollTrigger copia este margen al pin-spacer.
      if (solapar) seccion.style.marginTop = "-100svh";

      // Los hijos ya sumaron sus tweens (sus efectos corren antes). La
      // visibilidad del contenido va en la misma línea de tiempo, así siempre
      // es coherente con el scroll, también a los saltos (menú, scroll rápido):
      // - antes de clavarse, la escena viaja invisible por encima de la anterior;
      // - al clavarse, el contenido se materializa en los primeros 10 vh;
      // - en la pantalla extra del final se queda quieta un rato y se apaga.
      const total = linea.duration();
      if (solapar && total > 0) {
        linea.fromTo(caja, { opacity: 0 }, { opacity: 1, duration: (total * 0.1) / duracion, ease: "none", immediateRender: true }, 0);
      }
      if (cubierta && total > 0) {
        const espera = total / duracion;
        linea
          .to({}, { duration: espera * 0.4 })
          .fromTo(caja, { opacity: 1 }, { opacity: 0, duration: espera * 0.6, ease: "none", immediateRender: false });
      }
      // Progreso de la parte animada sola (la espera queda en 1).
      const animado = (p: number) => (cubierta ? Math.min(1, (p * (duracion + 1)) / duracion) : p);
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: () => `+=${(duracion + (cubierta ? 1 : 0)) * 100}%`,
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        animation: linea,
        onToggle: (st) => {
          if (st.isActive) director.fijar({ escena: id, progreso: st.progress, progresoAnimacion: animado(st.progress) });
        },
        onUpdate: (st) => {
          if (st.isActive) director.fijar({ progreso: st.progress, progresoAnimacion: animado(st.progress) });
        },
      });

      return () => {
        seccion.style.marginTop = "";
        caja.style.opacity = "";
      };
    },
    { scope: ref, dependencies: [id, duracion, cubierta, solapar] },
  );

  return (
    <EscenaContext value={{ id, linea }}>
      <section
        ref={ref}
        id={id}
        data-escena={id}
        // Transparente: el laboratorio está fijo detrás. En celular reserva
        // lugar arriba (botones fijos) y abajo (personaje).
        className={["relative h-svh w-full overflow-hidden pt-14 pb-44 sm:pt-0 sm:pb-0", className].join(" ")}
      >
        <div ref={contenido} className="h-full">
          {children}
        </div>
      </section>
    </EscenaContext>
  );
}
