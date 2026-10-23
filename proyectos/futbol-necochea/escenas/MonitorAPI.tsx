"use client";

import { useRef, useState } from "react";
import { useEscena, useGSAP } from "@/components/recorrido";
import { desbloquear } from "@/components/laboratorio/logros";
import { ENDPOINTS, type Goleador, type Partido, type Posicion } from "../api";
import { Goleadores } from "../componentes/Goleadores";
import { TablaPosiciones } from "../componentes/TablaPosiciones";
import { UltimaFecha } from "../componentes/UltimaFecha";

export interface DatosAPI {
  liga: string | null;
  zonaA: Posicion[];
  zonaB: Posicion[];
  ultimaFecha: { jornada: string; partidos: Partido[] } | null;
  goleadores: Goleador[];
}

type Pestana = "posiciones" | "fecha" | "goleadores" | "json";

const PESTANAS: { id: Pestana; etiqueta: string }[] = [
  { id: "posiciones", etiqueta: "Posiciones" },
  { id: "fecha", etiqueta: "Última fecha" },
  { id: "goleadores", etiqueta: "Goleadores" },
  { id: "json", etiqueta: "{ JSON }" },
];

// Dimensión API: el monitor donde se ven los datos reales, en vivo.
export function MonitorAPI({ datos }: { datos: DatosAPI }) {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const [pestana, setPestana] = useState<Pestana>("posiciones");
  const hayDatos = datos.zonaA.length || datos.ultimaFecha || datos.goleadores.length;

  useGSAP(
    () => {
      linea
        .fromTo(".monitor", { opacity: 0, y: 80, rotateX: 18 }, { opacity: 1, y: 0, rotateX: 0, duration: 1.5 })
        .to({}, { duration: 2 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4 [perspective:1200px]">
      <div className="monitor flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-lab-borde bg-lab-panel sm:max-h-[80svh]">
        <header className="flex flex-wrap items-center gap-1 border-b border-lab-borde px-3 py-2">
          <span className="mr-2 size-2 rounded-full bg-lab-portal" aria-hidden />
          <span className="mr-auto font-mono text-xs uppercase tracking-wider text-lab-portal">
            Dimensión API<span className="hidden md:inline"> · {datos.liga ?? "en vivo"}</span>
          </span>
          {PESTANAS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPestana(p.id);
                desbloquear("api");
              }}
              className={`rounded-md px-2 py-1 font-mono text-[11px] transition-colors sm:px-2.5 sm:text-xs ${
                pestana === p.id ? "bg-lab-borde text-lab-texto" : "text-lab-tenue hover:text-lab-texto"
              }`}
            >
              {p.etiqueta}
            </button>
          ))}
        </header>

        <div className="min-h-0 overflow-y-auto p-4 sm:p-5" data-desborda>
          {!hayDatos && (
            <p className="text-sm text-lab-tenue">La API no respondió. El portal se reabre en unos minutos.</p>
          )}
          {pestana === "posiciones" && datos.zonaA.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2">
              <TablaPosiciones zona="A" filas={datos.zonaA} />
              <TablaPosiciones zona="B" filas={datos.zonaB} />
            </div>
          )}
          {pestana === "fecha" && datos.ultimaFecha && <UltimaFecha {...datos.ultimaFecha} />}
          {pestana === "goleadores" && <Goleadores goleadores={datos.goleadores.slice(0, 8)} />}
          {pestana === "json" && (
            <div>
              <p className="mb-2 font-mono text-xs text-lab-portal">GET {ENDPOINTS.goleadores}</p>
              <pre className="overflow-x-auto font-mono text-xs text-lab-tenue">
                {JSON.stringify({ success: true, goleadores: datos.goleadores.slice(0, 2) }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
