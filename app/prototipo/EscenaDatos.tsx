"use client";

import { useRef } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";

// Escena 3: una tabla que se arma fila por fila (simula la Dimensión API).
const FILAS = [
  ["1", "Villa Diaz Velez", "35"],
  ["2", "Mataderos", "30"],
  ["3", "Independiente de San Cayetano", "30"],
  ["4", "Ministerio", "27"],
  ["5", "Sportivo San Cayetano", "19"],
];

export function EscenaDatos() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Estado inicial explícito: las filas arrancan escondidas.
      gsap.set(".fila", { opacity: 0, x: -20 });
      linea
        .fromTo(".monitor", { opacity: 0, y: 80, rotateX: 20 }, { opacity: 1, y: 0, rotateX: 0, duration: 1.5 })
        .to(".fila", { opacity: 1, x: 0, duration: 0.6, stagger: 0.4 })
        .to(".monitor", { opacity: 0, scale: 0.95, duration: 1 }, "+=1.5");
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center [perspective:1200px]">
      <div className="monitor w-full max-w-md rounded-xl border border-lab-borde bg-lab-panel p-6">
        <p className="mb-4 font-mono text-xs uppercase tracking-wider text-lab-portal">
          Escena 3 · Datos en vivo
        </p>
        <table className="w-full text-sm">
          <tbody>
            {FILAS.map(([pos, club, pts]) => (
              <tr key={club} className="fila border-t border-lab-borde">
                <td className="w-6 py-2 text-lab-tenue">{pos}</td>
                <td className="py-2">{club}</td>
                <td className="py-2 text-right font-mono font-semibold text-lab-portal">{pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
