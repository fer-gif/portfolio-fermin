"use client";

import { useRef, useState } from "react";
import { useEscena, useGSAP } from "@/components/recorrido";
import { HISTORIAL, MEDIANA_MENSUAL, MESES } from "../data/sismos";
import { proyectar } from "../modelo";

const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const [ANIO_FIN, MES_FIN] = MESES[MESES.length - 1];

// Etiqueta del mes a `k` meses del último real (k = 0 es ese mes).
function etiqueta(k: number): string {
  const indice = MES_FIN - 1 + k;
  const mes = ((indice % 12) + 12) % 12;
  const anio = ANIO_FIN + Math.floor(indice / 12);
  return `${MESES_CORTOS[mes]} ${String(anio).slice(2)}`;
}

// El artefacto vivo: elegís cuántos meses adelante y el modelo del notebook
// estima cuántos sismos esperar. Con toda la letra chica a la vista.
export function Consulta() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const [meses, setMeses] = useState(3);

  const proyeccion = proyectar(meses);
  const total = Math.round(proyeccion.reduce((a, b) => a + b, 0));
  const minimo = Math.round(Math.min(...proyeccion));
  const maximo = Math.round(Math.max(...proyeccion));
  const referencia = MEDIANA_MENSUAL * meses;
  const tope = Math.max(...HISTORIAL, ...proyeccion) * 1.15;
  const barras = [
    ...HISTORIAL.map((valor, i) => ({ valor, estimado: false, k: i - HISTORIAL.length + 1 })),
    ...proyeccion.map((valor, i) => ({ valor, estimado: true, k: i + 1 })),
  ];

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
          ¿Cuántos sismos se esperan en Argentina?
        </header>

        <div className="grid min-h-0 gap-5 overflow-y-auto p-4 sm:grid-cols-[1fr_15rem] sm:p-5" data-desborda>
          <div className="space-y-4">
            <label className="block text-xs">
              <span className="mb-1.5 flex justify-between font-mono text-lab-tenue">
                Próximos meses <span className="text-lab-texto">{meses}</span>
              </span>
              <input
                type="range"
                min={1}
                max={12}
                value={meses}
                onChange={(e) => setMeses(Number(e.target.value))}
                className="w-full accent-lab-portal"
              />
              <span className="mt-1 flex justify-between font-mono text-[10px] text-lab-tenue">
                <span>1 mes</span>
                <span>12 meses</span>
              </span>
            </label>

            <div>
              <div className="flex h-20 items-end gap-1 sm:h-28">
                {barras.map((b) => (
                  <div key={b.k} className="flex h-full flex-1 flex-col justify-end">
                    <span className="mb-0.5 text-center font-mono text-[9px] tabular-nums text-lab-tenue">{Math.round(b.valor)}</span>
                    <div
                      className={`rounded-t-sm transition-[height] duration-500 ${b.estimado ? "bg-lab-portal" : "bg-lab-tenue/50"}`}
                      style={{ height: `${(b.valor / tope) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1 flex gap-1">
                {barras.map((b) => (
                  <span key={b.k} className={`flex-1 text-center font-mono text-[8px] ${b.estimado ? "text-lab-portal" : "text-lab-tenue"}`}>
                    {b.k === 0 || b.k === 1 || b.k === -HISTORIAL.length + 1 || b.k === meses ? etiqueta(b.k) : ""}
                  </span>
                ))}
              </div>
              <p className="mt-2 font-mono text-[10px] text-lab-tenue">
                <span className="text-lab-tenue">▮</span> últimos seis meses reales · <span className="text-lab-portal">▮</span> estimados
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-lab-borde bg-lab-fondo p-4 text-sm">
            <p className="font-mono text-[10px] uppercase tracking-wider text-lab-tenue">Cantidad total estimada</p>
            <p className="mt-1 font-mono text-4xl font-bold tabular-nums text-lab-portal">{total.toLocaleString("es-AR")}</p>
            <p className="mt-1 text-xs text-lab-tenue">
              sismos en {meses === 1 ? "el próximo mes" : `los próximos ${meses} meses`}
              {meses > 1 && `, entre ${minimo} y ${maximo} por mes`}
            </p>
            <dl className="mt-3 space-y-1 border-t border-lab-borde pt-3 text-xs">
              <div className="flex justify-between">
                <dt className="text-lab-tenue">Si fuera siempre la mediana</dt>
                <dd className="font-mono tabular-nums">{referencia.toLocaleString("es-AR")}</dd>
              </div>
            </dl>
            <p className="mt-3 text-[10px] leading-snug text-lab-tenue/80">
              Regresión lineal entrenada con 113 meses (octubre 2016 – agosto 2026), con el pico de agosto de 2021 reemplazado por la mediana.
              Cada mes estimado se suma al historial para estimar el siguiente. Es una estimación estadística: no predice sismos individuales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
