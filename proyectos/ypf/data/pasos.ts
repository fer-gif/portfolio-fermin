import type { Pose } from "@/components/personaje/guion";
import { MEDIANA_MENSUAL, SISMO_MAYOR, TOTAL_SISMOS, ZONAS } from "./sismos";

// Las tres historias con datos del proyecto, contadas en pasos: qué dice el
// panel y qué dice el científico en cada uno. El gráfico reacciona al índice.
export interface Paso {
  panel: string;
  dice: string;
  pose?: Pose;
}

const n = (v: number) => v.toLocaleString("es-AR");
const fecha = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

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

export const PASOS_AGOSTO: Paso[] = [
  {
    panel: `Sismos por mes, de octubre de 2016 a agosto de 2026. La mediana es ${MEDIANA_MENSUAL} por mes: casi todos los meses están entre 30 y 70.`,
    dice: `Mes a mes, Argentina tiembla unas ${MEDIANA_MENSUAL} veces. Parejo, aburrido, predecible.`,
    pose: "quieto",
  },
  {
    panel: "Agosto de 2021: 600 sismos en un solo mes, trece veces lo normal. La escala del gráfico tuvo que estirarse para que entre.",
    dice: "Y de golpe: seiscientos. En un mes. Tuve que estirar el gráfico para que entre la torre.",
    pose: "sorprendido",
  },
  {
    panel: `El ${fecha(SISMO_MAYOR.fecha)} hubo un sismo de magnitud ${SISMO_MAYOR.magnitud.toLocaleString("es-AR")} en las islas Sandwich del Sur, a ${SISMO_MAYOR.profundidad} km de profundidad. Lo siguieron semanas de réplicas: septiembre todavía tuvo 156.`,
    dice: "Fue un sismo de magnitud 8,1 en las Sandwich. Después, réplicas durante semanas: el suelo tardó meses en calmarse.",
    pose: "quieto",
  },
  {
    panel: `Para entrenar el modelo, ese mes se reemplazó por la mediana (${MEDIANA_MENSUAL}). Si no, el modelo aprende a esperar catástrofes que casi nunca llegan.`,
    dice: `Para el modelo, ese mes lo tapamos con un ${MEDIANA_MENSUAL}. Un valor así de raro no enseña: confunde.`,
    pose: "senalando",
  },
];

export const PASOS_CARRERA: Paso[] = [
  {
    panel: "El modelo de referencia no sabe nada: siempre responde el promedio histórico. Error medio en validación: 16,7 sismos por mes. Cualquier modelo serio tiene que ganarle a este.",
    dice: "Primero, el modelo tonto: siempre dice «el promedio». Si no le ganás a este, andá a tu casa.",
    pose: "quieto",
  },
  {
    panel: "Tres candidatos que miran lo que pasó en los últimos 1, 3 y 6 meses (dos de ellos también la magnitud y la profundidad recientes): regresión lineal, Random Forest y XGBoost. Validación cruzada temporal: cinco tandas de 12 meses.",
    dice: "Los candidatos: regresión lineal, Random Forest y XGBoost. Todos miran los últimos meses para adivinar el siguiente.",
    pose: "senalando",
  },
  {
    panel: "Ganó la más simple: la regresión lineal, con 13,4 sismos de error. Random Forest 14,3 y XGBoost 15,3. Más complejo no fue mejor.",
    dice: "Ganó la más simple. Una regresión lineal, técnica de hace dos siglos. Los árboles y el boosting, atrás.",
    pose: "eureka",
  },
  {
    panel: "La prueba final, 12 meses que el modelo nunca vio: regresión lineal 8,6 de error; modelo tonto 8,4. Empate técnico. Conclusión honesta: con estos datos no hay una señal que un modelo pueda aprovechar.",
    dice: "Pero en la prueba final el tonto empató. Y eso también es un resultado: a veces el azar no se deja modelar.",
    pose: "sorprendido",
  },
];
