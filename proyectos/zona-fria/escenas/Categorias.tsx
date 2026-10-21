"use client";

import { useRef } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";
import { pesos } from "../calcular";
import { FACTURA_POR_CATEGORIA } from "../data/tarifas";

const MAXIMO = Math.max(...FACTURA_POR_CATEGORIA.map((c) => c.sin));

// Las nueve categorías: cuánto paga cada una en julio, con y sin Zona Fría.
// Las barras crecen a medida que el visitante avanza.
export function Categorias() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".barra", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".fila", { opacity: 0 });
      linea
        .to(".fila", { opacity: 1, duration: 0.3, stagger: 0.15 })
        .to(".barra-con", { scaleX: 1, duration: 1, stagger: 0.08, ease: "power2.out" }, "<+=0.3")
        .to(".barra-sin", { scaleX: 1, duration: 1, stagger: 0.08, ease: "power2.out" }, "<+=0.4")
        .to({}, { duration: 1 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="w-full max-w-2xl">
        <p className="mb-4 font-mono text-xs text-lab-tenue sm:text-sm">
          Factura de julio por categoría, para el consumo típico de cada una · con y sin Zona Fría (30%)
        </p>
        <div className="space-y-2">
          {FACTURA_POR_CATEGORIA.map((c) => (
            <div key={c.id} className="fila grid grid-cols-[2.6rem_1fr] items-center gap-2 text-xs sm:grid-cols-[3rem_1fr]">
              <span className="font-mono text-lab-tenue">{c.id}</span>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="barra barra-con h-2.5 rounded-sm bg-lab-portal" style={{ width: `${(c.con / MAXIMO) * 100}%` }} />
                  <span className="font-mono tabular-nums text-lab-tenue">{pesos(c.con)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="barra barra-sin h-2.5 rounded-sm bg-rose-400" style={{ width: `${(c.sin / MAXIMO) * 100}%` }} />
                  <span className="font-mono tabular-nums">{pesos(c.sin)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 flex gap-4 font-mono text-[10px] text-lab-tenue">
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm bg-lab-portal" /> con Zona Fría</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm bg-rose-400" /> sin Zona Fría</span>
        </p>
      </div>
    </div>
  );
}
