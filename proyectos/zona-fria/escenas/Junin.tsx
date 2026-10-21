"use client";

import { useRef } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";
import { JUNIN } from "../data/tarifas";

const CIFRAS = [
  { valor: JUNIN.hogaresConGas, etiqueta: "hogares con gas de red pierden el subsidio" },
  { valor: JUNIN.personasAfectadas, etiqueta: `personas afectadas, de ${JUNIN.poblacion.toLocaleString("es-AR")} habitantes` },
  { valor: JUNIN.aumentoHogar, prefijo: "+$", etiqueta: "más por mes para el hogar testigo (280 m³ en julio)" },
  { valor: JUNIN.sobrecostoTotal / 1e6, prefijo: "$", sufijo: " M", decimales: 1, etiqueta: "de sobrecosto total en Junín en julio, el mes pico" },
];

// Las cifras del partido se cuentan solas mientras el visitante avanza.
export function Junin() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".cifra", { opacity: 0, y: 24 });
      CIFRAS.forEach((c, i) => {
        const contador = { v: 0 };
        const el = ref.current?.querySelectorAll<HTMLElement>(".numero")[i];
        linea
          .to(`.cifra:nth-child(${i + 1})`, { opacity: 1, y: 0, duration: 0.5 }, i === 0 ? 0 : ">-0.1")
          .to(
            contador,
            {
              v: c.valor,
              duration: 1,
              ease: "power1.out",
              onUpdate: () => {
                if (el) {
                  el.textContent =
                    (c.prefijo ?? "") +
                    contador.v.toLocaleString("es-AR", { maximumFractionDigits: c.decimales ?? 0, minimumFractionDigits: c.decimales ?? 0 }) +
                    (c.sufijo ?? "");
                }
              },
            },
            "<",
          );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="w-full max-w-2xl">
        <p className="mb-6 font-mono text-xs text-lab-tenue sm:text-sm">Partido de Junín · invierno sin Zona Fría</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {CIFRAS.map((c) => (
            <div key={c.etiqueta} className="cifra rounded-xl border border-lab-borde bg-lab-panel p-4 sm:p-5">
              <span className="numero block font-mono text-3xl font-bold tabular-nums text-lab-portal sm:text-4xl">0</span>
              <span className="mt-1 block text-sm text-lab-tenue">{c.etiqueta}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
