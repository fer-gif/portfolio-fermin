import type { Pose } from "@/components/personaje/guion";

// La balanza de 24 años contada en pasos: qué dice el panel y qué dice el
// científico en cada uno. El gráfico reacciona al índice del paso.
export interface Paso {
  panel: string;
  dice: string;
  pose?: Pose;
}

export const PASOS_BALANZA: Paso[] = [
  {
    panel: "2002: el último superávit grande, +2.400 millones. Argentina salía de la convertibilidad y compraba poco.",
    dice: "Arranquemos por el único año verde que vale la pena: 2002. Después de eso, agarrate.",
    pose: "senalando",
  },
  {
    panel: "Después, veinte años en rojo. Brasil nos vende más de lo que nos compra casi siempre: el saldo es negativo en 21 de 24 años.",
    dice: "Veinte años en rojo. Cuando el vecino te vende autos y vos le vendés trigo, la balanza se inclina sola.",
    pose: "quieto",
  },
  {
    panel: "2017, el agujero: −8.700 millones. Argentina importó 900.000 autos ese año, la mayoría brasileños.",
    dice: "Y acá está el agujero: 2017. Novecientos mil autos importados. Se nota, ¿no?",
    pose: "sorprendido",
  },
  {
    panel: "2025: −5.646 millones, el déficit más alto en 13 años. En el primer semestre de 2026 cayó a la mitad, pero por caída de importaciones, no por suba de ventas.",
    dice: "2025, el peor en trece años. Y ojo: que en 2026 baje no es buena noticia, es que compramos menos.",
    pose: "senalando",
  },
];
