"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEscena, useGSAP, viajar } from "@/components/recorrido";
import type { Proyecto } from "@/proyectos";
import { frascosDelStack } from "@/lib/tecnologias";
import { EtiquetaLogo } from "./LogoStack";

// Un link que viaja por el portal (con Ctrl/Cmd o la rueda, otra pestaña).
function LinkPortal({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        viajar(href);
      }}
      className={className}
    >
      {children}
    </Link>
  );
}

// El final de la página de un proyecto: el experimento que sigue (por el
// portal), volver a todos o escribirme.
export function EscenaSiguiente({ siguiente, numero, email }: { siguiente: Proyecto; numero: number; email: string }) {
  const { linea } = useEscena();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const href = `/proyectos/${siguiente.slug}`;
  const logos = frascosDelStack(siguiente.stack)
    .filter((t) => t.tipo === "logo")
    .slice(0, 4);

  useEffect(() => {
    router.prefetch(href);
    router.prefetch("/");
  }, [href, router]);

  useGSAP(
    () => {
      linea
        .fromTo(".siguiente", { opacity: 0, y: 30, rotation: -2 }, { opacity: 1, y: 0, rotation: 0, duration: 0.25, ease: "power2.out" }, 0.04)
        .from(".salidas", { opacity: 0, duration: 0.2 }, 0.15)
        .to({}, { duration: 0.6 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="flex h-full flex-col items-center justify-center px-4 text-center sm:pb-[12svh]">
      <p className="font-mano text-xl text-lab-portal sm:text-2xl">¿otro experimento?</p>
      <LinkPortal
        href={href}
        className="siguiente group mt-3 block w-full max-w-md rounded-2xl border border-lab-borde bg-lab-panel p-5 text-left shadow-[0_18px_30px_-16px_rgba(0,0,0,0.9)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-lab-portal hover:shadow-[0_18px_30px_-16px_rgba(0,0,0,0.9),0_0_30px_-12px_rgba(151,206,76,0.6)] sm:p-6"
      >
        <span className="font-mano text-lg text-lab-portal">experimento {String(numero).padStart(2, "0")}</span>
        <span className="font-display mt-1 block text-3xl leading-tight font-extrabold sm:text-4xl">{siguiente.titulo}</span>
        <span className="mt-2 block text-sm text-lab-tenue sm:text-base">{siguiente.gancho}</span>
        <span className="mt-4 flex items-center justify-between">
          <span aria-hidden className="flex gap-1">
            {logos.map((t) => (
              <EtiquetaLogo key={t.etiqueta} tec={t} className="size-6" />
            ))}
          </span>
          <span className="font-mano text-lg text-lab-portal transition-transform duration-300 group-hover:translate-x-1">entrar →</span>
        </span>
      </LinkPortal>

      <p className="salidas mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mano text-lg text-lab-tenue">
        <LinkPortal href="/#experimentos" className="garabato transition-colors hover:text-lab-portal">
          ← ver todos los experimentos
        </LinkPortal>
        <a href={`mailto:${email}`} className="garabato transition-colors hover:text-lab-portal">
          o escribime ✉
        </a>
      </p>
    </div>
  );
}
