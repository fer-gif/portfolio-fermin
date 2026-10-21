"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";
import { ETIQUETA_CATEGORIA, type Proyecto } from "@/proyectos";

// Una mesa del laboratorio: el experimento entra deslizándose, se puede
// leer de qué va y abrirlo. El personaje comenta al costado.
export function Mesa({ proyecto, numero }: { proyecto: Proyecto; numero: number }) {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const enProceso = proyecto.estado === "en-proceso";

  useGSAP(
    () => {
      gsap.set(".ficha", { x: "60vw", opacity: 0, rotate: 3 });
      gsap.set(".detalle", { opacity: 0, y: 14 });
      linea
        .to(".ficha", { x: 0, opacity: 1, rotate: 0, duration: 1.4, ease: "power3.out" })
        .to(".detalle", { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }, "-=0.6")
        .to({}, { duration: 1.5 }); // tiempo para leer antes de que se vaya
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="flex h-full items-center justify-center px-4 sm:justify-end sm:pr-[8vw]">
      <article className="ficha w-full max-w-xl rounded-2xl border border-lab-borde bg-lab-panel p-6 shadow-[0_0_60px_-20px_rgba(126,227,91,0.4)] sm:p-8">
        <header className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-lab-tenue">
          <span className="text-lab-portal">
            Experimento {String(numero).padStart(2, "0")}
          </span>
          <span>{ETIQUETA_CATEGORIA[proyecto.categoria]}</span>
        </header>

        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{proyecto.titulo}</h2>

        <p className="detalle mt-3 text-lab-tenue">{proyecto.resumen}</p>

        <p className="detalle mt-4 border-l-2 border-lab-portal pl-3 text-sm">
          <span className="font-mono text-xs uppercase text-lab-tenue">Podés </span>
          {proyecto.artefacto}
        </p>

        <footer className="detalle mt-6 flex items-center justify-between">
          <span className="font-mono text-xs text-lab-tenue">
            {proyecto.autoria === "equipo" ? "en equipo" : "individual"}
            {enProceso && " · en proceso"}
          </span>
          <Link
            href={`/proyectos/${proyecto.slug}`}
            className="rounded-full border border-lab-portal px-4 py-2 font-mono text-sm text-lab-portal transition-colors hover:bg-lab-portal hover:text-lab-fondo"
          >
            {enProceso ? "espiar →" : "entrar →"}
          </Link>
        </footer>
      </article>
    </div>
  );
}
