import { BarraProgreso, Escena, Recorrido } from "@/components/recorrido";
import { Personaje } from "@/components/personaje/Personaje";
import type { Guion } from "@/components/personaje/guion";
import { Ambiente } from "@/components/laboratorio/Ambiente";
import { EscenaPortal } from "@/components/laboratorio/EscenaPortal";
import { FichaTecnica } from "@/components/laboratorio/FichaTecnica";
import { MenuLaboratorio } from "@/components/laboratorio/MenuLaboratorio";
import { VolverAlLaboratorio } from "@/components/laboratorio/VolverAlLaboratorio";
import { Calculadora } from "./escenas/Calculadora";
import { Categorias } from "./escenas/Categorias";
import { Junin } from "./escenas/Junin";
import { meta } from "./meta";

// Zona Fría: la calculadora es la protagonista.
// PENDIENTE: revisar el guion con Fermín.
const guion: Guion = {
  inicial: { texto: "Junín, julio, factura de gas. Veamos qué pasa si te sacan la Zona Fría." },
  escenas: {
    portal: { texto: "Abrí el portal. Esto va de clima, tarifas y una ley.", pose: "senalando" },
    junin: {
      texto: "Cruzamos datos climáticos históricos con los cuadros tarifarios. Esto es lo que da para el partido de Junín.",
      pose: "senalando",
    },
    calculadora: {
      texto: "Ahora vos. Contame cómo es tu casa y te digo cuánto más pagarías.",
      pose: "senalando",
    },
    categorias: {
      texto: "Cuanto más consumís, más duele. Pero duele en todas las categorías.",
      pose: "sorprendido",
    },
    ficha: { texto: "La letra chica: fuentes, créditos y la publicación original.", pose: "quieto" },
  },
};

const destinos = [
  { escena: "junin", etiqueta: "1 · Junín en números" },
  { escena: "calculadora", etiqueta: "2 · Calculadora" },
  { escena: "categorias", etiqueta: "3 · Por categoría" },
  { escena: "ficha", etiqueta: "Ficha técnica" },
];

export default function PaginaZonaFria() {
  return (
    <Recorrido>
      <BarraProgreso />
      <Ambiente />
      <VolverAlLaboratorio />
      <MenuLaboratorio destinos={destinos} />
      <Personaje guion={guion} />

      <Escena id="portal" duracion={1.6} solapar={false}>
        <EscenaPortal
          etiqueta="Experimento 04 · caso corto"
          titulo={meta.titulo}
          gancho="¿Cuánto le cuesta a una familia de Junín que le saquen el subsidio al gas? Clima + tarifas + una ley."
        />
      </Escena>

      <Escena id="junin" duracion={1.6}>
        <Junin />
      </Escena>

      <Escena id="calculadora" duracion={1.4}>
        <Calculadora />
      </Escena>

      <Escena id="categorias" duracion={2}>
        <Categorias />
      </Escena>

      <Escena id="ficha" duracion={0.8} cubierta={false}>
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
    </Recorrido>
  );
}
