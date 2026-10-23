import type { Proyecto } from "../tipos";

// Análisis de actividad sísmica en Argentina (repo: fer-gif/proyecto_ypf).
// Sigue en proceso: falta el modelo no supervisado (regiones sísmicas).
// PENDIENTE: qué es "YPF" acá (¿programa de Fundación YPF?), mi rol en el
// equipo (queHice) y confirmar los integrantes.
export const meta: Proyecto = {
  slug: "ypf",
  titulo: "Sismos en Argentina",
  categoria: "analisis",
  estado: "en-proceso",
  autoria: "equipo",
  creditos: "Proyecto YPF · con Carina Dellasanta",
  resumen:
    "Diez años de sismos del USGS (2016–2026), recortados al territorio argentino con capas del IGN: análisis exploratorio, limpieza y un modelo que estima cuántos sismos habrá en los próximos meses.",
  artefacto:
    "Elegir cuántos meses adelante querés mirar y ver la estimación; recorrer el mapa de las tres zonas sísmicas del país.",
  stack: ["Python", "Pandas", "GeoPandas · Shapely", "Scikit-learn", "XGBoost", "Matplotlib", "USGS · IGN"],
  codigo: "https://github.com/fer-gif/proyecto_ypf",
  enlaces: [{ etiqueta: "Catálogo USGS", url: "https://earthquake.usgs.gov/earthquakes/search/" }],
  orden: 5,
};
