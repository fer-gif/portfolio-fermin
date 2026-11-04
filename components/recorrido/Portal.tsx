"use client";

import { useId, type Ref } from "react";

// El portal verde por el que se pasa de un proyecto al otro. Es solo el
// dibujo: Escena lo abre y lo cierra con el scroll. Está hecho de capas
// quietas (halo, disco, borde) y dos que giran solas (los brazos del
// remolino y el borde), así el navegador las mueve sin volver a pintarlas.

// Un brazo del remolino: una espiral que va del centro al borde.
function espiral(desfase: number, vueltas: number) {
  const fin = vueltas * Math.PI * 2;
  const puntos: string[] = [];
  for (let t = 0; t <= fin; t += 0.14) {
    const r = 6 + (t / fin) * 86;
    const a = t + desfase;
    puntos.push(`${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${puntos.join(" L")}`;
}

// El borde no es un círculo perfecto: tiembla un poco, como una mancha.
function mancha(radio: number, ondas: [number, number, number][]) {
  const puntos: string[] = [];
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    const r = radio * (1 + ondas.reduce((s, [amp, frec, fase]) => s + amp * Math.sin(frec * a + fase), 0));
    puntos.push(`${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${puntos.join(" L")}Z`;
}

const BRAZOS = [0, 1, 2, 3].map((i) => espiral((i * Math.PI) / 2, 1.25));
const DISCO = mancha(94, [
  [0.025, 5, 0.4],
  [0.018, 9, 1.7],
  [0.01, 14, 3.1],
]);
const BORDE = mancha(95, [
  [0.03, 6, 2.2],
  [0.02, 11, 0.3],
]);
// Gotas sueltas alrededor del borde.
const GOTAS = [
  { a: 0.3, d: 104, r: 3.2 },
  { a: 1.4, d: 108, r: 2.2 },
  { a: 2.2, d: 103, r: 2.8 },
  { a: 3.5, d: 107, r: 1.8 },
  { a: 4.3, d: 104, r: 3.4 },
  { a: 5.4, d: 109, r: 2 },
].map((g) => ({ cx: Math.cos(g.a) * g.d, cy: Math.sin(g.a) * g.d, r: g.r }));

export function Portal({ ref }: { ref?: Ref<HTMLDivElement> }) {
  const relleno = `portal-relleno-${useId().replace(/:/g, "")}`;
  return (
    <div
      ref={ref}
      aria-hidden
      // En celular la escena reserva 56 px arriba y 176 abajo: el centro del
      // contenido queda 60 px más arriba que el de la pantalla.
      className="portal pointer-events-none invisible fixed top-[calc(50%-60px)] left-1/2 z-[5] sm:top-1/2"
    >
      <div className="portal-halo" />
      <svg viewBox="-115 -115 230 230" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <radialGradient id={relleno}>
            <stop offset="0" stopColor="#f4ffd6" />
            <stop offset="0.22" stopColor="#c6f36a" />
            <stop offset="0.58" stopColor="#97ce4c" />
            <stop offset="0.86" stopColor="#4c8a2c" />
            <stop offset="1" stopColor="#2c5a1c" />
          </radialGradient>
        </defs>
        <path d={DISCO} fill={`url(#${relleno})`} />
      </svg>
      {/* los brazos giran con el scroll (.portal-giro) y además solos (.portal-remolino) */}
      <div className="portal-giro absolute inset-0">
        <svg viewBox="-115 -115 230 230" className="portal-remolino absolute inset-0 h-full w-full">
          {BRAZOS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={i % 2 ? "#2f6b1f" : "#f4ffd6"}
              strokeOpacity={i % 2 ? 0.45 : 0.7}
              strokeWidth={i % 2 ? 7 : 5}
              strokeLinecap="round"
            />
          ))}
          <circle r="16" fill="#f4ffd6" opacity="0.85" />
        </svg>
      </div>
      <svg viewBox="-115 -115 230 230" className="portal-borde absolute inset-0 h-full w-full overflow-visible">
        <path d={BORDE} fill="none" stroke="#d9ff8a" strokeWidth="4" strokeLinejoin="round" />
        {GOTAS.map((g, i) => (
          <circle key={i} cx={g.cx.toFixed(1)} cy={g.cy.toFixed(1)} r={g.r} fill="#97ce4c" />
        ))}
      </svg>
    </div>
  );
}
