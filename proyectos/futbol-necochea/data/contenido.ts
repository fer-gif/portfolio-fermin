// Material real de Fútbol de Necochea: capturas de cómo se publicaba en los
// diarios antes del widget vs. el widget actual en producción en Data eNe, y
// variantes reales de nombres de clubes que aparecen en esas mismas notas.

export interface Captura {
  id: string;
  etiqueta: string;
  src: string;
  ancho: number;
  alto: number;
  alt: string;
  nota: string;
}

export const CAPTURAS_ANTES: Captura[] = [
  {
    id: "antes-resultados",
    etiqueta: "Resultados en lista",
    src: "/proyectos/futbol-necochea/antes-resultados.png",
    ancho: 669,
    alto: 260,
    alt: "Captura real de una nota anterior: resultados de la Fecha 4 escritos como lista con viñetas en texto plano",
    nota: "Texto plano con viñetas: sin escudos, sin fecha/hora y con abreviaturas distintas según quién escribía la nota (ej. Independiente (SC)).",
  },
  {
    id: "antes-posiciones",
    etiqueta: "Tabla solo con puntos",
    src: "/proyectos/futbol-necochea/antes-posiciones.png",
    ancho: 571,
    alto: 605,
    alt: "Captura real de la tabla de posiciones armada a mano como lista numerada con puntos y resultados de Zona B",
    nota: "Lista numerada a mano: solo puntos, sin partidos jugados ni diferencia de gol. Y los clubes aparecían como Defensores (PQ) o Defensores (JNF).",
  },
  {
    id: "antes-nota",
    etiqueta: "Partidos en un párrafo",
    src: "/proyectos/futbol-necochea/antes-nota.png",
    ancho: 956,
    alto: 398,
    alt: "Captura real de una nota sobre la fecha 12 donde los cruces están redactados dentro de un párrafo de texto",
    nota: "Cruces enterrados en el cuerpo de una nota. El mismo club que en otra nota era Defensores (PQ), acá figura como Defensores de Puerto Quequén.",
  },
];

export const CAPTURAS_DESPUES: Captura[] = [
  {
    id: "despues-partidos",
    etiqueta: "Widget · Partidos",
    src: "/proyectos/futbol-necochea/despues-partidos.png",
    ancho: 1024,
    alto: 277,
    alt: "Captura real del widget embebible en producción mostrando la pestaña Partidos con tarjetas, escudos, fechas y acceso al Prode",
    nota: "Web Component <futbol-widget> con Shadow DOM en producción: carrusel con escudos, fecha, estado en vivo y acceso directo al Prode.",
  },
  {
    id: "despues-posiciones",
    etiqueta: "Widget · Posiciones",
    src: "/proyectos/futbol-necochea/despues-posiciones.png",
    ancho: 1024,
    alto: 252,
    alt: "Captura real del widget embebible mostrando la tabla de posiciones completa con escudos, PJ, G, E, P, DG y PTS",
    nota: "Tabla calculada automáticamente desde PostgreSQL con cada partido finalizado: PJ, G, E, P, diferencia de gol y puntos al instante.",
  },
];

/** Un club, muchas versiones reales. Ejemplo: Villa Díaz Vélez. */
export const variantes = [
  "VDV",
  "Villa Díaz Vélez",
  "V. DÍAZ VÉLEZ",
  "Villa Diaz Velez",
  "villa diaz",
  "V. Diaz Velez",
];
export const clubFusionado = "Villa Diaz Velez";

/** Ejemplos reales sacados de las notas anteriores para probar la máquina en un clic. */
export const EJEMPLOS_REALES = [
  "Defensores (PQ)",
  "Defensores de Puerto Quequén",
  "Independiente (SC)",
  "Defensores (JNF)",
  "Sp. San Cayetano",
  "Jorge Newbery",
];
