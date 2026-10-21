"use client";

import { useRef } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";
import { SERIE_ANUAL } from "../data/comercio";

const MAXIMO = Math.max(...SERIE_ANUAL.saldo.map(Math.abs));
const DESTACADOS = new Set([2002, 2017, 2025]);
// La serie está muestreada (14 puntos); el dato completo lo da el informe.
const SUPERAVITS = { cantidad: 3, de: 24, anios: "2002, 2003 y 2019" };

// 24 años de saldo bilateral: las barras se levantan (o se hunden) al avanzar.
export function Balanza() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".barra", { scaleY: 0 });
      gsap.set(".conclusion", { opacity: 0, y: 10 });
      linea
        .to(".barra", { scaleY: 1, duration: 0.8, stagger: 0.12, ease: "power2.out" })
        .to(".conclusion", { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
        .to({}, { duration: 1 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="w-full max-w-3xl">
        <p className="mb-4 font-mono text-xs text-lab-tenue sm:text-sm">Saldo comercial con Brasil, 2002–2025 · millones de USD</p>

        <div className="relative h-[36svh] sm:h-[40svh]">
          {/* línea del cero */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-lab-borde" />
          <div className="flex h-full items-stretch gap-1 sm:gap-2">
            {SERIE_ANUAL.anios.map((anio, i) => {
              const saldo = SERIE_ANUAL.saldo[i];
              // deja lugar para la etiqueta del valor sin pisar los años
              const alto = (Math.abs(saldo) / MAXIMO) * 42;
              const positivo = saldo > 0;
              const destacado = DESTACADOS.has(anio);
              return (
                <div key={anio} className="relative flex-1">
                  <div
                    className={`barra absolute inset-x-0 rounded-sm ${positivo ? "bg-lab-portal" : "bg-rose-400"} ${destacado ? "" : "opacity-60"}`}
                    style={{
                      height: `${alto}%`,
                      ...(positivo ? { bottom: "50%", transformOrigin: "bottom" } : { top: "50%", transformOrigin: "top" }),
                    }}
                  />
                  {destacado && (
                    <span
                      className={`absolute inset-x-0 text-center font-mono text-[9px] tabular-nums sm:text-[11px] ${positivo ? "text-lab-portal" : "text-rose-300"}`}
                      style={positivo ? { bottom: `calc(50% + ${alto}% + 2px)` } : { top: `calc(50% + ${alto}% + 2px)` }}
                    >
                      {saldo > 0 ? "+" : "−"}{Math.abs(saldo).toLocaleString("es-AR")}
                    </span>
                  )}
                  <span
                    className={`absolute inset-x-0 -bottom-6 text-center font-mono text-[9px] sm:text-[10px] ${destacado ? "text-lab-texto" : "text-lab-tenue"}`}
                  >
                    {destacado || i % 2 === 0 ? String(anio).slice(2) : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="conclusion mt-10 text-center text-sm sm:text-base">
          Superávit en solo <span className="font-mono font-bold text-lab-portal">{SUPERAVITS.cantidad}</span> de {SUPERAVITS.de} años
          ({SUPERAVITS.anios}). El peor: 2017, cuando Argentina importó 900.000 autos.
        </p>
      </div>
    </div>
  );
}
