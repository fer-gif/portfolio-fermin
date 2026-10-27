import { ETIQUETA_CATEGORIA, type Proyecto } from "@/proyectos";
import type { ReactNode } from "react";

// La ficha del modo directo: lo mismo que la ficha técnica del recorrido, pero
// estática (sin GSAP ni Escena) para que un reclutador pueda leer todo de una,
// sin hacer el recorrido. Lee solo de meta.ts.
//
// A diferencia de FichaTecnica, no incluye las filasExtra (Fuentes, Código,
// En proceso) porque viven dentro de cada escenas.tsx junto a componentes
// cliente pesados. Sumarlas acá implica extraerlas a un módulo de datos: queda
// pendiente.
export function FichaDirecta({ proyecto, numero }: { proyecto: Proyecto; numero: number }) {
  const enProceso = proyecto.estado === "en-proceso";
  const modalidad = `${proyecto.autoria === "equipo" ? "En equipo" : "Individual"}${enProceso ? " · en proceso" : ""}`;

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
    { etiqueta: "Modalidad", contenido: modalidad },
    { etiqueta: "Stack", contenido: proyecto.stack.length ? proyecto.stack.join(" · ") : undefined },
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
    <article className="rounded-2xl border border-lab-borde bg-lab-panel/95 p-6 shadow-[0_24px_40px_-20px_rgba(0,0,0,0.8)] sm:p-8">
      <header className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-lab-tenue">
        <span className="font-mano text-lg normal-case tracking-normal text-lab-portal">
          experimento {String(numero).padStart(2, "0")}
        </span>
        <span>{ETIQUETA_CATEGORIA[proyecto.categoria]}</span>
      </header>

      <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{proyecto.titulo}</h2>

      <p className="mt-3 text-sm text-lab-tenue sm:text-base">{proyecto.resumen}</p>

      <p className="mt-4 border-l-2 border-lab-portal pl-3 text-xs sm:text-sm">
        <span className="font-mano text-lg text-lab-portal">podés </span>
        {proyecto.artefacto}
      </p>

      {(proyecto.probar || proyecto.codigo) && (
        <div className="mt-5 flex flex-wrap gap-3">
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
            <div key={f.etiqueta} className="grid grid-cols-[6rem_1fr] gap-3 py-2 sm:grid-cols-[7rem_1fr]">
              <dt className="font-mono text-xs uppercase text-lab-tenue">{f.etiqueta}</dt>
              <dd>{f.contenido}</dd>
            </div>
          ))}
      </dl>
    </article>
  );
}
