import type { Proyecto } from "../tipos";

export const meta: Proyecto = {
  slug: "argentina-brasil",
  titulo: "Argentina–Brasil",
  categoria: "analisis",
  estado: "publicado",
  autoria: "individual",
  creditos: "Muove · Investigación & Datos",
  resumen:
    "Informe interactivo sobre la dependencia comercial bilateral, con datos del INDEC y la Bolsa de Comercio de Rosario.",
  artefacto: "Elegir un sector (trigo, autos, autopartes, peras…) y ver cuánto pesa Brasil en él.",
  // Stack según el informe publicado. PENDIENTE: confirmar con Fermín.
  stack: ["HTML + Tailwind", "Chart.js", "amCharts 5", "Three.js", "INDEC · BCR"],
  enlaces: [
    {
      etiqueta: "Informe completo",
      url: "https://informe-br-ar.vercel.app/",
    },
  ],
  orden: 2,
};
