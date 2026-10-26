import type { Proyecto } from "../tipos";

// Análisis de actividad sísmica en Argentina, hecho en el programa de
// Fundación YPF (repo: fer-gif/proyecto_ypf). Sigue en proceso: falta el
// modelo no supervisado (regiones sísmicas).
export const meta: Proyecto = {
  slug: "ypf",
  titulo: "Sismos en Argentina",
  categoria: "analisis",
  estado: "en-proceso",
  autoria: "equipo",
  rol: "Limpieza de datos y análisis exploratorio",
  queHice: [
    "Bajamos entre el equipo el catálogo del USGS por API y lo recortamos al territorio argentino con capas del IGN.",
    "Limpié los datos sísmicos del catálogo.",
    "Hice el análisis exploratorio: calidad de los datos, magnitud, profundidad, las tres zonas sísmicas y el pico de 2021.",
  ],
  resultado:
    "El análisis exploratorio identificó las tres zonas sísmicas del país y un pico de actividad en 2021.",
  creditos: "Programa de Fundación YPF · con Carina Dellasanta y Sergio Mamani",
  resumen:
    "Diez años de sismos del USGS (2016–2026), recortados al territorio argentino con capas del IGN: análisis exploratorio, limpieza y un modelo que estima cuántos sismos habrá en los próximos meses.",
  artefacto:
    "Recorrer el mapa de las tres zonas sísmicas, ver el mes que rompió la escala y preguntarle al modelo cuántos sismos esperar.",
  stack: ["Python", "Pandas", "GeoPandas · Shapely", "Matplotlib", "USGS · IGN"],
  codigo: "https://github.com/fer-gif/proyecto_ypf",
  enlaces: [{ etiqueta: "Catálogo USGS", url: "https://earthquake.usgs.gov/earthquakes/search/" }],
  orden: 5,
};
