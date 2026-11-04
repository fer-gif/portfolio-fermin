// Registro de tecnologías: qué logo lleva cada una. Los logos son los
// originales de cada marca (Devicon v2.17.0, MIT; GeoPandas de simple-icons),
// guardados en public/logos/ para no depender de otro servidor.
//
// Las que no tienen logo oficial disponible (amCharts, Shapely, PHPUnit…) van
// con un ícono genérico; las fuentes de datos (INDEC, USGS…) con uno de datos.

export type TipoTecnologia = "logo" | "herramienta" | "datos";

export interface Tecnologia {
  /** Lo que se lee en el frasco, tal como está en el stack ("Laravel 12"). */
  etiqueta: string;
  /** Archivo en public/logos/ (sin extensión), si tiene logo. */
  logo?: string;
  tipo: TipoTecnologia;
}

// nombre en minúsculas, sin versión → archivo del logo
const LOGOS: Record<string, string> = {
  laravel: "laravel",
  php: "php",
  vue: "vue",
  "vue.js": "vue",
  typescript: "typescript",
  tailwind: "tailwind",
  "tailwind css": "tailwind",
  vite: "vite",
  mysql: "mysql",
  sql: "mysql",
  playwright: "playwright",
  python: "python",
  pandas: "pandas",
  geopandas: "geopandas",
  matplotlib: "matplotlib",
  javascript: "javascript",
  html: "html",
  css: "css",
  "chart.js": "chartjs",
  vercel: "vercel",
  github: "github",
  git: "git",
  "node.js": "nodejs",
  "node:test": "nodejs",
  "three.js": "threejs",
  json: "json",
  jupyter: "jupyter",
  "scikit-learn": "scikitlearn",
};

// Entradas del stack que son fuentes de datos y no se separan en partes.
const FUENTES = new Set(["INDEC · BCR", "USGS · IGN", "Cuadros ENARGAS"]);

/** "Laravel 12" → "laravel"; "amCharts 5" → "amcharts"; "API REST" → "api rest". */
function clave(nombre: string) {
  return nombre
    .toLowerCase()
    .replace(/\s+v?\d+(\.\d+)*$/, "")
    .trim();
}

export function tecnologia(etiqueta: string): Tecnologia {
  if (FUENTES.has(etiqueta)) return { etiqueta, tipo: "datos" };
  const logo = LOGOS[clave(etiqueta)];
  return logo ? { etiqueta, logo, tipo: "logo" } : { etiqueta, tipo: "herramienta" };
}

/**
 * El stack de un proyecto, frasco por frasco: "Laravel 12 · PHP 8.3" son dos
 * frascos y "HTML + Tailwind" también; las fuentes de datos quedan enteras.
 */
export function frascosDelStack(stack: string[]): Tecnologia[] {
  return stack.flatMap((entrada) =>
    FUENTES.has(entrada) ? [tecnologia(entrada)] : entrada.split(/\s+[·+]\s+/).map(tecnologia),
  );
}
