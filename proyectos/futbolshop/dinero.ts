// La misma regla que el módulo real (fs-dinero.ts): toda la aritmética de
// dinero en centavos enteros, nunca con flotantes. 19,99 × 3 en JavaScript da
// 59,96999999999999, y ese número termina en una etiqueta impresa.

/** Sube (+) o baja (−) un porcentaje; nunca devuelve negativo. */
export function aplicarPorcentaje(centavos: number, porcentaje: number): number {
  return Math.max(0, Math.round((centavos * (100 + porcentaje)) / 100));
}

export function formatearMoneda(centavos: number): string {
  return `$ ${(centavos / 100).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
