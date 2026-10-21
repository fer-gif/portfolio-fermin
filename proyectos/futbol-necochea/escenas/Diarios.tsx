"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";
import type { Noticia } from "../api";

// Dimensión Diarios: los datos llegan a la prensa. Notas reales que usan la API.
// PENDIENTE: embeber el widget real cuando haya un client-id propio.
export function Diarios({ noticias }: { noticias: Noticia[] }) {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".nota", { opacity: 0, y: 40 });
      linea.to(".nota", { opacity: 1, y: 0, duration: 0.8, stagger: 0.3 }).to({}, { duration: 1.5 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="w-full max-w-4xl">
        <p className="mb-6 text-center font-mono text-sm text-lab-tenue">
          Dimensión Diarios · así llegan los datos a la gente
        </p>
        {noticias.length === 0 && (
          <p className="text-center text-sm text-lab-tenue">Las rotativas están paradas: la API no respondió.</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {noticias.map((n) => (
            <a
              key={n.id}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="nota group overflow-hidden rounded-xl border border-lab-borde bg-lab-panel transition-colors hover:border-lab-portal"
            >
              {n.image && (
                <div className="relative aspect-[16/7] w-full">
                  <Image src={n.image} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
              )}
              <div className="p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-lab-portal">{n.siteName}</p>
                <h3 className="mt-1 line-clamp-2 text-sm font-semibold group-hover:text-lab-portal">
                  {n.title.replace(/ - Data eNe$/, "")}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
