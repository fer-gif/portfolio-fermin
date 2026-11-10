import { EscenaLab as Escena } from "@/components/laboratorio/EscenaLab";
import type { Linea } from "@/components/personaje/guion";
import type { Destino } from "@/components/laboratorio/MenuLaboratorio";
import { FichaTecnica } from "@/components/laboratorio/FichaTecnica";
import { Balanza } from "./escenas/Balanza";
import { Dependometro } from "./escenas/Dependometro";
import { PASOS_BALANZA } from "./data/pasos";
import { meta } from "./meta";

// Argentina–Brasil: elegís un sector y ves cuánto pesa Brasil; después,
// veinticuatro años de balanza comercial paso a paso.
// PENDIENTE: revisar el guion con Fermín.

const P = meta.slug;

export const guion: Record<string, Linea> = {
  [`mesa-${P}`]: {
    texto: "¿Cuánto depende Argentina de Brasil? Más de lo que parece. Bajá, que los números hablan solos.",
    pose: "senalando",
  },
  [`${P}-dependometro`]: {
    texto: "Elegí un sector. Trigo, autos, peras: mirá cuánto pesa Brasil en cada uno.",
    pose: "senalando",
  },
  [`${P}-balanza`]: {
    texto: "Veinticuatro años de comercio y solo tres con saldo a favor.",
    pose: "quieto",
    pasos: PASOS_BALANZA.map((p) => ({ texto: p.dice, pose: p.pose })),
  },
  [`${P}-ficha`]: { texto: "La letra chica: INDEC, Bolsa de Comercio de Rosario y el informe completo.", pose: "quieto" },
};

export const dimensiones: NonNullable<Destino["hijos"]> = [
  { escena: `${P}-dependometro`, etiqueta: "1 · Dependómetro" },
  { escena: `${P}-balanza`, etiqueta: "2 · 24 años de balanza" },
  { escena: `${P}-ficha`, etiqueta: "Ficha técnica" },
];

export function Escenas() {
  return (
    <>
      <Escena id={`${P}-dependometro`} duracion={1}>
        <Dependometro />
      </Escena>

      <Escena id={`${P}-balanza`} duracion={1.8}>
        <Balanza />
      </Escena>

      <Escena id={`${P}-ficha`} duracion={0.6}>
        <FichaTecnica
          proyecto={meta}
          filasExtra={[
            {
              etiqueta: "Fuentes",
              contenido:
                "INDEC, Informe Técnico ICA (junio 2026) y estadísticas de comercio exterior por país · Bolsa de Comercio de Rosario, «Comercio entre Argentina y Brasil en 2025» · Infobae · Secretaría de Energía / RIGI",
            },
          ]}
        />
      </Escena>
    </>
  );
}
