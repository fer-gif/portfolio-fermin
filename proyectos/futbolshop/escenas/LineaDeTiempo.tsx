"use client";

import { useRef } from "react";
import { useEscena, useGSAP, usePasoActual } from "@/components/recorrido";
import { Pasos } from "@/components/laboratorio/Pasos";
import { HITOS } from "../data/sistema";
import { PASOS_LINEA } from "../data/pasos";

// De cero a producción: los hitos del proyecto, que se van encendiendo a
// medida que la historia avanza.
export function LineaDeTiempo() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const paso = usePasoActual(PASOS_LINEA.length);

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
          <p className="mb-3 font-mono text-xs text-lab-tenue sm:text-sm">Muove Stock · FutbolShop · 2026</p>
          <Pasos pasos={PASOS_LINEA.map((p) => p.panel)} actual={paso} />
        </div>

        <ol className="relative self-center border-l border-lab-borde pl-5 sm:pl-6">
          {HITOS.map((h, i) => {
            const contado = h.grupo <= paso;
            const actual = h.grupo === paso;
            return (
              <li
                key={i}
                className={`relative pb-3 transition-opacity duration-500 last:pb-0 sm:pb-4 ${contado ? "opacity-100" : "opacity-30"} ${actual ? "block" : "hidden sm:block"}`}
              >
                <span
                  className={`absolute -left-[1.6rem] top-1 size-2.5 rounded-full border transition-all sm:-left-[1.85rem] ${
                    actual ? "border-lab-portal bg-lab-portal shadow-[0_0_10px_rgba(126,227,91,0.6)]" : contado ? "border-lab-portal bg-lab-fondo" : "border-lab-tenue bg-lab-fondo"
                  }`}
                />
                <p className="font-mono text-[10px] text-lab-tenue sm:text-xs">{h.fecha}</p>
                <p className={`text-sm font-semibold ${actual ? "text-lab-portal" : ""}`}>{h.etiqueta}</p>
                <p className={`text-xs text-lab-tenue ${actual ? "block" : "hidden sm:block"}`}>{h.detalle}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
