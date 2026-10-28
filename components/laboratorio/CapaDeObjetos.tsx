"use client";

import { OBJETOS } from "./objetos";

// Las zonas tocables del laboratorio. Los dibujos viven en la escenografía,
// detrás de las escenas; esta capa va por delante, es invisible y solo tiene
// las siluetas que reciben el mouse. Usa el mismo viewBox que la escenografía,
// así cada zona cae exactamente sobre su dibujo.
const ZONAS: Record<string, { x: number; y: number; w: number; h: number }> = {
  estante: { x: 90, y: 110, w: 300, h: 84 },
  surf: { x: 468, y: 128, w: 128, h: 92 },
  jiujitsu: { x: 610, y: 104, w: 98, h: 120 },
  rugby: { x: 732, y: 140, w: 116, h: 86 },
  kimono: { x: 150, y: 320, w: 120, h: 242 },
  // la tabla: su mitad izquierda, para no pisar la barra de capítulos
  tabla: { x: 1340, y: 222, w: 90, h: 580 },
};

export function CapaDeObjetos({
  onEntrar,
  onSalir,
  onTocar,
}: {
  onEntrar: (id: string) => void;
  onSalir: () => void;
  onTocar: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden sm:block">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="pointer-events-none h-full w-full">
        {Object.entries(ZONAS).map(([id, z]) => {
          const objeto = OBJETOS.find((o) => o.id === id);
          return (
            <g
              key={id}
              role="button"
              tabIndex={0}
              aria-label={objeto ? `Tocar ${objeto.nombre}` : id}
              className="cursor-pointer outline-none"
              style={{ pointerEvents: "all" }}
              onMouseEnter={() => onEntrar(id)}
              onMouseLeave={onSalir}
              onFocus={() => onEntrar(id)}
              onBlur={onSalir}
              onClick={() => onTocar(id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onTocar(id);
                }
              }}
            >
              <rect x={z.x} y={z.y} width={z.w} height={z.h} fill="transparent" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
