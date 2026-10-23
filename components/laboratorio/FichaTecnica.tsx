"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";
import type { Proyecto } from "@/proyectos";

// Salida de todo proyecto: la ficha técnica, siempre con la misma forma.
// Parte de la carcasa común; cada proyecto puede sumar filas propias.
// Arriba de todo, los dos botones que busca un reclutador: probarlo y ver el código.
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
      linea.to(".linea", { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 });
    },
    { scope: ref },
  );

  const filas: { etiqueta: string; contenido: ReactNode }[] = [
    { etiqueta: "Rol", contenido: proyecto.rol },
    {
      etiqueta: "Qué hice",
      contenido: proyecto.queHice?.length ? (
        <ul className="space-y-1">
          {proyecto.queHice.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-lab-portal">›</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : undefined,
    },
    { etiqueta: "Resultado", contenido: proyecto.resultado },
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

  const boton = "rounded-full px-4 py-2 font-mono text-sm transition-colors";

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="max-h-full w-full max-w-xl overflow-y-auto" data-desborda>
        <p className="linea font-mano text-2xl text-lab-portal">ficha técnica</p>
        <h2 className="linea font-display mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{proyecto.titulo}</h2>

        {(proyecto.probar || proyecto.codigo) && (
          <div className="linea mt-5 flex flex-wrap gap-3">
            {proyecto.probar && (
              <a
                href={proyecto.probar}
                target="_blank"
                rel="noopener noreferrer"
                className={`${boton} border border-lab-portal bg-lab-portal text-lab-fondo hover:bg-transparent hover:text-lab-portal`}
              >
                probarlo ↗
              </a>
            )}
            {proyecto.codigo && (
              <a
                href={proyecto.codigo}
                target="_blank"
                rel="noopener noreferrer"
                className={`${boton} border border-lab-borde text-lab-texto hover:border-lab-portal hover:text-lab-portal`}
              >
                ver el código ↗
              </a>
            )}
          </div>
        )}

        <dl className="mt-5 divide-y divide-lab-borde text-xs sm:mt-6 sm:text-sm">
          {filas
            .filter((f) => f.contenido)
            .map((f) => (
              <div key={f.etiqueta} className="linea grid grid-cols-[6rem_1fr] gap-3 py-2 sm:grid-cols-[7rem_1fr]">
                <dt className="font-mono text-xs uppercase text-lab-tenue">{f.etiqueta}</dt>
                <dd>{f.contenido}</dd>
              </div>
            ))}
        </dl>

        <p className="linea mt-8 font-mano text-lg text-lab-tenue">seguí bajando: la próxima mesa te espera ↓</p>
      </div>
    </div>
  );
}
