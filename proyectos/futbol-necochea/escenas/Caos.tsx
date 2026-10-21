"use client";

import { useRef } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";
import { fragmentos, type Fragmento } from "../data/contenido";

const ESTILO: Record<Fragmento["tipo"], string> = {
  whatsapp: "rounded-2xl rounded-tl-sm border-emerald-900 bg-emerald-950/70",
  instagram: "rounded-md border-pink-900 bg-pink-950/50",
  nota: "rounded-sm border-amber-900 bg-amber-950/50 font-mono",
};

const POSICIONES = [
  { x: -30, y: -22, r: -6 },
  { x: 26, y: -16, r: 4 },
  { x: -22, y: 18, r: 3 },
  { x: 24, y: 22, r: -3 },
];

// En celular no entran dos columnas anchas: se apilan en zigzag.
const POSICIONES_MOVIL = [
  { x: -14, y: -26, r: -4 },
  { x: 14, y: -9, r: 3 },
  { x: -14, y: 8, r: 2 },
  { x: 14, y: 25, r: -3 },
];

// Dimensión Caos: así venían los datos. Los fragmentos caen desordenados
// y al final tiemblan: ningún sistema puede leer esto.
export function Caos() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const posiciones = window.innerWidth < 640 ? POSICIONES_MOVIL : POSICIONES;
      gsap.set(".fragmento", {
        opacity: 0,
        y: "-60vh",
        x: (i: number) => `${posiciones[i].x}vw`,
        rotate: (i: number) => posiciones[i].r * 4,
      });
      linea
        .to(".fragmento", {
          opacity: 1,
          y: (i: number) => `${posiciones[i].y}vh`,
          rotate: (i: number) => posiciones[i].r,
          duration: 1.2,
          ease: "bounce.out",
          stagger: 0.35,
        })
        .to(".fragmento", { x: "+=1.5vw", rotate: "+=2", duration: 0.15, repeat: 5, yoyo: true, ease: "none" }, "+=0.6")
        .to(".fragmento", { opacity: 0, filter: "blur(6px)", duration: 0.8 }, "+=0.4");
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative grid h-full place-items-center overflow-hidden">
      <p className="absolute top-4 px-4 text-center font-mono text-xs text-lab-tenue sm:top-10 sm:text-sm">
        Dimensión Caos · así existían los datos
      </p>
      {fragmentos.map((f, i) => (
        <div
          key={i}
          className={`fragmento absolute inset-0 m-auto h-fit w-56 border p-2.5 text-xs shadow-lg sm:w-64 sm:p-3 sm:text-sm ${ESTILO[f.tipo]}`}
        >
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-lab-tenue">{f.tipo}</span>
          {f.texto}
        </div>
      ))}
      <p className="absolute bottom-6 px-4 text-center font-mono text-[10px] text-lab-tenue/60">
        fragmentos recreados · capturas reales pendientes
      </p>
    </div>
  );
}
