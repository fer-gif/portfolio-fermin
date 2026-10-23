// El catálogo de juguete del sandbox. Todo inventado: productos, talles,
// precios y stock. Los precios van en centavos enteros, como en el módulo real.
export interface Variante {
  id: string;
  nombre: string;
  stock: number;
  /** Precio de venta en centavos. */
  precio: number;
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  sku: string;
  variantes: Variante[];
}

export const CATEGORIAS = ["Calzado", "Indumentaria", "Pelotas", "Protecciones", "Entrenamiento", "Accesorios"];

const pesos = (p: number) => Math.round(p * 100);

function producto(
  id: string,
  nombre: string,
  categoria: string,
  precio: number,
  variantes: [string, number][],
  precios: Record<string, number> = {},
): Producto {
  return {
    id,
    nombre,
    categoria,
    sku: `FS-${id.toUpperCase()}`,
    variantes: variantes.map(([v, stock]) => ({
      id: `${id}-${v.toLowerCase().replace(/\s+/g, "-")}`,
      nombre: v,
      stock,
      precio: pesos(precios[v] ?? precio),
    })),
  };
}

export const CATALOGO: Producto[] = [
  producto("bot-rayo", "Botines Rayo 9 césped sintético", "Calzado", 48900, [["38", 4], ["39", 6], ["40", 9], ["41", 7], ["42", 3], ["43", 2]]),
  producto("bot-garra", "Botines Garra 11 tapones", "Calzado", 72500, [["39", 2], ["40", 5], ["41", 4], ["42", 0], ["43", 1], ["44", 1]]),
  producto("pel-tango", "Pelota Tango Sur Nº5", "Pelotas", 31200, [["Blanca", 14], ["Amarilla", 0]]),
  producto("pel-infantil", "Pelota Nº4 infantil", "Pelotas", 18750, [["Única", 22]]),
  producto("rem-polar", "Remera térmica Polar adulto", "Indumentaria", 15990, [["S", 8], ["M", 15], ["L", 11], ["XL", 6]]),
  producto("short-rayo", "Short de entrenamiento Rayo", "Indumentaria", 12400, [["S", 5], ["M", 12], ["L", 9], ["XL", 4]]),
  producto("medias", "Medias caña alta", "Indumentaria", 4350, [["Azul", 30], ["Blanca", 18], ["Negra", 25], ["Roja", 0]]),
  producto("buzo-arq", "Buzo de arquero acolchado", "Indumentaria", 34900, [["M", 3], ["L", 4], ["XL", 2]]),
  producto("canill", "Canilleras Escudo", "Protecciones", 9900, [["XS", 10], ["S", 7], ["M", 12]]),
  producto("guantes", "Guantes de arquero Garra", "Protecciones", 26800, [["7", 0], ["8", 3], ["9", 5], ["10", 0]]),
  producto("conos", "Conos de entrenamiento x10", "Entrenamiento", 8200, [["Única", 16]]),
  producto("bolso", "Bolso deportivo 50 L", "Accesorios", 22300, [["Negro", 6], ["Azul", 4]]),
  producto("silbato", "Silbato Pro con cordón", "Accesorios", 3150, [["Única", 0]]),
  producto("vincha", "Vincha deportiva", "Accesorios", 2600, [["Negra", 20], ["Blanca", 12]]),
];

export const MOTIVOS = ["Conteo", "Rotura", "Extravío", "Corrección"] as const;
export type Motivo = (typeof MOTIVOS)[number];

export interface Movimiento {
  id: number;
  producto: string;
  variante: string;
  antes: number;
  despues: number;
  motivo: Motivo;
}
