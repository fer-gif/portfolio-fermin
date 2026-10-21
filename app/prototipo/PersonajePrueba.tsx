"use client";

import { useCallback, useRef } from "react";
import { useEscenaActual, useProgreso } from "@/components/recorrido";

// Personaje provisorio: una caja que demuestra que el Director funciona.
// Cambia lo que dice según la escena y muestra el progreso en vivo.
const GUION: Record<string, string> = {
  portal: "Bienvenido. Antes de este proyecto, el fútbol de Necochea no existía en ninguna computadora.",
  multiverso: "En el multiverso de los datos, este club existe en 6 versiones. Mi trabajo fue convencerlas de que son la misma.",
  datos: "Y esto es lo que antes no existía: el fútbol de Necochea, ordenado y disponible.",
};

export function PersonajePrueba() {
  const escena = useEscenaActual();
  const barra = useRef<HTMLDivElement>(null);
  const numero = useRef<HTMLSpanElement>(null);

  useProgreso(
    useCallback((p: number) => {
      if (barra.current) barra.current.style.transform = `scaleX(${p})`;
      if (numero.current) numero.current.textContent = `${Math.round(p * 100)}%`;
    }, []),
  );

  return (
    <aside className="pointer-events-none fixed bottom-4 left-4 z-50 flex max-w-sm items-end gap-3">
      <div className="personaje grid size-16 shrink-0 place-items-center rounded-full border-2 border-lab-portal bg-lab-panel text-3xl">
        🧪
      </div>
      <div className="rounded-xl border border-lab-borde bg-lab-panel/95 p-3 text-sm backdrop-blur">
        <p className="min-h-10">{escena ? GUION[escena] : "…"}</p>
        <div className="mt-2 flex items-center gap-2 font-mono text-[10px] text-lab-tenue">
          <span>{escena ?? "sin escena"}</span>
          <div className="h-1 flex-1 overflow-hidden rounded bg-lab-borde">
            <div ref={barra} className="h-full origin-left bg-lab-portal" style={{ transform: "scaleX(0)" }} />
          </div>
          <span ref={numero} className="w-8 text-right">0%</span>
        </div>
      </div>
    </aside>
  );
}
