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

// Dimensión Caos: así venían los datos. Los fragmentos caen desordenados
// y al final tiemblan: ningún sistema puede leer esto.
export function Caos() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".fragmento", {
        opacity: 0,
        y: "-60vh",
        x: (i: number) => `${POSICIONES[i].x}vw`,
        rotate: (i: number) => POSICIONES[i].r * 4,
      });
      linea
        .to(".fragmento", {
          opacity: 1,
          y: (i: number) => `${POSICIONES[i].y}vh`,
          rotate: (i: number) => POSICIONES[i].r,
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
      <p className="absolute top-14 px-4 text-center font-mono text-sm text-lab-tenue sm:top-10">
        Dimensión Caos · así existían los datos
      </p>
      {fragmentos.map((f, i) => (
        <div
          key={i}
          className={`fragmento absolute inset-0 m-auto h-fit w-64 border p-3 text-sm shadow-lg ${ESTILO[f.tipo]}`}
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
