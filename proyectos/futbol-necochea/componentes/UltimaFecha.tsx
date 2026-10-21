import type { Partido } from "../api";
import { Escudo } from "./Escudo";

export function UltimaFecha({ jornada, partidos }: { jornada: string; partidos: Partido[] }) {
  return (
    <div>
      <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-lab-tenue">
        {jornada}
      </h4>
      <ul className="divide-y divide-lab-borde text-sm">
        {partidos.map((p) => (
          <li key={p.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2">
            <span className="flex items-center justify-end gap-2 text-right">
              {p.equipo_local.nombre}
              <Escudo src={p.equipo_local.logo} club={p.equipo_local.nombre} />
            </span>
            <span className="min-w-14 text-center font-mono tabular-nums">
              {p.estado_partido === "finalizado" ? (
                `${p.goles_local} - ${p.goles_visitante}`
              ) : (
                <span className="text-xs text-lab-tenue">{p.estado_partido}</span>
              )}
            </span>
            <span className="flex items-center gap-2">
              <Escudo src={p.equipo_visitante.logo} club={p.equipo_visitante.nombre} />
              {p.equipo_visitante.nombre}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
