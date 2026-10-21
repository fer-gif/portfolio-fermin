import type { Goleador } from "../api";
import { Escudo } from "./Escudo";

export function Goleadores({ goleadores }: { goleadores: Goleador[] }) {
  return (
    <ol className="divide-y divide-lab-borde text-sm">
      {goleadores.map((g) => (
        <li key={`${g.nombre}-${g.equipo}`} className="flex items-center gap-3 py-2">
          <span className="w-5 font-mono text-lab-tenue">{g.posicion}</span>
          <Escudo src={g.logo} club={g.equipo} />
          <span className="flex-1">
            {g.nombre}
            <span className="block text-xs text-lab-tenue">{g.equipo}</span>
          </span>
          <span className="font-mono font-semibold tabular-nums text-lab-portal">{g.goles}</span>
        </li>
      ))}
    </ol>
  );
}
