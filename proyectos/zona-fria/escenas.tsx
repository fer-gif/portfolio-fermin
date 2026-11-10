import { EscenaLab as Escena } from "@/components/laboratorio/EscenaLab";
import type { Linea } from "@/components/personaje/guion";
import type { Destino } from "@/components/laboratorio/MenuLaboratorio";
import { FichaTecnica } from "@/components/laboratorio/FichaTecnica";
import { Calculadora } from "./escenas/Calculadora";
import { Categorias } from "./escenas/Categorias";
import { PASOS_CATEGORIAS } from "./data/pasos";
import { meta } from "./meta";

// Zona Fría: la calculadora es la protagonista (con las cifras de Junín
// arriba) y después, cuánto duele por categoría.
// PENDIENTE: revisar el guion con Fermín.

const P = meta.slug;

export const guion: Record<string, Linea> = {
  [`mesa-${P}`]: {
    texto: "Junín, julio, factura de gas. Veamos qué pasa si te sacan la Zona Fría. Esto va de clima, tarifas y una ley.",
    pose: "senalando",
  },
  [`${P}-calculadora`]: {
    texto: "Cruzamos el clima de Junín con los cuadros tarifarios. Arriba, lo que da para todo el partido; abajo, tu casa: contame cómo es y te digo cuánto más pagarías.",
    pose: "senalando",
  },
  [`${P}-categorias`]: {
    texto: "Cuanto más consumís, más duele. Pero duele en todas las categorías.",
    pose: "sorprendido",
    pasos: PASOS_CATEGORIAS.map((p) => ({ texto: p.dice, pose: p.pose })),
  },
  [`${P}-ficha`]: { texto: "La letra chica: fuentes, créditos y la publicación original.", pose: "quieto" },
};

export const dimensiones: NonNullable<Destino["hijos"]> = [
  { escena: `${P}-calculadora`, etiqueta: "1 · Calculadora" },
  { escena: `${P}-categorias`, etiqueta: "2 · Por categoría" },
  { escena: `${P}-ficha`, etiqueta: "Ficha técnica" },
];

export function Escenas() {
  return (
    <>
      <Escena id={`${P}-calculadora`} duracion={1.2}>
        <Calculadora />
      </Escena>

      <Escena id={`${P}-categorias`} duracion={1.8}>
        <Categorias />
      </Escena>

      <Escena id={`${P}-ficha`} duracion={0.6}>
        <FichaTecnica
          proyecto={meta}
          filasExtra={[
            {
              etiqueta: "Fuentes",
              contenido:
                "Cuadros tarifarios ENARGAS · coeficientes climáticos de la Encuesta de Consumos Energéticos Residenciales (Secretaría de Energía PBA) · Ley 27.637 · Ley 11.769",
            },
          ]}
        />
      </Escena>
    </>
  );
}
