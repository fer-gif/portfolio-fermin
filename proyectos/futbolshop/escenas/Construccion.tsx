"use client";

import { useRef } from "react";
import { useEscena, useGSAP, usePasoActual } from "@/components/recorrido";
import { Pasos } from "@/components/laboratorio/Pasos";
import { MODULO } from "../data/sistema";
import { PASOS_CONSTRUCCION } from "../data/pasos";

const n = (v: number) => v.toLocaleString("es-AR");
const MAXIMO_PRUEBAS = Math.max(...MODULO.pruebas.map((p) => p.cantidad));

// Cómo está hecho: el núcleo que no se toca, el módulo que se engancha, las
// pruebas y la documentación. Cada paso enciende una parte del esquema.
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
          <p className="mb-3 font-mono text-xs text-lab-tenue sm:text-sm">Cómo está hecho · módulo sobre NexoPOS</p>
          <Pasos pasos={PASOS_CONSTRUCCION.map((p) => p.panel)} actual={paso} />
        </div>

        <div className="space-y-3 self-center text-xs">
          {/* el esquema (en celular, solo mientras la historia habla de él) */}
          <div className={`grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:grid ${paso <= 1 ? "grid" : "hidden"}`}>
            <div className="rounded-xl border border-lab-borde bg-lab-panel/60 p-3 text-lab-tenue">
              <p className="font-mono text-[10px] uppercase tracking-wider">Núcleo · NexoPOS 6.2.2</p>
              <p className="mt-1 text-sm font-semibold text-lab-texto">No se toca</p>
              <p className="mt-1 hidden sm:block">POS · catálogo · caja · contabilidad · usuarios</p>
              <p className="mt-2 font-mono text-[10px]">app/ · resources/ · routes/ · database/</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 font-mono text-[10px] text-lab-portal">
              <span>hooks</span>
              <span>←→</span>
              <span>filtros</span>
              <span>←→</span>
              <span>eventos</span>
            </div>
            <div className={`rounded-xl border p-3 transition-colors duration-500 ${paso >= 1 ? "border-yellow-400/80 bg-yellow-400/10" : "border-lab-portal/60 bg-lab-panel"}`}>
              <p className="font-mono text-[10px] uppercase tracking-wider text-yellow-300">Módulo · FutbolShop</p>
              <p className="mt-1 text-sm font-semibold">Todo lo propio</p>
              <div className={`mt-2 flex flex-wrap gap-1 transition-opacity duration-500 ${paso >= 1 ? "opacity-100" : "opacity-0"}`}>
                {MODULO.piezas.map((p) => (
                  <span key={p.clave} className="rounded-full border border-yellow-400/40 px-2 py-0.5 font-mono text-[10px]">
                    {p.cantidad} {p.nombre}
                  </span>
                ))}
              </div>
              <p className={`mt-2 font-mono text-[10px] text-lab-tenue transition-opacity duration-500 ${paso >= 1 ? "opacity-100" : "opacity-0"}`}>
                {n(MODULO.lineas.php)} PHP · {n(MODULO.lineas.ts)} TS · {n(MODULO.lineas.vue)} Vue
              </p>
            </div>
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
