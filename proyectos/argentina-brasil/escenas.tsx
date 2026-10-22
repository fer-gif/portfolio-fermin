import { EscenaLab as Escena } from "@/components/laboratorio/EscenaLab";
import type { Linea } from "@/components/personaje/guion";
import type { Destino } from "@/components/laboratorio/MenuLaboratorio";
import { FichaTecnica } from "@/components/laboratorio/FichaTecnica";
import { Asimetria } from "./escenas/Asimetria";
import { Balanza } from "./escenas/Balanza";
import { Dependometro } from "./escenas/Dependometro";
import { Socios } from "./escenas/Socios";
import { PASOS_BALANZA } from "./data/pasos";
import { meta } from "./meta";

// Argentina–Brasil: el informe se va armando a medida que bajás.
// PENDIENTE: revisar el guion con Fermín.

const P = meta.slug;

export const guion: Record<string, Linea> = {
  [`mesa-${P}`]: {
    texto: "¿Cuánto depende Argentina de Brasil? Más de lo que parece. Bajá, que los números hablan solos.",
    pose: "senalando",
  },
  [`${P}-asimetria`]: {
    texto: "Brasil es cinco veces Argentina. Si el comercio se congela, a uno le pica y al otro le duele.",
    pose: "sorprendido",
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
  [`${P}-socios`]: {
    texto: "Primer cliente, segundo proveedor. Y es el único que compra lo que fabricamos, no lo que cosechamos.",
    pose: "senalando",
  },
  [`${P}-ficha`]: { texto: "La letra chica: INDEC, Bolsa de Comercio de Rosario y el informe completo.", pose: "quieto" },
};

export const dimensiones: NonNullable<Destino["hijos"]> = [
  { escena: `${P}-asimetria`, etiqueta: "1 · Asimetría" },
  { escena: `${P}-dependometro`, etiqueta: "2 · Dependómetro" },
  { escena: `${P}-balanza`, etiqueta: "3 · 24 años de balanza" },
  { escena: `${P}-socios`, etiqueta: "4 · Socios" },
  { escena: `${P}-ficha`, etiqueta: "Ficha técnica" },
];

export function Escenas() {
  return (
    <>
      <Escena id={`${P}-asimetria`} duracion={2}>
        <Asimetria />
      </Escena>

      <Escena id={`${P}-dependometro`} duracion={1.4}>
        <Dependometro />
      </Escena>

      <Escena id={`${P}-balanza`} duracion={3.2}>
        <Balanza />
      </Escena>

      <Escena id={`${P}-socios`} duracion={1.6}>
        <Socios />
      </Escena>

      <Escena id={`${P}-ficha`} duracion={0.8}>
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
