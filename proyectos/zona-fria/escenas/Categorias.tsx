"use client";

import { useRef } from "react";
import { useEscena, useGSAP, usePasoActual } from "@/components/recorrido";
import { Pasos } from "@/components/laboratorio/Pasos";
import { pesos } from "../calcular";
import { FACTURA_POR_CATEGORIA } from "../data/tarifas";
import { PASOS_CATEGORIAS } from "../data/pasos";

const MAXIMO = Math.max(...FACTURA_POR_CATEGORIA.map((c) => c.sin));

// Las nueve categorías contadas en cuatro pasos: primero R1 con el
// descuento, después todas, después R1 sin el descuento, después todas.
export function Categorias() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const paso = usePasoActual(PASOS_CATEGORIAS.length);
  const soloR1 = paso === 0 || paso === 2;
  const conQuita = paso >= 2;

  useGSAP(
    () => {
      linea.fromTo(".panel", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }).to({}, { duration: 6 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="panel grid w-full max-w-5xl gap-6 sm:grid-cols-[18rem_1fr] sm:gap-10">
        <div>
          <p className="mb-3 font-mono text-xs text-lab-tenue sm:text-sm">Factura de julio por categoría</p>
          <Pasos pasos={PASOS_CATEGORIAS.map((p) => p.panel)} actual={paso} />
        </div>

        <div className="self-center">
          <div className="space-y-1.5 sm:space-y-2">
            {FACTURA_POR_CATEGORIA.map((c) => {
              const viva = !soloR1 || c.id === "R1";
              const aumento = Math.round(((c.sin - c.con) / c.con) * 100);
              return (
                <div
                  key={c.id}
                  className={`grid grid-cols-[2.6rem_1fr] items-center gap-2 text-xs transition-opacity duration-500 sm:grid-cols-[3rem_1fr] ${viva ? "opacity-100" : "opacity-20"}`}
                >
                  <span className="font-mono text-lab-tenue">{c.id}</span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 rounded-sm bg-lab-portal transition-all duration-700" style={{ width: `${(c.con / MAXIMO) * 100}%` }} />
                      <span className="font-mono tabular-nums text-lab-tenue">{pesos(c.con)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 origin-left rounded-sm bg-rose-400 transition-transform duration-700"
                        style={{ width: `${(c.sin / MAXIMO) * 100}%`, transform: conQuita ? "scaleX(1)" : "scaleX(0)" }}
                      />
                      <span className={`font-mono tabular-nums transition-opacity duration-500 ${conQuita ? "opacity-100" : "opacity-0"}`}>
                        {pesos(c.sin)}
                        {paso === 3 && <span className="ml-2 text-rose-300">+{aumento}%</span>}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 flex gap-4 font-mono text-[10px] text-lab-tenue">
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm bg-lab-portal" /> con Zona Fría (30 %)</span>
            <span className={`flex items-center gap-1 transition-opacity ${conQuita ? "opacity-100" : "opacity-30"}`}><span className="inline-block h-2 w-3 rounded-sm bg-rose-400" /> sin Zona Fría</span>
          </p>
        </div>
      </div>
    </div>
  );
}
