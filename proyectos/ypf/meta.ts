import type { Proyecto } from "../tipos";

// Análisis de actividad sísmica en Argentina, hecho en el programa de
// Fundación YPF (repo: fer-gif/proyecto_ypf). Sigue en proceso: falta el
// modelo no supervisado (regiones sísmicas).
// PENDIENTE: que Fermín revise las frases de "qué hice".
export const meta: Proyecto = {
  slug: "ypf",
  titulo: "Sismos en Argentina",
  categoria: "analisis",
  estado: "en-proceso",
  autoria: "equipo",
  rol: "Hice casi todo el análisis y el modelado; lo fuimos armando entre los tres.",
  queHice: [
    "Bajé el catálogo del USGS por API y lo recorté al territorio argentino con capas del IGN.",
    "Hice el análisis exploratorio: calidad de los datos, magnitud, profundidad, las tres zonas sísmicas y el pico de 2021.",
    "Armé la carrera de modelos (regresión lineal, Random Forest y XGBoost contra un modelo de referencia) con validación cruzada temporal.",
  ],
  resultado:
    "Un resultado honesto: en 12 meses de prueba, la regresión lineal (8,6 sismos de error por mes) no le gana al promedio histórico (8,4). Con estos datos no hay una señal aprovechable, y decirlo también vale.",
  creditos: "Programa de Fundación YPF · con Carina Dellasanta y Sergio Mamani",
  resumen:
    "Diez años de sismos del USGS (2016–2026), recortados al territorio argentino con capas del IGN: análisis exploratorio, limpieza y un modelo que estima cuántos sismos habrá en los próximos meses.",
  artefacto:
    "Recorrer el mapa de las tres zonas sísmicas, ver el mes que rompió la escala y preguntarle al modelo cuántos sismos esperar.",
  stack: ["Python", "Pandas", "GeoPandas · Shapely", "Scikit-learn", "XGBoost", "Matplotlib", "USGS · IGN"],
  codigo: "https://github.com/fer-gif/proyecto_ypf",
  enlaces: [{ etiqueta: "Catálogo USGS", url: "https://earthquake.usgs.gov/earthquakes/search/" }],
  orden: 5,
};
