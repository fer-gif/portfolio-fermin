// Datos del informe "La dependencia comercial entre Argentina y Brasil"
// (Muove · Investigación & Datos), construido con INDEC (ICA, junio 2026) y
// Bolsa de Comercio de Rosario. Cifras en millones de USD salvo aclaración.

export const INFORME_URL = "https://informe-br-ar.vercel.app/";

/** Primer semestre 2026, comercio Argentina → Brasil (INDEC). */
export const RESUMEN_1S26 = {
  exportaciones: 6254,
  exportacionesVar: 4.0,
  importaciones: 7650,
  importacionesVar: -17.8,
  saldo: -1396,
  saldoVar: -52.6,
  industrialesPct: 64.0,
  comercio2025: 31195,
};

/** La asimetría: tamaño de las economías y qué pasaría si el comercio se congela. */
export const ASIMETRIA = {
  pbiBrasilBillones: 2.2,
  vecesMasGrande: 5,
  congelamiento: {
    brasilComercio: 4,
    argentinaExportaciones: 16,
    argentinaImportacionesClave: 21.5,
  },
};

export interface Categoria {
  codigo: string;
  nombre: string;
  valor: number;
  participacion: number;
  variacion: number;
}

export const EXPORTACIONES_A_BRASIL: Categoria[] = [
  { codigo: "MOI", nombre: "Manufacturas industriales", valor: 4004, participacion: 64.0, variacion: 7.4 },
  { codigo: "MOA", nombre: "Manufacturas agropecuarias", valor: 1007, participacion: 16.1, variacion: 8.4 },
  { codigo: "PP", nombre: "Productos primarios", valor: 891, participacion: 14.2, variacion: -12.3 },
  { codigo: "CyE", nombre: "Combustibles y energía", valor: 353, participacion: 5.6, variacion: 4.2 },
];

export const IMPORTACIONES_DESDE_BRASIL: Categoria[] = [
  { codigo: "BI", nombre: "Bienes intermedios", valor: 2474, participacion: 32.3, variacion: -13.3 },
  { codigo: "VA", nombre: "Vehículos automotores", valor: 1466, participacion: 19.2, variacion: -26.2 },
  { codigo: "PyA", nombre: "Piezas y accesorios", valor: 1346, participacion: 17.6, variacion: -25.9 },
  { codigo: "BK", nombre: "Bienes de capital", valor: 1240, participacion: 16.2, variacion: -27.8 },
  { codigo: "BC", nombre: "Bienes de consumo", valor: 894, participacion: 11.7, variacion: 0.5 },
];

/** Serie anual del comercio bilateral, 2002–2025 (BCR / INDEC). */
export const SERIE_ANUAL = {
  anios: [2002, 2004, 2006, 2008, 2010, 2012, 2014, 2016, 2017, 2019, 2021, 2023, 2024, 2025],
  exportaciones: [4800, 5600, 8100, 13300, 14400, 16400, 13900, 9000, 9300, 10400, 11800, 11874, 13611, 12771],
  importaciones: [2400, 7500, 11700, 17700, 17900, 18000, 14300, 13700, 18000, 10100, 12400, 17346, 14348, 18417],
  saldo: [2400, -1900, -3600, -4400, -3500, -1600, -400, -4700, -8700, 300, -600, -5472, -737, -5646],
};

/** Socios comerciales de Argentina, 1S 2026, participación en %. */
export const SOCIOS = {
  exportaciones: {
    total: 49454,
    variacion: 24.4,
    partes: [
      { nombre: "Brasil", pct: 12.6 },
      { nombre: "China", pct: 9.9 },
      { nombre: "EE.UU.", pct: 9.8 },
      { nombre: "Chile", pct: 6.6 },
      { nombre: "India", pct: 6.3 },
      { nombre: "Resto", pct: 54.7 },
    ],
  },
  importaciones: {
    total: 35531,
    variacion: -3.9,
    partes: [
      { nombre: "China", pct: 22.5 },
      { nombre: "Brasil", pct: 21.5 },
      { nombre: "EE.UU.", pct: 9.2 },
      { nombre: "Paraguay", pct: 6.8 },
      { nombre: "Alemania", pct: 4.3 },
      { nombre: "Resto", pct: 35.7 },
    ],
  },
};

/** Un sector del dependómetro. */
export interface Sector {
  id: string;
  nombre: string;
  icono: string;
  tipo: "agro" | "industria";
  /** Cifra principal, ya formateada. */
  cifra: string;
  cifraDetalle: string;
  /** Cuota: qué parte del mercado brasileño es argentina (si el informe la da). */
  cuota?: { pct: number; texto: string };
  origen?: string;
  destino: string;
}

export const SECTORES: Sector[] = [
  {
    id: "trigo",
    nombre: "Trigo",
    icono: "🌾",
    tipo: "agro",
    cifra: "USD 1.211 M",
    cifraDetalle: "exportado a Brasil en 2025 · 31,2% del agro",
    cuota: { pct: 85, texto: "del trigo que importa Brasil es argentino" },
    origen: "Buenos Aires, Santa Fe, Córdoba, La Pampa",
    destino: "Molinos harineros e industria alimentaria de Brasil",
  },
  {
    id: "autos",
    nombre: "Autos",
    icono: "🚗",
    tipo: "industria",
    cifra: "USD 1.530 M",
    cifraDetalle: "en vehículos exportados a Brasil en el 1S 2026, el primer rubro",
    destino: "Brasil es el único comprador masivo de autos argentinos: sin él, las plantas se paran",
  },
  {
    id: "autopartes",
    nombre: "Autopartes",
    icono: "⚙️",
    tipo: "industria",
    cifra: "USD 1.346 M",
    cifraDetalle: "en piezas y accesorios importados desde Brasil en el 1S 2026 (−25,9%)",
    destino: "17,6% de todo lo que Argentina le compra a Brasil son autopartes",
  },
  {
    id: "leche",
    nombre: "Leche en polvo",
    icono: "🥛",
    tipo: "agro",
    cifra: "USD 245 M",
    cifraDetalle: "exportado en 2025 · 6,3% del agro",
    cuota: { pct: 42, texto: "del mercado brasileño de leche en polvo" },
    origen: "Santa Fe (Rafaela), Córdoba (San Francisco)",
    destino: "Industria láctea y alimentaria del sudeste brasileño",
  },
  {
    id: "papas",
    nombre: "Papas congeladas",
    icono: "🍟",
    tipo: "agro",
    cifra: "USD 235 M",
    cifraDetalle: "exportado en 2025 · 6,0% del agro",
    origen: "Buenos Aires (Balcarce, Batán, Tandil)",
    destino: "Cadenas gastronómicas y distribución de congelados",
  },
  {
    id: "cebada",
    nombre: "Cebada",
    icono: "🍺",
    tipo: "agro",
    cifra: "USD 196 M",
    cifraDetalle: "cebada cervecera exportada en 2025 · 5,0% del agro",
    origen: "Sudoeste de Buenos Aires, La Pampa",
    destino: "Malterías e industria cervecera de Brasil",
  },
  {
    id: "malta",
    nombre: "Malta",
    icono: "🌾",
    tipo: "agro",
    cifra: "USD 181 M",
    cifraDetalle: "malta sin tostar exportada en 2025 · 4,7% del agro",
    cuota: { pct: 50, texto: "o más de la malta procesada que importa Brasil" },
    origen: "Buenos Aires (Tres Arroyos, Puán)",
    destino: "Plantas cerveceras de San Pablo y Paraná",
  },
  {
    id: "peras",
    nombre: "Peras",
    icono: "🍐",
    tipo: "agro",
    cifra: "USD 114 M",
    cifraDetalle: "peras frescas exportadas en 2025 · 2,9% del agro",
    cuota: { pct: 78, texto: "de las peras que consume Brasil vienen del Alto Valle" },
    origen: "Río Negro (Alto Valle), Neuquén",
    destino: "Supermercados y ferias del sudeste de Brasil",
  },
  {
    id: "ajos",
    nombre: "Ajos",
    icono: "🧄",
    tipo: "agro",
    cifra: "USD 110 M",
    cifraDetalle: "ajos frescos exportados en 2025 · 2,8% del agro",
    origen: "Mendoza (Valle de Uco), San Juan",
    destino: "Consumo masivo e industria sazonadora",
  },
];

export const millones = (n: number) =>
  (n < 0 ? "−" : "") + "USD " + Math.abs(n).toLocaleString("es-AR") + " M";
