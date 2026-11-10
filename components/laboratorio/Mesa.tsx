"use client";

import { useRef } from "react";
import { cuandoSeVea, gsap, ScrollTrigger, useDirector, useEscena, useGSAP } from "@/components/recorrido";
import { ETIQUETA_CATEGORIA, type Proyecto } from "@/proyectos";
import { frascosDelStack } from "@/lib/tecnologias";
import { Banco } from "./Banco";
import { EtiquetaLogo } from "./LogoStack";
import { tocarObjeto } from "./objetos";

// La mesa del proyecto, la primera pantalla de su página: el experimento sale
// girando del portal (por el que se llegó) y aterriza sobre el banco. Las
// tecnologías caen sobre la mesada como frascos con su logo. Como es lo
// primero que se ve, la llegada no espera al scroll: arranca sola cuando la
// página sale del portal; el scroll solo la hace irse.
export function Mesa({ proyecto, numero, tieneEscenas }: { proyecto: Proyecto; numero: number; tieneEscenas: boolean }) {
  const { linea } = useEscena();
  const director = useDirector();
  const ref = useRef<HTMLDivElement>(null);
  const enProceso = proyecto.estado === "en-proceso";
  const frascos = frascosDelStack(proyecto.stack).slice(0, 9);

  useGSAP(
    () => {
      const raiz = ref.current;
      const ficha = raiz?.querySelector<HTMLElement>(".ficha");
      const seccion = raiz?.closest("section");
      if (!raiz || !ficha || !seccion) return;

      // Cuánto hay que mover la ficha para que su centro caiga en el del
      // portal. Se mide sobre el layout (offset*, sin transformaciones), en
      // coordenadas de la sección, que clavada ocupa la pantalla entera.
      const desdeElPortal = () => {
        let x = ficha.offsetWidth / 2;
        let y = ficha.offsetHeight / 2;
        for (let el: HTMLElement | null = ficha; el && el !== seccion; el = el.offsetParent as HTMLElement | null) {
          x += el.offsetLeft;
          y += el.offsetTop;
        }
        const portal = seccion.querySelector<HTMLElement>(".portal");
        const px = portal ? portal.offsetLeft + portal.offsetWidth / 2 : seccion.clientWidth / 2;
        const py = portal ? portal.offsetTop + portal.offsetHeight / 2 : seccion.clientHeight / 2;
        return { x: px - x, y: py - y };
      };

      gsap.set(".detalle", { opacity: 0, y: 14 });
      gsap.set(".frasco", { y: "-70vh", opacity: 0, rotation: (i: number) => (i % 2 ? 16 : -16) });
      const salida = gsap.fromTo(
        ficha,
        {
          x: () => desdeElPortal().x,
          y: () => desdeElPortal().y,
          scale: 0.12,
          rotation: -32,
          opacity: 0,
        },
        { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, duration: 1.1, ease: "power3.out", immediateRender: true },
      );
      const llegada = gsap
        .timeline({ paused: true })
        .add(salida, 0)
        .to(".detalle", { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 }, "-=0.45")
        // los frascos caen y rebotan sobre la mesada, uno atrás del otro
        .to(".frasco", { y: 0, opacity: 1, rotation: (i: number) => ((i % 3) - 1) * 2, duration: 0.8, ease: "bounce.out", stagger: 0.12 }, 0.75);
      const cancelar = cuandoSeVea(() => llegada.play());
      // el scroll de la mesa: un rato para leer antes de que se vaya
      linea.to({}, { duration: 1 });

      // Si cambia el tamaño de la pantalla, la ficha queda en otro lugar: el
      // punto de partida se vuelve a medir.
      const remedir = () => salida.invalidate();
      ScrollTrigger.addEventListener("refreshInit", remedir);
      return () => {
        cancelar();
        ScrollTrigger.removeEventListener("refreshInit", remedir);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative flex h-full items-end justify-center px-4 pb-[11svh] sm:justify-end sm:pr-[8vw] sm:pb-[19svh]">
      {/* el banco sobre el que se apoya la ficha */}
      <Banco
        className="absolute inset-x-0 bottom-[2svh] mx-auto h-[26svh] w-full max-w-5xl sm:bottom-[4svh]"
        onPan={() => tocarObjeto("pan", director)}
      />

      {/* los frascos con las tecnologías, apilados sobre la mesada (a la
          izquierda de la ficha; en celular van en una línea dentro de la ficha).
          El banco mide 26svh de alto y 800/240 de eso de ancho; su mesada
          queda a 130/240 de arriba. */}
      {frascos.length > 0 && (
        <div aria-hidden className="pointer-events-none absolute bottom-[16.2svh] left-1/2 hidden w-[86.67svh] -translate-x-1/2 sm:block">
          <ul className="absolute bottom-0 left-[5%] flex w-[46%] flex-wrap-reverse items-end gap-x-1.5 gap-y-1">
            {frascos.map((tec) => (
              <li
                key={tec.etiqueta}
                className={`frasco flex items-center gap-1.5 rounded-lg border bg-lab-panel py-1 pr-2.5 pl-1 font-mono text-[11px] leading-none whitespace-nowrap text-lab-texto shadow-[0_8px_14px_-6px_rgba(0,0,0,0.9)] ${
                  tec.tipo === "datos" ? "border-dashed border-lab-borde text-lab-tenue" : "border-lab-borde"
                }`}
              >
                <EtiquetaLogo tec={tec} />
                {tec.etiqueta}
              </li>
            ))}
          </ul>
        </div>
      )}
      <article className="ficha relative w-full max-w-xl rounded-2xl border border-lab-borde bg-lab-panel p-6 shadow-[0_24px_40px_-20px_rgba(0,0,0,0.8),0_0_60px_-20px_rgba(151,206,76,0.45)] sm:p-8">
        {/* la etiqueta del frasco: número a mano */}
        <header className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-lab-tenue">
          <span className="rounded-full border border-lab-portal bg-lab-fondo px-3 py-0.5 font-mano text-lg normal-case tracking-normal text-lab-portal sm:absolute sm:-top-4 sm:left-6">
            experimento {String(numero).padStart(2, "0")}
          </span>
          <span>{ETIQUETA_CATEGORIA[proyecto.categoria]}</span>
        </header>

        <h2 className="font-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{proyecto.titulo}</h2>

        <p className="detalle mt-3 text-sm text-lab-tenue sm:text-base">{proyecto.resumen}</p>

        <p className="detalle mt-4 border-l-2 border-lab-portal pl-3 text-xs sm:text-sm">
          <span className="font-mano text-lg text-lab-portal">podés </span>
          {proyecto.artefacto}
        </p>

        {/* en celular no hay lugar para los frascos: los logos van en fila */}
        {frascos.length > 0 && (
          <ul aria-label="Tecnologías" className="detalle mt-3 flex flex-wrap items-center gap-1 sm:hidden">
            {frascos.map((tec) => (
              <li key={tec.etiqueta} title={tec.etiqueta}>
                <EtiquetaLogo tec={tec} className="size-6" />
                <span className="sr-only">{tec.etiqueta}</span>
              </li>
            ))}
          </ul>
        )}

        <footer className="detalle mt-6 flex items-center justify-between gap-3 font-mono text-xs">
          <span className="text-lab-tenue">
            {proyecto.autoria === "equipo" ? "en equipo" : "individual"}
            {enProceso && " · en proceso"}
          </span>
          <span className="font-mano text-lg leading-tight text-lab-portal">
            {tieneEscenas ? "seguí bajando para entrar ↓" : "experimento en construcción"}
          </span>
        </footer>
      </article>
    </div>
  );
}
