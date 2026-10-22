import type { Proyecto } from "../tipos";

export const meta: Proyecto = {
  slug: "futbol-necochea",
  titulo: "Fútbol de Necochea",
  categoria: "principal",
  estado: "publicado",
  autoria: "individual",
  rol: "Recopilación, limpieza, normalización de datos y diseño de la API",
  // PENDIENTE: que Fermín revise estas frases y sume el resultado medido
  // (por ejemplo: cantidad de partidos cargados, diarios que usan el widget).
  queHice: [
    "Recopilé los resultados que solo existían en fotos, planillas y PDFs.",
    "Limpié y normalicé los nombres de clubes y jugadores (una máquina de normalización).",
    "Diseñé la API centralizada que hoy consumen los diarios con un widget.",
  ],
  creditos: "Data eNe y Muove, con respaldo de VorkNews",
  resumen:
    "No existían datos digitales del fútbol local. Diseñé la recopilación, limpieza y normalización, y armé la primera API centralizada.",
  artefacto:
    "El antes y el después (captura original contra registro normalizado) y el widget real funcionando.",
  // PENDIENTE: stack real.
  stack: [],
  probar: "https://widget-futbol-muove.vercel.app/api/goleadores",
  // PENDIENTE: repo del proyecto, si es público.
  enlaces: [],
  orden: 1,
};
