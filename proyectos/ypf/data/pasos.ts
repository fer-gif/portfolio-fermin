import type { Pose } from "@/components/personaje/guion";
import { TOTAL_SISMOS, ZONAS } from "./sismos";

// El mapa de sismos contado en pasos: qué dice el
// panel y qué dice el científico en cada uno. El gráfico reacciona al índice.
export interface Paso {
  panel: string;
  dice: string;
  pose?: Pose;
}

const n = (v: number) => v.toLocaleString("es-AR");

export const PASOS_MAPA: Paso[] = [
  {
    panel: `${n(TOTAL_SISMOS)} sismos en diez años; cada punto es uno. Es el catálogo del USGS recortado al territorio argentino: provincias, plataforma continental y sector antártico, con capas del IGN.`,
    dice: "Diez años de temblores, un punto por sismo. Mirá dónde se amontonan: no es azar, son los bordes de las placas.",
    pose: "senalando",
  },
  {
    panel: `${ZONAS[0].nombre}: ${n(ZONAS[0].sismos)} sismos. ${ZONAS[0].dice} Profundidad típica: ${ZONAS[0].profundidad} km.`,
    dice: "La cordillera. Nazca se mete abajo de Sudamérica y el continente cruje. Cuanto más al este, más profundo.",
    pose: "senalando",
  },
  {
    panel: `${ZONAS[1].nombre}: ${n(ZONAS[1].sismos)} sismos. ${ZONAS[1].dice} Profundidad típica: ${ZONAS[1].profundidad} km.`,
    dice: "Al sur, el arco de Scotia: las placas se rozan de costado. Pocos sismos y bien superficiales.",
    pose: "quieto",
  },
  {
    panel: `${ZONAS[2].nombre}: ${n(ZONAS[2].sismos)} sismos, la mitad del total. ${ZONAS[2].dice} Magnitud máxima: ${ZONAS[2].magMax.toLocaleString("es-AR")}.`,
    dice: "Y las Sandwich del Sur: unas islas chiquitas con la mitad de todos los sismos. Ahí pasó lo de 2021.",
    pose: "sorprendido",
  },
];
