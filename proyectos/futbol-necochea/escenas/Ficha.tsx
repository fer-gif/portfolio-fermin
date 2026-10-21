"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";
import type { Proyecto } from "@/proyectos";
import { ENDPOINTS } from "../api";

// Salida del proyecto: la ficha técnica, siempre con la misma forma en todos.
export function Ficha({ proyecto }: { proyecto: Proyecto }) {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".linea", { opacity: 0, y: 16 });
      linea.to(".linea", { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 });
    },
    { scope: ref },
  );

  const filas: [string, string | undefined][] = [
    ["Rol", proyecto.rol],
    ["Con", proyecto.creditos],
    ["Modalidad", proyecto.autoria === "equipo" ? "En equipo" : "Individual"],
    // PENDIENTE: stack real del proyecto (proyecto.stack en meta.ts)
    ["Stack", proyecto.stack.length ? proyecto.stack.join(" · ") : undefined],
  ];

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="w-full max-w-xl">
        <p className="linea font-mono text-sm text-lab-portal">~/ficha-tecnica</p>
        <h2 className="linea mt-2 text-3xl font-bold tracking-tight">{proyecto.titulo}</h2>
        <dl className="mt-6 divide-y divide-lab-borde text-sm">
          {filas
            .filter((f): f is [string, string] => Boolean(f[1]))
            .map(([k, v]) => (
              <div key={k} className="linea grid grid-cols-[7rem_1fr] gap-3 py-2">
                <dt className="font-mono text-xs uppercase text-lab-tenue">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          <div className="linea grid grid-cols-[7rem_1fr] gap-3 py-2">
            <dt className="font-mono text-xs uppercase text-lab-tenue">API</dt>
            <dd className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs">
              {Object.entries(ENDPOINTS).map(([k, url]) => (
                <a key={k} href={url} target="_blank" rel="noopener noreferrer" className="text-lab-portal underline underline-offset-4">
                  /{k}
                </a>
              ))}
            </dd>
          </div>
        </dl>
        <Link href="/" className="linea mt-8 inline-block rounded-full border border-lab-portal px-4 py-2 font-mono text-sm text-lab-portal hover:bg-lab-portal hover:text-lab-fondo">
          ← volver al laboratorio
        </Link>
      </div>
    </div>
  );
}
