"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";
import type { Proyecto } from "@/proyectos";

// Salida de todo proyecto: la ficha técnica, siempre con la misma forma.
// Parte de la carcasa común; cada proyecto puede sumar filas propias.
export function FichaTecnica({
  proyecto,
  filasExtra = [],
}: {
  proyecto: Proyecto;
  filasExtra?: { etiqueta: string; contenido: ReactNode }[];
}) {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".linea", { opacity: 0, y: 16 });
      linea.to(".linea", { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 });
    },
    { scope: ref },
  );

  const filas: { etiqueta: string; contenido: ReactNode }[] = [
    { etiqueta: "Rol", contenido: proyecto.rol },
    { etiqueta: "Con", contenido: proyecto.creditos },
    { etiqueta: "Modalidad", contenido: proyecto.autoria === "equipo" ? "En equipo" : "Individual" },
    // El stack se completa en meta.ts de cada proyecto.
    { etiqueta: "Stack", contenido: proyecto.stack.length ? proyecto.stack.join(" · ") : undefined },
    ...filasExtra,
    {
      etiqueta: "Enlaces",
      contenido: proyecto.enlaces.length ? (
        <span className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs">
          {proyecto.enlaces.map((e) => (
            <a key={e.url} href={e.url} target="_blank" rel="noopener noreferrer" className="text-lab-portal underline underline-offset-4">
              {e.etiqueta} ↗
            </a>
          ))}
        </span>
      ) : undefined,
    },
  ];

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="w-full max-w-xl">
        <p className="linea font-mono text-sm text-lab-portal">~/ficha-tecnica</p>
        <h2 className="linea mt-2 text-3xl font-bold tracking-tight">{proyecto.titulo}</h2>
        <dl className="mt-6 divide-y divide-lab-borde text-sm">
          {filas
            .filter((f) => f.contenido)
            .map((f) => (
              <div key={f.etiqueta} className="linea grid grid-cols-[6rem_1fr] gap-3 py-2 sm:grid-cols-[7rem_1fr]">
                <dt className="font-mono text-xs uppercase text-lab-tenue">{f.etiqueta}</dt>
                <dd>{f.contenido}</dd>
              </div>
            ))}
        </dl>
        <Link
          href="/"
          className="linea mt-8 inline-block rounded-full border border-lab-portal px-4 py-2 font-mono text-sm text-lab-portal hover:bg-lab-portal hover:text-lab-fondo"
        >
          ← volver al laboratorio
        </Link>
      </div>
    </div>
  );
}
