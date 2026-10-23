"use client";

import { useRef } from "react";
import { useEscena, useGSAP, usePasoActual } from "@/components/recorrido";
import { Pasos } from "@/components/laboratorio/Pasos";
import { MAPA, PUNTOS, ZONAS } from "../data/sismos";
import { PASOS_MAPA } from "../data/pasos";

// Dónde va la etiqueta de cada zona (coordenadas del viewBox del mapa).
const ETIQUETAS: { x: number; y: number; anclaje: "start" | "middle" | "end" }[] = [
  { x: 112, y: 150, anclaje: "start" },
  { x: 150, y: 342, anclaje: "middle" },
  { x: 352, y: 318, anclaje: "end" },
];
const NEUTRO = "#8fa396";

// El mapa: diez años de sismos, y las tres zonas que se van encendiendo paso
// a paso. Las zonas ya contadas quedan prendidas.
export function Mapa() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const paso = usePasoActual(PASOS_MAPA.length);
  const zonaActiva = paso - 1; // -1: todavía sin zonas

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
          <p className="mb-3 font-mono text-xs text-lab-tenue sm:text-sm">Sismos en Argentina · 2016–2026 · USGS</p>
          <Pasos pasos={PASOS_MAPA.map((p) => p.panel)} actual={paso} />
        </div>

        <div className="flex flex-col items-center gap-2 self-center">
          <svg
            viewBox={`0 0 ${MAPA.ancho} ${MAPA.alto}`}
            className="h-[36svh] w-auto max-w-full sm:h-[62svh]"
            role="img"
            aria-label="Mapa de los sismos registrados en Argentina entre 2016 y 2026"
          >
            <path d={MAPA.sudamerica} fill="#121a15" stroke="#243129" strokeWidth={0.6} />
            <path d={MAPA.plataforma} fill="#16231c" />
            <path d={MAPA.provincias} fill="#1c2a22" stroke="#243129" strokeWidth={0.4} />
            <path d={MAPA.limites} fill="none" stroke={NEUTRO} strokeWidth={0.4} opacity={0.3} />
            <g>
              {PUNTOS.map(([x, y, z, m], i) => {
                const contada = z <= zonaActiva;
                const actual = z === zonaActiva;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={m >= 6 ? 2.4 : 1.3}
                    fill={contada ? ZONAS[z].color : NEUTRO}
                    opacity={zonaActiva < 0 ? 0.55 : actual ? 0.9 : contada ? 0.55 : 0.12}
                    className="transition-[opacity,fill] duration-500"
                  />
                );
              })}
            </g>
            {ZONAS.map(
              (zona, i) =>
                i <= zonaActiva && (
                  <text
                    key={zona.clave}
                    x={ETIQUETAS[i].x}
                    y={ETIQUETAS[i].y}
                    textAnchor={ETIQUETAS[i].anclaje}
                    fill={zona.color}
                    fontSize={9}
                    className="hidden font-mono sm:block"
                    opacity={i === zonaActiva ? 1 : 0.6}
                  >
                    {zona.nombre} · {zona.sismos.toLocaleString("es-AR")}
                  </text>
                ),
            )}
          </svg>

          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono text-[10px] sm:text-xs">
            {ZONAS.map((zona, i) => (
              <li
                key={zona.clave}
                className={`flex items-center gap-1.5 transition-opacity duration-500 ${i <= zonaActiva || zonaActiva < 0 ? "opacity-100" : "opacity-40"}`}
              >
                <span className="size-2 rounded-full" style={{ background: i <= zonaActiva ? zona.color : NEUTRO }} />
                {zona.nombre} <span className="text-lab-tenue">{zona.sismos.toLocaleString("es-AR")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
