"use client";

import { useEscenaActual } from "@/components/recorrido";
import type { Guion, Linea } from "./guion";
import { PersonajeRive } from "./PersonajeRive";
import { useMaquinaDeEscribir } from "./useMaquinaDeEscribir";
import "./personaje.css";

const SILENCIO: Linea = { texto: "" };

// El científico del laboratorio. Lee del Director en qué escena está el
// visitante y busca en el guion qué decir, qué pose tomar y de qué lado pararse.
export function Personaje({ guion, esperarIntro = false }: { guion: Guion; esperarIntro?: boolean }) {
  const escena = useEscenaActual();
  const linea: Linea =
    (escena ? guion.escenas[escena] : undefined) ?? guion.inicial ?? SILENCIO;
  const pose = linea.pose ?? "quieto";
  const lado = linea.lado ?? "izquierda";
  const { visible, escribiendo } = useMaquinaDeEscribir(linea.texto);

  return (
    <aside
      className={[
        "personaje-contenedor pointer-events-none fixed bottom-2 left-4 z-50 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:gap-3",
        lado === "derecha" ? "lado-derecha" : "",
        pose === "ausente" ? "ausente" : "",
        esperarIntro ? "espera-intro" : "",
      ].join(" ")}
      aria-live="polite"
    >
      <PersonajeRive pose={pose} className="order-2 h-24 shrink-0 sm:order-1 sm:h-44" />
      {linea.texto && (
        <div className="order-1 max-w-[80vw] rounded-2xl rounded-bl-sm border border-lab-borde bg-lab-panel/95 px-3 py-2 text-xs leading-snug backdrop-blur sm:order-2 sm:mb-6 sm:max-w-xs sm:rounded-bl-2xl sm:rounded-tl-sm sm:px-4 sm:py-3 sm:text-sm">
          {visible}
          {escribiendo && <span className="personaje-cursor text-lab-portal">▍</span>}
        </div>
      )}
    </aside>
  );
}
