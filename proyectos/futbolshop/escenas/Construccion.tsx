"use client";

import { useRef } from "react";
import { useEscena, useGSAP, usePasoActual } from "@/components/recorrido";
import { Pasos } from "@/components/laboratorio/Pasos";
import { ALCANCE, ANTES, MODULO } from "../data/sistema";
import { PASOS_CONSTRUCCION } from "../data/pasos";

const n = (v: number) => v.toLocaleString("es-AR");
const MAXIMO_PRUEBAS = Math.max(...MODULO.pruebas.map((p) => p.cantidad));

// De las planillas a un sistema: qué maneja, cómo está hecho, las pruebas y
// la documentación. Cada paso enciende una parte del esquema.
export function Construccion() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const paso = usePasoActual(PASOS_CONSTRUCCION.length);

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
          <p className="mb-3 font-mono text-xs text-lab-tenue sm:text-sm">De las planillas a un sistema a medida</p>
          <Pasos pasos={PASOS_CONSTRUCCION.map((p) => p.panel)} actual={paso} />
        </div>

        <div className="space-y-3 self-center text-xs">
          {/* antes → ahora (en celular, solo mientras la historia habla de eso) */}
          <div className={`grid-cols-[1fr_auto_1.6fr] items-stretch gap-2 sm:grid ${paso === 0 ? "grid" : "hidden"}`}>
            <div className="rounded-xl border border-lab-borde bg-lab-panel/60 p-3 text-lab-tenue">
              <p className="font-mono text-[10px] uppercase tracking-wider">Antes</p>
              <p className="mt-1 text-sm font-semibold text-lab-texto">Planillas sueltas</p>
              <p className="mt-1 text-[10px] sm:hidden">{ANTES.length} archivos de Excel que no se hablaban entre sí.</p>
              <ul className="mt-2 hidden space-y-1 font-mono text-[10px] sm:block">
                {ANTES.map((a) => (
                  <li key={a} className="flex items-center gap-1.5">
                    <span className="inline-block size-2 rounded-sm border border-emerald-500/60 bg-emerald-900/40" aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center font-mono text-lg text-lab-portal">→</div>
            <div className="rounded-xl border border-yellow-400/70 bg-yellow-400/10 p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-yellow-300">Ahora · un solo sistema</p>
              <p className="mt-1 text-sm font-semibold">Todo junto y conectado</p>
              <ul className="mt-2 flex flex-wrap gap-1">
                {ALCANCE.map((a, i) => (
                  <li key={a} className={`rounded-full border border-yellow-400/40 px-2 py-0.5 text-[10px] ${i >= 5 ? "hidden sm:block" : ""}`}>
                    {a}
                  </li>
                ))}
                <li className="px-2 py-0.5 text-[10px] text-lab-tenue sm:hidden">y {ALCANCE.length - 5} cosas más</li>
              </ul>
            </div>
          </div>

          {/* cómo está hecho */}
          <div className={`rounded-xl border border-lab-borde bg-lab-panel/60 p-3 transition-opacity duration-700 sm:block ${paso >= 1 ? "opacity-100" : "opacity-20"} ${paso === 1 ? "block" : "hidden"}`}>
            <p className="font-mono text-[10px] uppercase tracking-wider text-lab-tenue">Cómo está hecho</p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center font-mono">
              {[
                ["Laravel · PHP", "servidor"],
                ["Vue · TypeScript", "pantalla"],
                ["MySQL", "datos"],
              ].map(([t, s]) => (
                <div key={t} className="rounded-lg border border-lab-borde px-2 py-1.5">
                  <p className="text-xs font-semibold text-lab-texto">{t}</p>
                  <p className="text-[10px] text-lab-tenue">{s}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {MODULO.piezas.map((p) => (
                <span key={p.clave} className="rounded-full border border-lab-borde px-2 py-0.5 font-mono text-[10px]">
                  {p.cantidad} {p.nombre}
                </span>
              ))}
            </div>
            <p className="mt-2 font-mono text-[10px] text-lab-tenue">
              {n(MODULO.lineas.php)} líneas de PHP · {n(MODULO.lineas.ts)} de TypeScript · {n(MODULO.lineas.vue)} de Vue
            </p>
          </div>

          {/* pruebas */}
          <div className={`rounded-xl border border-lab-borde bg-lab-panel/60 p-3 transition-opacity duration-700 sm:block ${paso >= 2 ? "opacity-100" : "opacity-20"} ${paso === 2 ? "block" : "hidden"}`}>
            <p className="font-mono text-[10px] uppercase tracking-wider text-lab-tenue">Sin prueba no está hecho</p>
            <ul className="mt-2 space-y-1.5">
              {MODULO.pruebas.map((p) => (
                <li key={p.clave}>
                  <div className="flex items-baseline justify-between font-mono">
                    <span>
                      {p.nombre} <span className="hidden text-lab-tenue sm:inline">· {p.detalle}</span>
                    </span>
                    <span className="tabular-nums text-lab-portal">{n(p.cantidad)}</span>
                  </div>
                  <div className="mt-0.5 h-2 overflow-hidden rounded-sm bg-lab-borde">
                    <div className="h-full bg-lab-portal transition-[width] duration-700" style={{ width: paso >= 2 ? `${Math.max(2, (p.cantidad / MAXIMO_PRUEBAS) * 100)}%` : 0 }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* documentación */}
          <div className={`grid-cols-3 gap-2 transition-opacity duration-700 sm:grid ${paso >= 3 ? "grid opacity-100" : "hidden opacity-20"}`}>
            {[
              { valor: MODULO.docs.planes, etiqueta: "planes con bitácora" },
              { valor: MODULO.docs.fases, etiqueta: "fichas de fase" },
              { valor: MODULO.docs.lineas, etiqueta: "líneas de documentación" },
            ].map((d) => (
              <div key={d.etiqueta} className="rounded-xl border border-lab-borde bg-lab-panel/60 p-3">
                <p className="font-mono text-xl font-bold tabular-nums text-lab-portal sm:text-2xl">{n(d.valor)}</p>
                <p className="text-[10px] text-lab-tenue sm:text-xs">{d.etiqueta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
