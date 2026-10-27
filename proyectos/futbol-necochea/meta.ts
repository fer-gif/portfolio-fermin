import type { Proyecto } from "../tipos";

export const meta: Proyecto = {
  slug: "futbol-necochea",
  titulo: "Fútbol de Necochea",
  categoria: "principal",
  estado: "publicado",
  autoria: "individual",
  rol: "Recopilación, limpieza, normalización de datos y diseño de la API",
  queHice: [
    "Recopilé los resultados que solo existían en fotos, planillas y PDFs.",
    "Limpié y normalicé los nombres de clubes y jugadores (una máquina de normalización).",
    "Diseñé la API centralizada que hoy consumen los diarios con un widget.",
  ],
  resultado:
    "Más de 30 partidos cargados con goleadores, asistentes y tabla de posiciones dinámica, en el widget creado para Data eNe.",
  creditos: "Data eNe y Muove, con respaldo de VorkNews",
  resumen:
    "No existían datos digitales del fútbol local. Diseñé la recopilación, limpieza y normalización, y armé la primera API centralizada.",
  artefacto:
    "El antes y el después (captura original contra registro normalizado) y el widget real funcionando.",
  // PENDIENTE: que Fermín complete el stack real (lenguaje, base de datos, cómo se cargan los datos).
  stack: ["API REST · Vercel", "JSON", "Widget embebible"],
  probar: "https://widget-futbol-muove.vercel.app/api/goleadores",
  // Repo privado (Data eNe / Muove): no hay link de código público.
  enlaces: [],
  orden: 1,
};
