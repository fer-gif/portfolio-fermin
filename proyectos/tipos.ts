export type Categoria =
  | "principal" // el caso más fuerte, ocupa el lugar central del laboratorio
  | "analisis"
  | "software"
  | "corto"
  | "por-definir";

export const ETIQUETA_CATEGORIA: Record<Categoria, string> = {
  principal: "Caso principal",
  analisis: "Caso de análisis",
  software: "Caso de software",
  corto: "Caso corto",
  "por-definir": "Experimento en curso",
};

export type Estado = "publicado" | "en-proceso";

export type Autoria = "individual" | "equipo";

export interface Enlace {
  etiqueta: string;
  url: string;
}

export interface Proyecto {
  slug: string;
  titulo: string;
  categoria: Categoria;
  estado: Estado;
  autoria: Autoria;
  /** Mi rol concreto, sobre todo en proyectos en equipo. */
  rol?: string;
  /** Qué hice yo, en pocas frases concretas (lo que mira un reclutador). */
  queHice?: string[];
  /** Resultado medido o verificable del proyecto, si lo hay. */
  resultado?: string;
  /** Organizaciones o personas que participaron o respaldaron el proyecto. */
  creditos?: string;
  resumen: string;
  /** Qué puede hacer el visitante con el artefacto vivo. */
  artefacto: string;
  stack: string[];
  /** Dónde se usa de verdad el proyecto (botón "probarlo"). */
  probar?: string;
  /** Repositorio con el código (botón "ver el código"). */
  codigo?: string;
  /** Otros enlaces (publicaciones, informes, notas). */
  enlaces: Enlace[];
  /** Posición en el laboratorio (menor = más destacado). */
  orden: number;
}
