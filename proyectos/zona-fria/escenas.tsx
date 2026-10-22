import { EscenaLab as Escena } from "@/components/laboratorio/EscenaLab";
import type { Linea } from "@/components/personaje/guion";
import type { Destino } from "@/components/laboratorio/MenuLaboratorio";
import { FichaTecnica } from "@/components/laboratorio/FichaTecnica";
import { Calculadora } from "./escenas/Calculadora";
import { Categorias } from "./escenas/Categorias";
import { Junin } from "./escenas/Junin";
import { meta } from "./meta";

// Zona Fría: la calculadora es la protagonista.
// PENDIENTE: revisar el guion con Fermín.

const P = meta.slug;

export const guion: Record<string, Linea> = {
  [`mesa-${P}`]: {
    texto: "Junín, julio, factura de gas. Veamos qué pasa si te sacan la Zona Fría. Esto va de clima, tarifas y una ley.",
    pose: "senalando",
  },
  [`${P}-junin`]: {
    texto: "Cruzamos datos climáticos históricos con los cuadros tarifarios. Esto es lo que da para el partido de Junín.",
    pose: "senalando",
  },
  [`${P}-calculadora`]: {
    texto: "Ahora vos. Contame cómo es tu casa y te digo cuánto más pagarías.",
    pose: "senalando",
  },
  [`${P}-categorias`]: {
    texto: "Cuanto más consumís, más duele. Pero duele en todas las categorías.",
    pose: "sorprendido",
  },
  [`${P}-ficha`]: { texto: "La letra chica: fuentes, créditos y la publicación original.", pose: "quieto" },
};

export const dimensiones: NonNullable<Destino["hijos"]> = [
  { escena: `${P}-junin`, etiqueta: "1 · Junín en números" },
  { escena: `${P}-calculadora`, etiqueta: "2 · Calculadora" },
  { escena: `${P}-categorias`, etiqueta: "3 · Por categoría" },
  { escena: `${P}-ficha`, etiqueta: "Ficha técnica" },
];

export function Escenas() {
  return (
    <>
      <Escena id={`${P}-junin`} duracion={1.6}>
        <Junin />
      </Escena>

      <Escena id={`${P}-calculadora`} duracion={1.4}>
        <Calculadora />
      </Escena>

      <Escena id={`${P}-categorias`} duracion={2}>
        <Categorias />
      </Escena>

      <Escena id={`${P}-ficha`} duracion={0.8}>
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
