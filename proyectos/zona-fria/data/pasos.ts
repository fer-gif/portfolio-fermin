import type { Pose } from "@/components/personaje/guion";

// Las nueve categorías contadas en pasos: qué dice el panel y qué dice el
// científico en cada uno. El gráfico reacciona al índice del paso.
export interface Paso {
  panel: string;
  dice: string;
  pose?: Pose;
}

export const PASOS_CATEGORIAS: Paso[] = [
  {
    panel: "R1 es la familia que menos gas consume: hasta 500 m³ por año. Con Zona Fría paga $8.407 en julio.",
    dice: "Empecemos por la familia más chica, la R1. Ocho mil cuatrocientos pesos en julio. Guardá ese número.",
    pose: "senalando",
  },
  {
    panel: "Hay nueve categorías, de R1 a R4 (más de 3.000 m³ por año). Con el descuento, la factura de julio va de $8.407 a $38.375.",
    dice: "Nueve categorías. Cuanto más grande la casa, más alta la barra. Hasta acá, lógico.",
    pose: "quieto",
  },
  {
    panel: "Sin Zona Fría, la misma familia R1 pasa a pagar $12.009: $3.603 más por mes.",
    dice: "Ahora le sacamos el descuento a la familia chica. Tres mil seiscientos pesos más. Y recién empezamos.",
    pose: "sorprendido",
  },
  {
    panel: "A todas las categorías les sube lo mismo en proporción: +43 %, porque la quita es un porcentaje. Un hogar R4 paga $16.446 más por mes.",
    dice: "Y a todos les pega igual: 43 por ciento más, seas R1 o R4. Lo que cambia es cuánto duele en plata.",
    pose: "eureka",
  },
];
