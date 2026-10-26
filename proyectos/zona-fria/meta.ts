import type { Proyecto } from "../tipos";

export const meta: Proyecto = {
  slug: "zona-fria",
  titulo: "Zona Fría",
  categoria: "corto",
  estado: "publicado",
  autoria: "equipo",
  rol: "Búsqueda y limpieza de datos",
  queHice: [
    "Busqué y limpié los datos climáticos y tarifarios del análisis.",
    "Armé el set de datos que usó mi compañero para publicar el cruce en el sitio.",
  ],
  creditos: "Análisis de Agencia Muove, publicado en el sitio de Valeria Arata",
  resumen:
    "Cruce de datos climáticos históricos con cuadros tarifarios para calcular el impacto de la quita de Zona Fría en los hogares de Junín.",
  artefacto: "Describir tu casa y ver cuánto más pagarías de gas sin Zona Fría.",
  // PENDIENTE: que Fermín confirme el stack (la calculadora publicada corre en JavaScript dentro del sitio).
  stack: ["JavaScript", "HTML · CSS", "Cuadros ENARGAS"],
  probar: "https://valeriaarata.com.ar/zona-fria/",
  enlaces: [],
  orden: 4,
};
