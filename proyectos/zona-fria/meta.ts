import type { Proyecto } from "../tipos";

export const meta: Proyecto = {
  slug: "zona-fria",
  titulo: "Zona Fría",
  categoria: "corto",
  estado: "publicado",
  autoria: "equipo",
  // Pendiente: definir mi rol dentro del equipo.
  resumen:
    "Cruce de datos climáticos históricos con cuadros tarifarios para calcular el impacto de la quita de Zona Fría en los hogares de Junín.",
  artefacto: "La calculadora de gas.",
  stack: [],
  enlaces: [
    {
      etiqueta: "Publicación original",
      url: "https://valeriaarata.com.ar/zona-fria",
    },
  ],
  orden: 4,
};
