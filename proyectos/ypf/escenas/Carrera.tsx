"use client";

import { useRef } from "react";
import { useEscena, useGSAP, usePasoActual } from "@/components/recorrido";
import { Pasos } from "@/components/laboratorio/Pasos";
import { MODELOS, PRUEBA } from "../data/sismos";
import { PASOS_CARRERA } from "../data/pasos";

const MAXIMO_CV = 18;
const MAXIMO_PRUEBA = 10;
const n1 = (v: number) => v.toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// Los 12 meses de prueba: lo real como barras, lo predicho como línea.
function MiniPrueba() {
  const ancho = 320;
  const alto = 80;
  const tope = 80;
  const paso = ancho / PRUEBA.reales.length;
  const y = (v: number) => alto - (v / tope) * alto;
  const puntos = PRUEBA.predichos.map((v, i) => `${(i + 0.5) * paso},${y(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${ancho} ${alto + 14}`} className="mt-2 w-full max-w-sm" role="img" aria-label="Sismos reales contra predichos, mes a mes">
      {PRUEBA.reales.map((v, i) => (
        <rect key={i} x={i * paso + 4} y={y(v)} width={paso - 8} height={alto - y(v)} fill="#8fa396" opacity={0.45} rx={1} />
      ))}
      <polyline points={puntos} fill="none" stroke="#7ee35b" strokeWidth={2} strokeLinejoin="round" />
      {PRUEBA.meses.map(([, mes], i) => (
        <text key={i} x={(i + 0.5) * paso} y={alto + 11} textAnchor="middle" fontSize={8} fill="#8fa396" className="font-mono">
          {i % 2 === 0 ? MESES_CORTOS[mes - 1] : ""}
        </text>
      ))}
    </svg>
  );
}

// La carrera de modelos: cuatro barras de error, y el remate honesto en la
// prueba final.
export function Carrera() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const paso = usePasoActual(PASOS_CARRERA.length);

  useGSAP(
    () => {
      linea.fromTo(".panel", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }).to({}, { duration: 6 });
    },
    { scope: ref },
  );

  const referencia = MODELOS[0];
  const ganadora = MODELOS.find((m) => m.clave === "lineal") ?? MODELOS[1];

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="panel grid w-full max-w-5xl gap-4 sm:grid-cols-[18rem_1fr] sm:gap-10">
        <div>
          <p className="mb-3 font-mono text-xs text-lab-tenue sm:text-sm">Carrera de modelos · error medio, en sismos por mes</p>
          <Pasos pasos={PASOS_CARRERA.map((p) => p.panel)} actual={paso} />
        </div>

        <div className="space-y-3 self-center sm:space-y-5">
          <section>
            <h3 className="mb-2 font-mono text-[10px] uppercase tracking-wider text-lab-tenue">
              Validación cruzada temporal · 5 tandas de 12 meses
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {MODELOS.map((m, i) => {
                const visible = i === 0 || paso >= 1;
                const gana = paso >= 2 && m.clave === "lineal";
                const apagada = paso >= 2 && !gana;
                return (
                  <li key={m.clave} className={`transition-opacity duration-500 ${!visible ? "opacity-0" : apagada ? "opacity-40" : "opacity-100"}`}>
                    <div className="flex items-baseline justify-between gap-2 font-mono text-xs">
                      <span>
                        {m.nombre} <span className="hidden text-lab-tenue sm:inline">· {m.detalle}</span>
                      </span>
                      <span className={`tabular-nums ${gana ? "text-lab-portal" : ""}`}>
                        {n1(m.maeCV)} <span className="hidden text-lab-tenue sm:inline">± {n1(m.stdCV)}</span>
                      </span>
                    </div>
                    <div className="mt-1 h-2.5 overflow-hidden rounded-sm bg-lab-borde">
                      <div
                        className={`h-full transition-[width] duration-700 ${m.clave === "dummy" ? "bg-lab-tenue" : gana ? "bg-lab-portal" : "bg-sky-400/80"}`}
                        style={{ width: visible ? `${(m.maeCV / MAXIMO_CV) * 100}%` : 0 }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={`transition-opacity duration-700 ${paso >= 3 ? "opacity-100" : "opacity-0"}`}>
            <h3 className="mb-2 font-mono text-[10px] uppercase tracking-wider text-lab-tenue">
              Prueba final · 12 meses que el modelo nunca vio
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {[referencia, ganadora].map((m) => (
                <li key={m.clave}>
                  <div className="flex items-baseline justify-between font-mono text-xs">
                    <span>{m.nombre}</span>
                    <span className="tabular-nums">{n1(m.maeTest)}</span>
                  </div>
                  <div className="mt-1 h-2.5 overflow-hidden rounded-sm bg-lab-borde">
                    <div
                      className={`h-full transition-[width] duration-700 ${m.clave === "dummy" ? "bg-lab-tenue" : "bg-lab-portal"}`}
                      style={{ width: paso >= 3 ? `${(m.maeTest / MAXIMO_PRUEBA) * 100}%` : 0 }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="hidden sm:block">
              <MiniPrueba />
              <p className="font-mono text-[10px] text-lab-tenue">
                <span className="text-lab-tenue">▮</span> sismos reales · <span className="text-lab-portal">—</span> regresión lineal
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
