"use client";

import { useRef } from "react";
import { useEscena, useGSAP, usePasoActual } from "@/components/recorrido";
import { Pasos } from "@/components/laboratorio/Pasos";
import { HALLAZGOS, type Hallazgo } from "../data/sistema";
import { PASOS_HALLAZGOS } from "../data/pasos";

// Un dibujito por bug, para que se entienda sin leer código.
function Visual({ tipo }: { tipo: Hallazgo["visual"] }) {
  if (tipo === "orden") {
    return (
      <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
        <div className="rounded-lg border border-lab-borde p-2">
          <p className="text-lab-tenue">Panel · arrastrás</p>
          <ol className="mt-1 space-y-0.5">
            <li>1 · Pelotas</li>
            <li>2 · Botines</li>
            <li>3 · Medias</li>
          </ol>
          <p className="mt-1 text-emerald-300">✓ guardado</p>
        </div>
        <div className="rounded-lg border border-rose-400/50 p-2">
          <p className="text-lab-tenue">POS · lo que se ve</p>
          <ol className="mt-1 space-y-0.5 text-lab-tenue">
            <li>Medias</li>
            <li>Pelotas</li>
            <li>Botines</li>
          </ol>
          <p className="mt-1 text-rose-300">sin cambios</p>
        </div>
      </div>
    );
  }
  if (tipo === "tope") {
    return (
      <div className="font-mono text-[10px]">
        <div className="flex justify-between text-lab-tenue">
          <span>position · tinyint</span>
          <span>tope 127</span>
        </div>
        <div className="relative mt-1 h-3 rounded-sm bg-lab-borde">
          <div className="h-full rounded-sm bg-lab-portal" style={{ width: "75%" }} />
          <div className="absolute inset-y-0 left-3/4 w-px bg-lab-texto" />
          <div className="absolute inset-y-0 left-3/4 right-0 rounded-r-sm border border-dashed border-rose-400 bg-rose-400/20" />
        </div>
        <div className="mt-1 flex justify-between gap-2">
          <span>0</span>
          <span className="text-rose-300">Pelotas · 168 productos → no entra</span>
        </div>
      </div>
    );
  }
  return (
    <div className="font-mono text-[10px]">
      <div className="rounded-lg border border-lab-borde">
        <div className="border-b border-lab-borde px-2 py-1 text-lab-tenue">Ordenar categorías ×</div>
        <div className="px-2 py-3 text-center text-lab-tenue">No hay nada que mostrar…</div>
      </div>
      <p className="mt-2">
        <span className="text-rose-300 line-through">WHERE parent_id IS NULL</span>
      </p>
      <p className="text-emerald-300">WHERE parent_id IS NULL OR parent_id = 0</p>
    </div>
  );
}

// Tres bugs del núcleo que nadie había visto, y la lección: probar a mano.
export function Hallazgos() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const paso = usePasoActual(PASOS_HALLAZGOS.length);

  useGSAP(
    () => {
      linea.fromTo(".panel", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }).to({}, { duration: 6 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="panel grid w-full max-w-5xl gap-4 sm:grid-cols-[18rem_1fr] sm:gap-10">
        <div>
          <p className="mb-3 font-mono text-xs text-lab-tenue sm:text-sm">Tres bugs del núcleo · encontrados de paso</p>
          <Pasos pasos={PASOS_HALLAZGOS.map((p) => p.panel)} actual={paso} />
        </div>

        <div className="grid gap-3 self-center sm:grid-cols-3">
          {HALLAZGOS.map((h, i) => {
            const visto = i <= Math.min(paso, HALLAZGOS.length - 1);
            const actual = i === paso;
            return (
              <article
                key={h.titulo}
                className={`rounded-xl border p-3 text-xs transition-all duration-500 ${
                  actual ? "border-lab-portal bg-lab-panel" : visto ? "border-lab-borde bg-lab-panel/60" : "border-transparent opacity-25"
                } ${actual ? "block" : "hidden sm:block"}`}
              >
                <p className="font-mono text-[10px] text-lab-portal">bug {i + 1}</p>
                <h3 className="mt-0.5 text-sm font-semibold">{h.titulo}</h3>
                <div className="mt-2">
                  <Visual tipo={h.visual} />
                </div>
                <dl className={`mt-2 space-y-1 text-lab-tenue ${actual ? "block" : "hidden sm:block"}`}>
                  <div>
                    <dt className="inline font-mono text-[10px] uppercase">Causa · </dt>
                    <dd className="inline">{h.causa}</dd>
                  </div>
                  <div>
                    <dt className="inline font-mono text-[10px] uppercase">Arreglo · </dt>
                    <dd className="inline text-lab-texto">{h.arreglo}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
          <p className={`sm:col-span-3 rounded-xl border border-dashed border-lab-portal/60 p-3 text-xs transition-opacity duration-700 ${paso >= 3 ? "opacity-100" : "opacity-0"}`}>
            <span className="font-mono text-[10px] uppercase text-lab-portal">La lección · </span>
            Probar a mano encuentra lo que ninguna prueba encuentra. Los tres salieron de abrir la pantalla y usarla con datos reales, y quedaron escritos en la bitácora.
          </p>
        </div>
      </div>
    </div>
  );
}
