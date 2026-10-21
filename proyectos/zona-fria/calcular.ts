import {
  CATEGORIAS,
  CONSUMO_BASE_JUNIN,
  FACTOR_ANUAL,
  FACTOR_IMPUESTOS,
  SUBSIDIO_BLOQUE,
  type Categoria,
} from "./data/tarifas";

export interface Resultado {
  consumo: number;
  categoria: Categoria;
  conZonaFria: number;
  sinZonaFria: number;
  diferencia: number;
  /** Desvío del consumo respecto del hogar testigo de Junín, en %. */
  desvio: number;
}

/** Consumo mensual estimado a partir de cómo es el hogar. */
export function estimarConsumo(vivienda: number, calefaccion: number, personas: number): number {
  return Math.round(CONSUMO_BASE_JUNIN * vivienda * calefaccion * personas * 10) / 10;
}

export function categoriaPorConsumo(consumoMensual: number): Categoria {
  const anual = consumoMensual * FACTOR_ANUAL;
  return CATEGORIAS.find((c) => anual <= c.topeAnual) ?? CATEGORIAS[CATEGORIAS.length - 1];
}

/**
 * La factura de julio, con y sin Zona Fría.
 * El bloque subsidiado paga el gas con descuento; el excedente, precio pleno.
 * Zona Fría descuenta sobre el total antes de impuestos.
 */
export function calcular(consumo: number, descuento: number): Resultado {
  const categoria = categoriaPorConsumo(consumo);
  const bloque = Math.min(consumo, categoria.umbral);
  const excedente = Math.max(0, consumo - categoria.umbral);
  const variable =
    bloque * categoria.cargoVariable * (1 - SUBSIDIO_BLOQUE) + excedente * categoria.cargoVariable;
  const base = (categoria.cargoFijo + variable) * FACTOR_IMPUESTOS;

  const sinZonaFria = Math.round(base);
  const conZonaFria = Math.round(base * (1 - descuento));
  return {
    consumo,
    categoria,
    conZonaFria,
    sinZonaFria,
    diferencia: sinZonaFria - conZonaFria,
    desvio: Math.round(((consumo - CONSUMO_BASE_JUNIN) / CONSUMO_BASE_JUNIN) * 100),
  };
}

export const pesos = (n: number) => "$" + Math.round(n).toLocaleString("es-AR");
