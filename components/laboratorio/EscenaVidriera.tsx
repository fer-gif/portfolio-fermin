"use client";

import { useRef } from "react";
import { useDirector, useEscena, useGSAP } from "@/components/recorrido";
import type { Proyecto } from "@/proyectos";
import { frascosDelStack } from "@/lib/tecnologias";
import { EtiquetaLogo } from "./LogoStack";

// La tercera pantalla, la vidriera: todos los experimentos apoyados sobre la
// mesada. Tocar uno abre el portal, que se traga la pantalla y lleva directo
// a su mesa; si se baja, el recorrido los muestra de a uno y el portal se
// traga la vidriera.
export function EscenaVidriera({ proyectos }: { proyectos: Proyecto[] }) {
  const { linea } = useEscena();
  const director = useDirector();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Los experimentos se apoyan uno atrás del otro mientras entra la escena
      // (listos antes del punto donde aterriza un salto); al seguir bajando,
      // la vidriera se achica apenas y enseguida se la traga el portal.
      linea
        .fromTo(
          ".tarjeta-vidriera",
          { opacity: 0, y: 26, rotation: -1.5 },
          { opacity: 1, y: 0, rotation: 0, duration: 0.18, stagger: 0.025, ease: "power2.out" },
          0.04,
        )
        .to(".pista", { opacity: 0, duration: 0.25 }, 0.7)
        .to(".cartel", { scale: 0.96, y: -12, duration: 0.3, ease: "power1.in" }, 0.7);
    },
    { scope: ref },
  );

  return (
    // Abajo queda lugar para el científico y su globo.
    <div ref={ref} className="flex h-full flex-col items-center justify-center px-4 sm:px-8 sm:pb-[8svh]">
      <div className="cartel flex w-full max-w-6xl flex-col items-center">
        <header className="text-center">
          <p className="font-mano text-xl text-lab-portal sm:text-2xl">mis proyectos</p>
          <h2 className="font-display text-[11vw] leading-[0.9] font-extrabold uppercase sm:text-[min(6.4vw,11svh)]">
            Elegí un experimento
          </h2>
          <p className="pista mt-2 text-sm text-lab-tenue sm:text-lg">Tocá uno y el portal te lleva directo. O bajá y te los muestro de a uno.</p>
        </header>

        <ul className="mt-4 grid w-full gap-2 sm:mt-[5svh] sm:grid-cols-5 sm:gap-3">
          {proyectos.map((p, i) => {
            const logos = frascosDelStack(p.stack)
              .filter((t) => t.tipo === "logo")
              .slice(0, 4);
            return (
              <li key={p.slug} className="tarjeta-vidriera">
                <button
                  type="button"
                  onClick={() => director.irA(`mesa-${p.slug}`)}
                  aria-label={`Entrar a ${p.titulo}`}
                  className="group flex h-full w-full items-center gap-3 rounded-xl border border-lab-borde bg-lab-panel px-3 py-2.5 text-left shadow-[0_14px_24px_-16px_rgba(0,0,0,0.9)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-lab-portal hover:shadow-[0_18px_30px_-16px_rgba(0,0,0,0.9),0_0_30px_-12px_rgba(151,206,76,0.6)] focus-visible:border-lab-portal focus-visible:outline-none sm:flex-col sm:items-stretch sm:gap-0 sm:rounded-2xl sm:p-4"
                >
                  <span className="shrink-0 font-mano text-base text-lab-portal sm:text-lg">
                    <span className="sm:hidden">{String(i + 1).padStart(2, "0")}</span>
                    <span className="hidden sm:inline">experimento {String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <span className="min-w-0 flex-1 sm:mt-1 sm:flex sm:flex-col">
                    <span className="font-display block text-base leading-tight font-extrabold sm:text-xl">{p.titulo}</span>
                    <span className="mt-0.5 line-clamp-2 block text-[11px] leading-snug text-lab-tenue sm:mt-1.5 sm:line-clamp-3 sm:flex-1 sm:text-[13px]">
                      {p.gancho}
                    </span>
                    {logos.length > 0 && (
                      <span aria-hidden className="mt-3 hidden gap-1 sm:flex">
                        {logos.map((t) => (
                          <EtiquetaLogo key={t.etiqueta} tec={t} className="size-6" />
                        ))}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-mano text-base text-lab-portal transition-transform duration-300 group-hover:translate-x-1 sm:mt-3 sm:text-lg">
                    <span className="hidden sm:inline">entrar </span>→
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* la mesada sobre la que se apoyan los experimentos */}
        <div aria-hidden className="mt-2 hidden w-[calc(100%+2rem)] sm:block">
          <div className="h-1.5 rounded-t-sm bg-[#2b4a52]" />
          <div className="h-3 rounded-b-sm bg-[#1f3a42] shadow-[0_12px_20px_-10px_rgba(0,0,0,0.8)]" />
        </div>
      </div>
    </div>
  );
}
