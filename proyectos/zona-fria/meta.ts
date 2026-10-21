import type { Proyecto } from "../tipos";

export const meta: Proyecto = {
  slug: "zona-fria",
  titulo: "Zona Fría",
  categoria: "corto",
  estado: "publicado",
  autoria: "equipo",
  // PENDIENTE: definir mi rol dentro del equipo.
  creditos: "Análisis de Agencia Muove, publicado en el sitio de Valeria Arata",
  resumen:
    "Cruce de datos climáticos históricos con cuadros tarifarios para calcular el impacto de la quita de Zona Fría en los hogares de Junín.",
  artefacto: "Describir tu casa y ver cuánto más pagarías de gas sin Zona Fría.",
  // PENDIENTE: stack real.
  stack: [],
  enlaces: [
    {
      etiqueta: "Publicación original",
      url: "https://valeriaarata.com.ar/zona-fria/",
    },
  ],
  orden: 4,
};
