"use client";

import { useRef } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";
import { ETIQUETA_CATEGORIA, type Proyecto } from "@/proyectos";
import { Banco } from "./Banco";

// Colores de las etiquetas de los frascos, en ronda.
const COLORES = ["bg-lab-portal", "bg-lab-celeste", "bg-lab-amarillo", "bg-lab-rosa"];

// Una mesa del laboratorio: el experimento entra deslizándose y es el portal
// a sus escenas, que vienen justo después en el mismo recorrido. Las
// tecnologías del proyecto caen sobre la mesada como frascos etiquetados.
export function Mesa({ proyecto, numero, tieneEscenas }: { proyecto: Proyecto; numero: number; tieneEscenas: boolean }) {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const enProceso = proyecto.estado === "en-proceso";
  // "Laravel 12 · PHP 8.3" son dos frascos, no uno.
  const frascos = proyecto.stack.flatMap((s) => s.split(" · ")).slice(0, 9);

  useGSAP(
    () => {
      gsap.set(".ficha", { x: "60vw", opacity: 0, rotate: 3 });
      gsap.set(".detalle", { opacity: 0, y: 14 });
      gsap.set(".frasco", { y: "-70vh", opacity: 0, rotation: (i: number) => (i % 2 ? 16 : -16) });
      linea
        .to(".ficha", { x: 0, opacity: 1, rotate: 0, duration: 1.4, ease: "power3.out" })
        .to(".detalle", { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }, "-=0.6")
        // los frascos caen y rebotan sobre la mesada, uno atrás del otro
        .to(".frasco", { y: 0, opacity: 1, rotation: (i: number) => ((i % 3) - 1) * 2, duration: 0.8, ease: "bounce.out", stagger: 0.15 }, 0.5)
        .to({}, { duration: 1.5 }); // tiempo para leer antes de que se vaya
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative flex h-full items-end justify-center px-4 pb-[11svh] sm:justify-end sm:pr-[8vw] sm:pb-[19svh]">
      {/* el banco sobre el que se apoya la ficha */}
      <Banco className="absolute inset-x-0 bottom-[2svh] mx-auto h-[26svh] w-full max-w-5xl sm:bottom-[4svh]" />

      {/* los frascos con las tecnologías, apilados sobre la mesada (a la
          izquierda de la ficha; en celular van en una línea dentro de la ficha).
          El banco mide 26svh de alto y 800/240 de eso de ancho; su mesada
          queda a 130/240 de arriba. */}
      {frascos.length > 0 && (
        <div aria-hidden className="pointer-events-none absolute bottom-[16.2svh] left-1/2 hidden w-[86.67svh] -translate-x-1/2 sm:block">
          <ul className="absolute bottom-0 left-[5%] flex w-[46%] flex-wrap-reverse items-end gap-x-1.5 gap-y-1">
            {frascos.map((t, i) => (
              <li
                key={t}
                className="frasco flex items-center gap-1.5 rounded-lg border border-lab-borde bg-lab-panel px-2.5 py-1 font-mano text-base leading-none whitespace-nowrap text-lab-texto shadow-[0_8px_14px_-6px_rgba(0,0,0,0.9)]"
              >
                <span className={`size-2 shrink-0 rounded-full ${COLORES[i % COLORES.length]}`} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
      <article className="ficha relative w-full max-w-xl rounded-2xl border border-lab-borde bg-lab-panel/95 p-6 shadow-[0_24px_40px_-20px_rgba(0,0,0,0.8),0_0_60px_-20px_rgba(151,206,76,0.45)] backdrop-blur sm:p-8">
        {/* la etiqueta del frasco: número a mano */}
        <header className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-lab-tenue">
          <span className="rounded-full border border-lab-portal bg-lab-fondo px-3 py-0.5 font-mano text-lg normal-case tracking-normal text-lab-portal sm:absolute sm:-top-4 sm:left-6">
            experimento {String(numero).padStart(2, "0")}
          </span>
          <span>{ETIQUETA_CATEGORIA[proyecto.categoria]}</span>
        </header>

        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{proyecto.titulo}</h2>

        <p className="detalle mt-3 text-sm text-lab-tenue sm:text-base">{proyecto.resumen}</p>

        <p className="detalle mt-4 border-l-2 border-lab-portal pl-3 text-xs sm:text-sm">
          <span className="font-mano text-lg text-lab-portal">podés </span>
          {proyecto.artefacto}
        </p>

        {frascos.length > 0 && (
          <p className="detalle mt-3 truncate font-mono text-[10px] text-lab-tenue sm:hidden">
            <span className="text-lab-portal">con</span> {frascos.join(" · ")}
          </p>
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
