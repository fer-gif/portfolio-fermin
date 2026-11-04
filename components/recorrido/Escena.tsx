"use client";

import { useContext, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import { useDirector } from "./director";
import { EscenaContext } from "./contexto";
import { Portal } from "./Portal";

// Una Escena es una pantalla que se queda clavada mientras el visitante
// scrollea. El scroll no mueve la página: avanza la línea de tiempo de la
// escena. Lo que hay adentro agrega sus animaciones a esa línea con useEscena().
//
// Las escenas son transparentes: el laboratorio vive fijo detrás de todas
// (FondoLaboratorio) y nunca se mueve. Lo único que entra y sale es el
// contenido. Hay dos formas de pasar de una escena a la otra:
// - entre escenas de un mismo proyecto, el contenido sube y se apaga y el de
//   la siguiente sube y se enciende (un relevo corto, sin pantalla vacía);
// - entre proyectos (escena con entrada="portal"), se abre un portal en el
//   medio: lo que había se lo traga y lo nuevo sale de ahí.

/** Pantallas de scroll que dura la salida de una escena. */
export const SALIDA = 0.5;
/** Pantallas de la escena nueva durante las que el portal se cierra. */
const CIERRE_PORTAL = 0.6;

export function useEscena() {
  const ctx = useContext(EscenaContext);
  if (!ctx) throw new Error("useEscena tiene que usarse dentro de <Escena>");
  return ctx;
}

export function Escena({
  id,
  duracion = 1,
  solapar = true,
  cubierta = true,
  entrada = "relevo",
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
   * Después de la animación hay un tramo extra de scroll en el que la escena
   * se va. La última del recorrido va en false.
   */
  cubierta?: boolean;
  /** Cómo llega: relevo (sube y se enciende) o por un portal (cambio de proyecto). */
  entrada?: "relevo" | "portal";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const contenido = useRef<HTMLDivElement>(null);
  const portal = useRef<HTMLDivElement>(null);
  const director = useDirector();
  // La línea de tiempo existe desde el primer render para que los hijos
  // (cuyos efectos corren antes que el de este componente) puedan sumarle tweens.
  const [linea] = useState(() => gsap.timeline({ paused: true }));
  const conPortal = entrada === "portal" && solapar;

  useGSAP(
    () => {
      const seccion = ref.current;
      const caja = contenido.current;
      if (!seccion || !caja) return;

      // El solapamiento se aplica recién acá, con el motor andando: si viviera
      // en el CSS, antes de que cargue el JS las escenas se apilarían todas en
      // una sola pantalla. ScrollTrigger copia este margen al pin-spacer.
      if (solapar) seccion.style.marginTop = "-100svh";

      // Si la escena que sigue entra por un portal, esta se va por él.
      const secciones = Array.from(document.querySelectorAll<HTMLElement>("section[data-escena]"));
      const siguiente = secciones[secciones.indexOf(seccion) + 1];
      const salePorPortal = cubierta && siguiente?.dataset.entrada === "portal";

      // Los hijos ya sumaron sus tweens (sus efectos corren antes). La
      // visibilidad del contenido va en la misma línea de tiempo, así siempre
      // es coherente con el scroll, también a los saltos (menú, scroll rápido).
      // autoAlpha (y no opacity) para que lo apagado no se pinte ni reciba clics.
      const total = linea.duration();
      const pantalla = total > 0 ? total / duracion : 1; // unidades de la línea por pantalla de scroll
      if (solapar && total > 0) {
        if (conPortal) {
          // Lo que sale del portal lo anima cada escena (la mesa, su ficha);
          // acá solo se enciende el resto.
          linea.fromTo(caja, { autoAlpha: 0 }, { autoAlpha: 1, duration: pantalla * 0.12, ease: "none", immediateRender: true }, 0);
        } else {
          linea.fromTo(
            caja,
            { autoAlpha: 0, y: 48 },
            { autoAlpha: 1, y: 0, duration: pantalla * 0.2, ease: "power2.out", immediateRender: true },
            0,
          );
        }
      }
      if (cubierta && total > 0) {
        const salida = pantalla * SALIDA;
        if (salePorPortal) {
          // el portal se abre en el medio y se lo traga todo, girando
          linea.to(caja, { scale: 0.08, rotation: -24, autoAlpha: 0, duration: salida * 0.9, ease: "power2.in" }, `+=${salida * 0.1}`);
        } else {
          linea.to(caja, { autoAlpha: 0, y: -56, duration: salida * 0.85, ease: "power1.in" }, `+=${salida * 0.15}`);
        }
      }

      // Mientras no esté en pantalla, el navegador no la dibuja (ver onToggle).
      caja.style.contentVisibility = "hidden";

      // Progreso de la parte animada sola (la salida queda en 1).
      const animado = (p: number) => (cubierta ? Math.min(1, (p * (duracion + SALIDA)) / duracion) : p);
      ScrollTrigger.create({
        trigger: seccion,
        start: "top top",
        end: () => `+=${(duracion + (cubierta ? SALIDA : 0)) * 100}%`,
        pin: true,
        pinSpacing: true,
        // Lenis ya suaviza el scroll: un segundo suavizado acá hacía que las
        // animaciones quedaran arrastrando detrás de la rueda.
        scrub: true,
        animation: linea,
        onToggle: (st) => {
          // Lo que solo tiene sentido animar mientras se ve (burbujas, pantallas)
          // se pausa por CSS cuando la escena no está activa.
          seccion.classList.toggle("escena-activa", st.isActive);
          // Y el navegador se saltea por completo el contenido de las escenas
          // que no están en pantalla (son treinta y pico): no las recorre en
          // cada cuadro aunque estén apagadas.
          caja.style.contentVisibility = st.isActive ? "" : "hidden";
          if (st.isActive) director.fijar({ escena: id, progreso: st.progress, progresoAnimacion: animado(st.progress) });
        },
        onUpdate: (st) => {
          if (st.isActive) director.fijar({ progreso: st.progress, progresoAnimacion: animado(st.progress) });
        },
      });

      // El portal: se abre mientras se va la escena anterior y se cierra en
      // los primeros pasos de esta. Arranca cuando el borde de arriba de esta
      // escena (que viaja invisible) está a SALIDA pantallas del techo, que es
      // justo cuando la anterior empieza a irse.
      const anillo = portal.current;
      if (conPortal && anillo) {
        const giro = anillo.querySelector(".portal-giro");
        const vida = gsap.timeline({ paused: true });
        vida
          .fromTo(
            anillo,
            { scale: 0.05, rotation: -140, autoAlpha: 0 },
            { scale: 1, rotation: 0, autoAlpha: 1, duration: SALIDA * 0.85, ease: "back.out(1.3)", immediateRender: true },
            SALIDA * 0.1,
          )
          .to(giro, { rotation: -420, duration: SALIDA + CIERRE_PORTAL, ease: "none" }, 0)
          .to(anillo, { scale: 0, rotation: 160, autoAlpha: 0, duration: CIERRE_PORTAL * 0.55, ease: "back.in(1.5)" }, SALIDA + CIERRE_PORTAL * 0.45);
        ScrollTrigger.create({
          trigger: seccion,
          start: `top ${SALIDA * 100}%`,
          end: `+=${(SALIDA + CIERRE_PORTAL) * 100}%`,
          scrub: true,
          animation: vida,
          // el remolino gira solo únicamente mientras el portal está abierto
          onToggle: (st) => anillo.classList.toggle("abierto", st.isActive),
        });
      }

      return () => {
        seccion.style.marginTop = "";
        seccion.classList.remove("escena-activa");
        caja.style.contentVisibility = "";
      };
    },
    { scope: ref, dependencies: [id, duracion, cubierta, solapar, conPortal] },
  );

  return (
    <EscenaContext value={{ id, linea }}>
      <section
        ref={ref}
        id={id}
        data-escena={id}
        data-entrada={conPortal ? "portal" : undefined}
        // Dónde aterriza un salto del menú (en pantallas desde el comienzo):
        // con el portal ya cerrado y lo que sale de él apoyado, o con el
        // relevo terminado. Aterrizar en el borde mostraría la escena vacía.
        data-llegada={conPortal ? Math.min(duracion, 1) : solapar ? 0.25 : 0}
        // Transparente: el laboratorio está fijo detrás. En celular reserva
        // lugar arriba (botones fijos) y abajo (personaje). La sección no
        // recibe el mouse: mientras viaja invisible no tapa a la anterior.
        className={["pointer-events-none relative h-svh w-full overflow-hidden pt-14 pb-44 sm:pt-0 sm:pb-0", className].join(" ")}
      >
        {conPortal && <Portal ref={portal} />}
        <div ref={contenido} className={`pointer-events-auto h-full ${conPortal ? "relative z-10" : ""}`}>
          {children}
        </div>
      </section>
    </EscenaContext>
  );
}
