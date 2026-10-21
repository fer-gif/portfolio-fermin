// Datos del análisis publicado en valeriaarata.com.ar/zona-fria (Agencia Muove).
// Cuadros tarifarios ENARGAS vigentes al momento del análisis, grupo 2 (interior
// de la provincia de Buenos Aires). Impuestos: IVA 21% + tasa provincial 4%
// (Ley 11.769); no se incluyen tasas municipales.

export interface Categoria {
  id: string;
  escala: string;
  /** Consumo anual máximo de la escala, en m³. */
  topeAnual: number;
  cargoFijo: number;
  /** Precio por m³. */
  cargoVariable: number;
  /** Bloque mensual subsidiado en pico invernal, en m³. */
  umbral: number;
  /** Consumo mensual de referencia para el simulador. */
  consumoReferencia: number;
}

export const CATEGORIAS: Categoria[] = [
  { id: "R1", escala: "Hasta 500 m³/año", topeAnual: 500, cargoFijo: 3782.58, cargoVariable: 247.13, umbral: 61, consumoReferencia: 70 },
  { id: "R2-1", escala: "501 a 650 m³/año", topeAnual: 650, cargoFijo: 8068.01, cargoVariable: 247.13, umbral: 69, consumoReferencia: 100 },
  { id: "R2-2", escala: "651 a 800 m³/año", topeAnual: 800, cargoFijo: 10129.01, cargoVariable: 247.13, umbral: 76, consumoReferencia: 125 },
  { id: "R2-3", escala: "801 a 1000 m³/año", topeAnual: 1000, cargoFijo: 11596.46, cargoVariable: 247.13, umbral: 81, consumoReferencia: 155 },
  { id: "R3-1", escala: "1001 a 1250 m³/año", topeAnual: 1250, cargoFijo: 13264.68, cargoVariable: 247.13, umbral: 93, consumoReferencia: 194 },
  { id: "R3-2", escala: "1251 a 1500 m³/año", topeAnual: 1500, cargoFijo: 15199.67, cargoVariable: 247.13, umbral: 101, consumoReferencia: 237 },
  { id: "R3-3", escala: "1501 a 1800 m³/año", topeAnual: 1800, cargoFijo: 17744.12, cargoVariable: 247.13, umbral: 127, consumoReferencia: 280 },
  { id: "R3-4", escala: "1801 a 3000 m³/año", topeAnual: 3000, cargoFijo: 18563.59, cargoVariable: 247.13, umbral: 161, consumoReferencia: 414 },
  { id: "R4", escala: "Más de 3000 m³/año", topeAnual: Infinity, cargoFijo: 25610.02, cargoVariable: 293.31, umbral: 161, consumoReferencia: 600 },
];

/** El consumo mensual de julio se proyecta a anual con este factor. */
export const FACTOR_ANUAL = 5.8;
/** Descuento sobre el precio del gas del bloque subsidiado. */
export const SUBSIDIO_BLOQUE = 0.6136;
/** IVA 21% + tasa provincial 4%. */
export const FACTOR_IMPUESTOS = 1.25;
/** Consumo del hogar testigo de Junín en el pico invernal (m³/mes). */
export const CONSUMO_BASE_JUNIN = 280;

export const DESCUENTOS = [
  { valor: 0.3, etiqueta: "Sin tarifa social (30%)" },
  { valor: 0.5, etiqueta: "Con tarifa social (50%)" },
];

export const FACTORES = {
  vivienda: [
    { valor: 0.8, etiqueta: "Pequeña", detalle: "monoambiente o 1-2 ambientes" },
    { valor: 1, etiqueta: "Mediana", detalle: "3 ambientes o casa estándar" },
    { valor: 1.25, etiqueta: "Grande", detalle: "4 o más ambientes / dos plantas" },
  ],
  calefaccion: [
    { valor: 0.2, etiqueta: "Baja", detalle: "solo cocina y agua caliente" },
    { valor: 1, etiqueta: "Moderada", detalle: "1 o 2 calefactores" },
    { valor: 1.3, etiqueta: "Alta", detalle: "calefacción central o estufas en todo el hogar" },
  ],
  personas: [
    { valor: 0.9, etiqueta: "1 a 2", detalle: "personas" },
    { valor: 1, etiqueta: "3 a 4", detalle: "personas" },
    { valor: 1.15, etiqueta: "5 o más", detalle: "personas" },
  ],
};

/** Cifras del partido de Junín (hogar testigo: R3-3, 280 m³ en julio). */
export const JUNIN = {
  poblacion: 103787,
  personasAfectadas: 65018,
  hogaresConGas: 24535,
  consumoTestigo: 280,
  facturaConZF: 59222,
  facturaSinZF: 84603,
  aumentoHogar: 25381,
  sobrecostoTotal: 622722835,
};

/** Factura de julio por categoría, con y sin Zona Fría (descuento 30%). */
export const FACTURA_POR_CATEGORIA = [
  { id: "R1", con: 8407, sin: 12009 },
  { id: "R2-1", con: 12825, sin: 18321 },
  { id: "R2-2", con: 15213, sin: 21733 },
  { id: "R2-3", con: 16915, sin: 24164 },
  { id: "R3-1", con: 19377, sin: 27682 },
  { id: "R3-2", con: 21739, sin: 31055 },
  { id: "R3-3", con: 26138, sin: 37339 },
  { id: "R3-4", con: 29695, sin: 42422 },
  { id: "R4", con: 38375, sin: 54821 },
];
