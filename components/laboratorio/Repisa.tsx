"use client";

import { useEffect, useState } from "react";
import { LOGROS, useLogros, useUltimoLogro, type Logro } from "./logros";

// La repisa del visitante: un frasco por experimento, los hechos llenos.
// Cuando se desbloquea uno, un cartel lo cuenta un momento.
export function Repisa() {
  const logros = useLogros();
  const ultimo = useUltimoLogro();
  // El cartel se ve mientras el último desbloqueo no haya "vencido".
  const [vencido, setVencido] = useState<number | null>(null);
  const aviso: Logro | null = ultimo && ultimo.momento !== vencido ? ultimo.logro : null;

  useEffect(() => {
    if (!ultimo) return;
    const id = setTimeout(() => setVencido(ultimo.momento), 4200);
    return () => clearTimeout(id);
  }, [ultimo]);

  return (
    // En celular el aviso va debajo del contador (al lado taparía el título).
    <div className="aparece-tras-intro pointer-events-none fixed top-16 right-4 z-50 flex flex-col-reverse items-end gap-2 sm:flex-row sm:items-start sm:justify-end">
      {aviso && (
        <div
          role="status"
          className="repisa-aviso max-w-[70vw] rounded-xl border border-lab-portal/60 bg-lab-panel/95 px-3 py-2 text-right backdrop-blur sm:max-w-xs"
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-lab-portal">experimento desbloqueado</p>
          <p className="font-mano text-lg leading-tight text-lab-texto">{aviso.nombre}</p>
        </div>
      )}
      <div
        title={`${logros.length} de ${LOGROS.length} experimentos desbloqueados`}
        className="flex items-end gap-1.5 rounded-full border border-lab-borde bg-lab-panel/90 px-3 py-1.5 backdrop-blur"
      >
        <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden className="text-lab-portal">
          <rect x="3" y="0.5" width="6" height="2" rx="0.5" fill="currentColor" />
          <path d="M3.5 3h5v3.5l2 3.5v2.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V10l2-3.5z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M2.2 10.5h7.6V12.2a.3.3 0 0 1-.3.3H2.5a.3.3 0 0 1-.3-.3z" fill="currentColor" opacity="0.7" />
        </svg>
        <span className="font-mono text-xs tabular-nums text-lab-tenue">
          <span className="text-lab-texto">{logros.length}</span>/{LOGROS.length}
        </span>
        <ul className="ml-1 hidden items-end gap-0.5 sm:flex" aria-hidden>
          {LOGROS.map((l) => {
            const hecho = logros.includes(l.id);
            return (
              <li
                key={l.id}
                className={`h-3 w-1.5 rounded-sm border transition-colors duration-500 ${
                  hecho ? "border-lab-portal bg-lab-portal" : "border-lab-borde bg-transparent"
                }`}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
