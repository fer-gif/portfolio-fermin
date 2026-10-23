import { COEFICIENTES, HISTORIAL } from "./data/sismos";

// La regresión lineal del notebook 03, corriendo en el navegador.
// Predictores: sismos del mes anterior, de los últimos 3 y de los últimos 6.
// Como en el notebook, cada mes estimado se suma al historial para estimar
// el siguiente (retroalimentación recursiva).
export function proyectar(meses: number): number[] {
  const [b0, bAnterior, bTres, bSeis] = COEFICIENTES;
  const historial = [...HISTORIAL];
  const salida: number[] = [];
  const suma = (n: number) => historial.slice(-n).reduce((a, b) => a + b, 0);
  for (let i = 0; i < meses; i++) {
    const estimado = b0 + bAnterior * historial[historial.length - 1] + bTres * suma(3) + bSeis * suma(6);
    salida.push(estimado);
    historial.push(estimado);
  }
  return salida;
}
