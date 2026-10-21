"use client";

import { useRef } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";
import { ASIMETRIA } from "../data/comercio";

const { congelamiento: c } = ASIMETRIA;

const GOLPES = [
  { pais: "Brasil", texto: "de su comercio total", pct: c.brasilComercio, color: "bg-lab-tenue" },
  { pais: "Argentina", texto: "de sus exportaciones", pct: c.argentinaExportaciones, color: "bg-lab-portal" },
  { pais: "Argentina", texto: "de sus importaciones clave", pct: c.argentinaImportacionesClave, color: "bg-lab-portal" },
];

// Dos economías de tamaños muy distintos, y qué pasa si el comercio se congela.
export function Asimetria() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".economia", { scale: 0, transformOrigin: "center" });
      gsap.set(".golpe", { opacity: 0, y: 12 });
      gsap.set(".golpe-barra", { scaleX: 0, transformOrigin: "left center" });
      linea
        .to(".economia-ar", { scale: 1, duration: 0.8, ease: "back.out(1.6)" })
        .to(".economia-br", { scale: 1, duration: 1.4, ease: "power2.out" }, "-=0.3")
        .to(".pregunta", { opacity: 1, duration: 0.5 }, "+=0.4")
        .to(".golpe", { opacity: 1, y: 0, duration: 0.4, stagger: 0.3 })
        .to(".golpe-barra", { scaleX: 1, duration: 0.9, stagger: 0.3, ease: "power2.out" }, "<+=0.2")
        .to({}, { duration: 1 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="w-full max-w-3xl">
        <p className="mb-4 font-mono text-xs text-lab-tenue sm:text-sm">Dos economías · una balanza</p>

        <div className="flex items-end justify-center gap-6 sm:gap-12">
          <div className="text-center">
            <div className="economia economia-ar mx-auto size-14 rounded-full border-2 border-lab-portal bg-lab-portal/20 sm:size-20" />
            <p className="mt-2 text-sm font-semibold">Argentina</p>
            <p className="font-mono text-[10px] text-lab-tenue">1×</p>
          </div>
          <div className="text-center">
            <div className="economia economia-br mx-auto size-32 rounded-full border-2 border-lab-tenue bg-lab-tenue/15 sm:size-44" />
            <p className="mt-2 text-sm font-semibold">Brasil</p>
            <p className="font-mono text-[10px] text-lab-tenue">
              {ASIMETRIA.vecesMasGrande}× · USD {ASIMETRIA.pbiBrasilBillones.toLocaleString("es-AR")} billones
            </p>
          </div>
        </div>

        <p className="pregunta mt-6 text-center text-sm opacity-0 sm:text-base">
          Si el comercio se congela, ¿a quién le duele?
        </p>

        <div className="mt-4 space-y-2">
          {GOLPES.map((g, i) => (
            <div key={i} className="golpe grid grid-cols-[5.5rem_1fr_3rem] items-center gap-2 text-xs sm:text-sm">
              <span className={`font-mono ${g.pais === "Argentina" ? "text-lab-portal" : "text-lab-tenue"}`}>{g.pais}</span>
              <div className="h-2.5 overflow-hidden rounded-sm bg-lab-borde">
                <div className={`golpe-barra h-full ${g.color}`} style={{ width: `${(g.pct / 25) * 100}%` }} />
              </div>
              <span className="text-right font-mono tabular-nums">{g.pct.toLocaleString("es-AR")}%</span>
              <span className="col-start-2 -mt-1 text-[10px] text-lab-tenue">{g.texto}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
