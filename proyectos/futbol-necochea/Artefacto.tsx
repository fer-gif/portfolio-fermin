import { MarcoArtefacto } from "@/components/laboratorio/MarcoArtefacto";
import {
  ENDPOINTS,
  obtenerGoleadores,
  obtenerPosiciones,
  obtenerUltimaFecha,
} from "./api";
import { Goleadores } from "./componentes/Goleadores";
import { TablaPosiciones } from "./componentes/TablaPosiciones";
import { UltimaFecha } from "./componentes/UltimaFecha";

// Dimensión API: los datos reales, en vivo, desde la API centralizada.
// Pendiente: dimensiones Caos, Multiverso y Diarios (widget embebido).
export default async function Artefacto() {
  const [posiciones, ultimaFecha, goleadores] = await Promise.all([
    obtenerPosiciones(),
    obtenerUltimaFecha(),
    obtenerGoleadores(),
  ]);

  if (!posiciones && !ultimaFecha && !goleadores) {
    return (
      <MarcoArtefacto titulo="Dimensión API">
        <p className="text-sm text-lab-tenue">
          La API no respondió. El portal se reabre en unos minutos.
        </p>
      </MarcoArtefacto>
    );
  }

  return (
    <MarcoArtefacto titulo="Dimensión API · datos en vivo">
      {posiciones && (
        <section>
          <h3 className="text-lg font-semibold">{posiciones.ligaNombre}</h3>
          <div className="mt-4 grid gap-8 md:grid-cols-2">
            <TablaPosiciones zona="A" filas={posiciones.zonaA} />
            <TablaPosiciones zona="B" filas={posiciones.zonaB} />
          </div>
        </section>
      )}

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {ultimaFecha && (
          <section>
            <h3 className="mb-4 text-lg font-semibold">Última fecha</h3>
            <UltimaFecha {...ultimaFecha} />
          </section>
        )}
        {goleadores && (
          <section>
            <h3 className="mb-4 text-lg font-semibold">Goleadores</h3>
            <Goleadores goleadores={goleadores.slice(0, 5)} />
          </section>
        )}
      </div>

      {goleadores && (
        <details className="mt-10 rounded-lg border border-lab-borde">
          <summary className="cursor-pointer px-4 py-2 font-mono text-xs text-lab-portal">
            ver respuesta cruda · GET {ENDPOINTS.goleadores}
          </summary>
          <pre className="overflow-x-auto border-t border-lab-borde p-4 font-mono text-xs text-lab-tenue">
            {JSON.stringify({ success: true, goleadores: goleadores.slice(0, 2) }, null, 2)}
          </pre>
        </details>
      )}
    </MarcoArtefacto>
  );
}
