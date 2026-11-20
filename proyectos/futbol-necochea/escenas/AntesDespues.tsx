"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useEscena, useGSAP } from "@/components/recorrido";
import { CAPTURAS_ANTES, CAPTURAS_DESPUES } from "../data/contenido";

type Lado = "antes" | "despues";

// Parada 1 · Antes y después: las capturas reales de cómo se publicaba el
// fútbol local en texto plano vs. el widget embebible en producción en Data eNe.
export function AntesDespues() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const [lado, setLado] = useState<Lado>("antes");
  const [indiceAntes, setIndiceAntes] = useState(0);
  const [indiceDespues, setIndiceDespues] = useState(0);

  const lista = lado === "antes" ? CAPTURAS_ANTES : CAPTURAS_DESPUES;
  const indice = lado === "antes" ? indiceAntes : indiceDespues;
  const setIndice = lado === "antes" ? setIndiceAntes : setIndiceDespues;
  const actual = lista[indice] ?? lista[0];

  useGSAP(
    () => {
      linea.fromTo(".panel", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2 }).to({}, { duration: 2 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="panel flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-lab-borde bg-lab-panel sm:max-h-[82svh]">
        <header className="flex flex-wrap items-center gap-2 border-b border-lab-borde px-3 py-2 sm:px-4">
          <span
            className={`size-2 rounded-full ${lado === "despues" ? "bg-lab-portal" : "bg-rose-400"}`}
            aria-hidden
          />
          <span className="mr-auto font-mono text-xs uppercase tracking-wider text-lab-tenue">
            Capturas reales ·{" "}
            <span className={lado === "despues" ? "text-lab-portal" : "text-rose-300"}>
              {lado === "antes" ? "antes" : "con el widget"}
            </span>
          </span>

          <div className="flex rounded-full border border-lab-borde bg-lab-fondo p-0.5 font-mono text-[11px] sm:text-xs">
            <button
              type="button"
              onClick={() => setLado("antes")}
              className={`rounded-full px-3 py-1 transition-colors ${
                lado === "antes" ? "bg-rose-400/20 text-rose-200" : "text-lab-tenue hover:text-lab-texto"
              }`}
            >
              Antes
            </button>
            <button
              type="button"
              onClick={() => setLado("despues")}
              className={`rounded-full px-3 py-1 transition-colors ${
                lado === "despues" ? "bg-lab-portal text-lab-fondo font-semibold" : "text-lab-tenue hover:text-lab-texto"
              }`}
            >
              Después
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5" data-desborda>
          {/* selector de captura dentro de cada lado */}
          <div className="flex flex-wrap items-center gap-1.5">
            {lista.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setIndice(i)}
                className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
                  i === indice
                    ? lado === "despues"
                      ? "border-lab-portal bg-lab-portal/15 text-lab-portal"
                      : "border-rose-400/70 bg-rose-400/15 text-rose-200"
                    : "border-lab-borde text-lab-tenue hover:border-lab-tenue hover:text-lab-texto"
                }`}
              >
                {c.etiqueta}
              </button>
            ))}
          </div>

          {/* captura real */}
          <figure className="mt-3">
            <div
              className={`flex max-h-[38svh] items-center justify-center overflow-hidden rounded-lg border p-2 sm:max-h-[42svh] sm:p-3 ${
                lado === "antes"
                  ? "border-lab-borde bg-[#f7f7f5]"
                  : "border-lab-portal/50 bg-[#080a0c]"
              }`}
            >
              <Image
                src={actual.src}
                alt={actual.alt}
                width={actual.ancho}
                height={actual.alto}
                sizes="(max-width: 896px) 92vw, 840px"
                className="max-h-[34svh] w-auto max-w-full rounded object-contain sm:max-h-[38svh]"
              />
            </div>

            <figcaption className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-lab-tenue sm:text-sm">{actual.nota}</p>
              <button
                type="button"
                onClick={() => setLado(lado === "antes" ? "despues" : "antes")}
                className={`shrink-0 self-start rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors sm:self-center ${
                  lado === "antes"
                    ? "border-lab-portal bg-lab-portal text-lab-fondo hover:bg-transparent hover:text-lab-portal"
                    : "border-lab-borde text-lab-tenue hover:border-rose-400 hover:text-rose-200"
                }`}
              >
                {lado === "antes" ? "Ver el widget →" : "← Volver al antes"}
              </button>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
