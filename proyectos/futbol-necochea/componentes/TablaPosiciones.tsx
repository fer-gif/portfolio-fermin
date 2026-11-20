import type { Posicion } from "../api";
import { Escudo } from "./Escudo";

export function TablaPosiciones({
  zona,
  filas,
  clasifican = 0,
}: {
  zona: string;
  filas: Posicion[];
  clasifican?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-lab-tenue">
        Zona {zona}
      </h4>
      <table className="w-full text-sm tabular-nums">
        <thead className="text-left font-mono text-xs text-lab-tenue">
          <tr>
            <th className="w-6 py-1 font-normal">#</th>
            <th className="py-1 font-normal">Club</th>
            <th className="py-1 text-right font-normal">PJ</th>
            <th className="py-1 text-right font-normal">DG</th>
            <th className="py-1 text-right font-normal">Pts</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f, i) => {
            const corte = clasifican > 0 && i + 1 === clasifican && i + 1 < filas.length;
            return (
              <tr
                key={f.equipo}
                className={`border-t border-lab-borde ${corte ? "border-b-2 border-b-lab-portal/50" : ""}`}
              >
                <td className={`py-1.5 ${clasifican > 0 && i < clasifican ? "text-lab-portal" : "text-lab-tenue"}`}>
                  {f.posicion}
                </td>
                <td className="py-1.5">
                  <span className="flex items-center gap-2">
                    <Escudo src={f.logo} club={f.equipo} />
                    {f.equipo}
                  </span>
                </td>
                <td className="py-1.5 text-right">{f.jugados}</td>
                <td className="py-1.5 text-right">
                  {f.diferenciaGol > 0 ? `+${f.diferenciaGol}` : f.diferenciaGol}
                </td>
                <td className="py-1.5 text-right font-semibold text-lab-portal">{f.puntos}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
