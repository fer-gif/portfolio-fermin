"use client";

import { useRef, useState } from "react";
import { useEscena, useGSAP } from "@/components/recorrido";
import { SECTORES } from "../data/comercio";

// El artefacto vivo: elegís un sector y ves cuánto pesa Brasil en él.
export function Dependometro() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const [id, setId] = useState(SECTORES[0].id);
  const sector = SECTORES.find((s) => s.id === id) ?? SECTORES[0];

  useGSAP(
    () => {
      linea.fromTo(".panel", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2 }).to({}, { duration: 2 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="panel flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-lab-borde bg-lab-panel">
        <header className="flex items-center gap-2 border-b border-lab-borde px-4 py-2 font-mono text-xs uppercase tracking-wider text-lab-portal">
          <span className="size-2 rounded-full bg-lab-portal" aria-hidden />
          Dependómetro · elegí un sector
        </header>

        <div className="min-h-0 overflow-y-auto p-4 sm:p-5" data-desborda>
          <div className="flex flex-wrap gap-1.5">
            {SECTORES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setId(s.id)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  s.id === id
                    ? "border-lab-portal bg-lab-portal text-lab-fondo"
                    : "border-lab-borde text-lab-tenue hover:border-lab-portal hover:text-lab-texto"
                }`}
              >
                {s.icono} {s.nombre}
              </button>
            ))}
          </div>

          <div key={sector.id} className="mt-4 grid gap-4 sm:grid-cols-[1fr_14rem]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-lab-tenue">
                {sector.tipo === "agro" ? "Agroexportación" : "Industria"}
              </p>
              <p className="mt-1 font-mono text-3xl font-bold text-lab-portal sm:text-4xl">{sector.cifra}</p>
              <p className="mt-1 text-sm text-lab-tenue">{sector.cifraDetalle}</p>
              {sector.origen && (
                <p className="mt-3 text-xs">
                  <span className="font-mono uppercase text-lab-tenue">Origen · </span>
                  {sector.origen}
                </p>
              )}
              <p className="mt-1 text-xs">
                <span className="font-mono uppercase text-lab-tenue">Destino · </span>
                {sector.destino}
              </p>
            </div>

            <div className="rounded-lg border border-lab-borde bg-lab-fondo p-4">
              {sector.cuota ? (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-lab-tenue">Cuota argentina en Brasil</p>
                  <p className="mt-1 font-mono text-4xl font-bold tabular-nums">{sector.cuota.pct}%</p>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-sm bg-lab-borde">
                    <div className="h-full bg-lab-portal transition-[width] duration-700" style={{ width: `${sector.cuota.pct}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-lab-tenue">{sector.cuota.texto}</p>
                </>
              ) : (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-lab-tenue">Dependencia</p>
                  <p className="mt-1 text-sm">
                    {sector.tipo === "industria"
                      ? "Sin Brasil no hay mercado de escala: el informe lo llama la trampa automotriz e industrial."
                      : "El informe no publica la cuota de mercado de este producto."}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
