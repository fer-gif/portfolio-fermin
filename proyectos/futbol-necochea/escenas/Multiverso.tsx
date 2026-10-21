"use client";

import { useRef, useState } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";
import type { Club } from "../api";
import { Escudo } from "../componentes/Escudo";
import { clubFusionado, variantes } from "../data/contenido";
import { normalizar } from "../normalizar";

const POSICIONES = [
  { x: -38, y: -28 },
  { x: 34, y: -32 },
  { x: -44, y: 10 },
  { x: 40, y: 14 },
  { x: -10, y: 34 },
  { x: 22, y: -8 },
];

// Dimensión Multiverso: un club existe en muchas versiones hasta que se
// fusionan en una. Después, el visitante prueba la máquina con lo que quiera.
export function Multiverso({ clubes }: { clubes: Club[] }) {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const [entrada, setEntrada] = useState("");
  const fusionado = clubes.find((c) => c.nombre === clubFusionado);
  const resultados = entrada.trim() ? normalizar(entrada, clubes).slice(0, 2) : [];

  useGSAP(
    () => {
      // En pantallas angostas las versiones se esparcen menos para no salirse.
      const factor = window.innerWidth < 640 ? 0.6 : 1;
      gsap.set(".variante", {
        opacity: 0,
        scale: 0.6,
        x: (i: number) => `${POSICIONES[i].x * factor}vw`,
        y: (i: number) => `${POSICIONES[i].y}vh`,
      });
      gsap.set(".final", { opacity: 0, scale: 0.5 });
      gsap.set(".maquina", { opacity: 0, y: 30 });
      linea
        .to(".variante", { opacity: 1, scale: 1, duration: 1, stagger: 0.15 })
        .to(".variante", { x: 0, y: 0, duration: 2, ease: "power3.inOut", stagger: 0.05 }, "+=1")
        .to(".variante", { opacity: 0, scale: 0.3, duration: 0.5 }, "-=0.4")
        .to(".final", { opacity: 1, scale: 1, duration: 1, ease: "back.out(2)" }, "-=0.2")
        .to(".final", { y: window.innerWidth < 640 ? "-16vh" : "-22vh", duration: 1 }, "+=0.8")
        .to(".maquina", { opacity: 1, y: 0, duration: 1 }, "<+=0.3")
        .to({}, { duration: 1.5 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative grid h-full place-items-center px-4">
      <p className="absolute top-14 font-mono text-sm text-lab-tenue sm:top-10">
        Dimensión Multiverso · un club, muchas versiones
      </p>

      {variantes.map((v) => (
        <span
          key={v}
          className="variante absolute inset-0 m-auto h-fit w-fit rounded-md border border-lab-borde bg-lab-panel px-3 py-1.5 font-mono text-sm"
        >
          {v}
        </span>
      ))}

      <div className="final absolute inset-0 m-auto flex h-fit w-fit items-center gap-3 rounded-xl border-2 border-lab-portal bg-lab-panel px-6 py-4">
        {fusionado && <Escudo src={fusionado.logo} club={fusionado.nombre} tamano={40} />}
        <span>
          <span className="block text-2xl font-bold">{clubFusionado}</span>
          <span className="font-mono text-xs text-lab-tenue">1 club · {variantes.length} versiones fusionadas</span>
        </span>
      </div>

      <div className="maquina absolute inset-0 m-auto h-fit w-full max-w-md translate-y-[10vh] rounded-xl border border-lab-borde bg-lab-panel p-4 sm:translate-y-[12vh] sm:p-5">
        <label className="block font-mono text-xs uppercase tracking-wider text-lab-portal">
          Probá la máquina: escribí un club como te salga
        </label>
        <input
          type="text"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder="ej: VDV, indep de loberia, sp. san cayetano"
          className="mt-3 w-full rounded-lg border border-lab-borde bg-lab-fondo px-3 py-2 text-sm outline-none focus:border-lab-portal"
        />
        <div className="mt-3 min-h-12 text-sm">
          {!clubes.length && <p className="text-lab-tenue">La máquina está sin conexión con la API.</p>}
          {clubes.length > 0 && entrada.trim() && resultados.length === 0 && (
            <p className="text-lab-tenue">No lo reconozco. Ni yo soy tan loco.</p>
          )}
          {resultados.map((r, i) => (
            <p key={r.club.nombre} className={`flex items-center gap-2 ${i > 0 ? "mt-1 text-lab-tenue" : ""}`}>
              {i === 0 ? "→" : "¿o quizás…?"}
              <Escudo src={r.club.logo} club={r.club.nombre} />
              <span className={i === 0 ? "font-semibold" : ""}>{r.club.nombre}</span>
              <span className="font-mono text-xs text-lab-tenue">{Math.round(r.puntaje * 100)}%</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
