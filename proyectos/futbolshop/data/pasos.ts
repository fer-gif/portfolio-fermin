import type { Pose } from "@/components/personaje/guion";

// Los tres bugs de FutbolShop contados en pasos: qué dice el panel y qué dice
// el científico en cada uno.
export interface Paso {
  panel: string;
  dice: string;
  pose?: Pose;
}

export const PASOS_HALLAZGOS: Paso[] = [
  {
    panel: "Bug 1 · Arrastrabas las categorías, el sistema decía «guardado»… y ninguna pantalla leía ese orden. Venía de antes y nadie lo había notado.",
    dice: "Decía «guardado» y era mentira: el orden se guardaba en un cajón que nadie abría.",
    pose: "sorprendido",
  },
  {
    panel: "Bug 2 · El orden de los productos se guardaba en un tinyint, que llega hasta 127. La categoría Pelotas tiene 168 productos: su orden nunca pudo guardarse.",
    dice: "Ciento veintisiete es el tope de un tinyint. Pelotas tiene ciento sesenta y ocho. Se descubrió contando pelotas, literalmente.",
    pose: "senalando",
  },
  {
    panel: "Bug 3 · El pop-up de reordenar abría vacío: las categorías tienen parent_id = 0 y la consulta pedía IS NULL. Otra pantalla, para lo mismo, preguntaba null OR 0.",
    dice: "Cero no es nulo. Una pantalla lo sabía y la otra lo olvidaba.",
    pose: "quieto",
  },
  {
    panel: "Los tres salieron de abrir la pantalla y usarla con datos reales. Ninguna prueba automática los habría visto: todas verificaban que el código hiciera lo que decía, y el problema era que lo que decía no servía.",
    dice: "Ninguna de las cuatro mil pruebas los vio. Probar a mano también es método, y queda escrito en la bitácora.",
    pose: "eureka",
  },
];
