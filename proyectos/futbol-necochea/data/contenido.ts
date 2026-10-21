// Contenido de las dimensiones Caos y Multiverso.
// PENDIENTE: reemplazar por material real de Fermín.
//  - fragmentos: capturas reales de Instagram / WhatsApp
//    (imágenes en public/proyectos/futbol-necochea/)
//  - variantes: las formas reales en que venía escrito cada club

export interface Fragmento {
  tipo: "whatsapp" | "instagram" | "nota";
  texto: string;
}

/** Recreaciones ilustrativas del tipo de dato que había. */
export const fragmentos: Fragmento[] = [
  {
    tipo: "whatsapp",
    texto: "resultados de ayer: VDV 2 mataderos 1, indep. de san cayetano 0 - 0 ministerio, el de rivadavia se suspendió",
  },
  { tipo: "instagram", texto: "📸 foto del pizarrón del club: «Villa D. Velez 3 — Newbery 1»" },
  { tipo: "whatsapp", texto: "alguien sabe cómo salió Huracan?? me dijeron 1 a 1 pero no estoy seguro" },
  { tipo: "nota", texto: "escudo de Defensores de P.Q: no hay. Nombre completo: tampoco." },
];

/** Un club, muchas versiones. Ejemplo: Villa Díaz Vélez. */
export const variantes = ["VDV", "villa diaz", "Villa D. Velez", "V. Díaz Vélez", "VILLA DIAZ VELEZ", "Villa Díaz Velez"];
export const clubFusionado = "Villa Diaz Velez";
