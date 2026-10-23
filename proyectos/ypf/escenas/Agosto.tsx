"use client";

import { useRef } from "react";
import { useEscena, useGSAP, usePasoActual } from "@/components/recorrido";
import { Pasos } from "@/components/laboratorio/Pasos";
import { MEDIANA_MENSUAL, MESES } from "../data/sismos";
import { PASOS_AGOSTO } from "../data/pasos";

// Escala del eje: un año normal entra en 160; con el pico hay que ir a 650.
const ESCALA_NORMAL = 160;
const ESCALA_PICO = 650;

// Sismos por mes: diez años parejos y una torre en agosto de 2021.
export function Agosto() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const paso = usePasoActual(PASOS_AGOSTO.length);
  const maximo = paso === 0 ? ESCALA_NORMAL : ESCALA_PICO;
  const guias = paso === 0 ? [50, 100, 150] : [200, 400, 600];

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
          <p className="mb-3 font-mono text-xs text-lab-tenue sm:text-sm">Sismos por mes · octubre 2016 – agosto 2026</p>
          <Pasos pasos={PASOS_AGOSTO.map((p) => p.panel)} actual={paso} />
        </div>

        <div className="relative h-[34svh] self-center sm:h-[46svh]">
          {guias.map((v) => (
            <div
              key={v}
              className="absolute inset-x-0 border-t border-dashed border-lab-borde transition-all duration-700"
              style={{ bottom: `${(v / maximo) * 100}%` }}
            >
              <span className="absolute -top-3 right-0 font-mono text-[9px] text-lab-tenue">{v}</span>
            </div>
          ))}
          <div
            className="absolute inset-x-0 border-t border-lab-portal/60 transition-all duration-700"
            style={{ bottom: `${(MEDIANA_MENSUAL / maximo) * 100}%` }}
          >
            <span className="absolute -top-3.5 left-0 font-mono text-[9px] text-lab-portal">mediana {MEDIANA_MENSUAL}</span>
          </div>

          <div className="flex h-full items-end gap-px sm:gap-0.5">
            {MESES.map(([anio, mes, cantidad]) => {
              const esPico = anio === 2021 && mes === 8;
              const esReplica = anio === 2021 && mes === 9;
              const valor = esPico && paso === 3 ? MEDIANA_MENSUAL : cantidad;
              const alto = Math.min(100, (valor / maximo) * 100);
              const viva = paso === 0 || esPico || (paso === 2 && esReplica);
              const color = esPico && paso >= 1 ? "bg-rose-400" : esReplica && paso === 2 ? "bg-rose-300" : "bg-lab-portal";
              return (
                <div key={`${anio}-${mes}`} className="relative h-full flex-1">
                  <div
                    className={`absolute inset-x-0 bottom-0 rounded-t-sm transition-all duration-700 ${color} ${viva ? "opacity-100" : "opacity-30"}`}
                    style={{ height: `${alto}%` }}
                  />
                  {esPico && paso === 3 && (
                    <div
                      className="absolute inset-x-0 bottom-0 rounded-t-sm border border-dashed border-rose-400/70"
                      style={{ height: `${(cantidad / maximo) * 100}%` }}
                    />
                  )}
                  {esPico && paso >= 1 && (
                    <span
                      className="absolute inset-x-[-6rem] text-center font-mono text-[10px] whitespace-nowrap text-rose-300 sm:text-xs"
                      style={{ bottom: `calc(${(cantidad / maximo) * 100}% + 4px)` }}
                    >
                      {paso === 3 ? `600 → ${MEDIANA_MENSUAL}` : paso === 2 ? "M 8,1 · 12 ago 2021" : "600 sismos"}
                    </span>
                  )}
                  {mes === 1 && anio % 2 === 1 && (
                    <span className="absolute -bottom-5 left-0 font-mono text-[9px] whitespace-nowrap text-lab-tenue">{anio}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
