"use client";

import { useRef } from "react";
import { useEscena, useGSAP, usePasoActual } from "@/components/recorrido";
import { Pasos } from "@/components/laboratorio/Pasos";
import { SERIE_ANUAL } from "../data/comercio";
import { PASOS_BALANZA } from "../data/pasos";

const MAXIMO = Math.max(...SERIE_ANUAL.saldo.map(Math.abs));

// Qué barras se resaltan en cada paso.
function resaltada(anio: number, saldo: number, paso: number): boolean {
  switch (paso) {
    case 0:
      return anio === 2002;
    case 1:
      return saldo < 0;
    case 2:
      return anio === 2017;
    default:
      return anio === 2025;
  }
}

const ANOTACION: Record<number, { anio: number; texto: string }> = {
  0: { anio: 2002, texto: "+2.400" },
  2: { anio: 2017, texto: "−8.700 · 900.000 autos" },
  3: { anio: 2025, texto: "−5.646 · peor en 13 años" },
};

// 24 años de saldo bilateral, contados en cuatro pasos: el gráfico queda
// quieto y resalta lo que cada paso cuenta.
export function Balanza() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const paso = usePasoActual(PASOS_BALANZA.length);
  const anotacion = ANOTACION[paso];

  useGSAP(
    () => {
      // entrada del panel; el resto lo deciden los pasos
      linea.fromTo(".panel", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }).to({}, { duration: 6 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="panel grid w-full max-w-5xl gap-6 sm:grid-cols-[18rem_1fr] sm:gap-10">
        <div>
          <p className="mb-3 font-mono text-xs text-lab-tenue sm:text-sm">Saldo comercial con Brasil · 2002–2025</p>
          <Pasos pasos={PASOS_BALANZA.map((p) => p.panel)} actual={paso} />
        </div>

        <div className="relative h-[34svh] self-center sm:h-[46svh]">
          <div className="absolute inset-x-0 top-1/2 h-px bg-lab-borde" />
          <div className="flex h-full items-stretch gap-1 sm:gap-2">
            {SERIE_ANUAL.anios.map((anio, i) => {
              const saldo = SERIE_ANUAL.saldo[i];
              const alto = (Math.abs(saldo) / MAXIMO) * 42;
              const positivo = saldo > 0;
              const viva = resaltada(anio, saldo, paso);
              return (
                <div key={anio} className="relative flex-1">
                  <div
                    className={`absolute inset-x-0 rounded-sm transition-all duration-500 ${positivo ? "bg-lab-portal" : "bg-rose-400"} ${viva ? "opacity-100" : "opacity-25"}`}
                    style={{ height: `${alto}%`, ...(positivo ? { bottom: "50%" } : { top: "50%" }) }}
                  />
                  {anotacion?.anio === anio && (
                    <span
                      className={`absolute inset-x-[-4rem] text-center font-mono text-[10px] tabular-nums sm:text-xs ${positivo ? "text-lab-portal" : "text-rose-300"}`}
                      style={positivo ? { bottom: `calc(50% + ${alto}% + 4px)` } : { top: `calc(50% + ${alto}% + 4px)` }}
                    >
                      {anotacion.texto}
                    </span>
                  )}
                  <span className={`absolute inset-x-0 -bottom-6 text-center font-mono text-[9px] sm:text-[10px] ${viva ? "text-lab-texto" : "text-lab-tenue"}`}>
                    {viva || i % 2 === 0 ? String(anio).slice(2) : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
