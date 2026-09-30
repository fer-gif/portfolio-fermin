export type Categoria =
  | "principal" // el caso más fuerte, ocupa el lugar central del laboratorio
  | "analisis"
  | "software"
  | "corto"
  | "por-definir";

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
  /** Organizaciones o personas que participaron o respaldaron el proyecto. */
  creditos?: string;
  resumen: string;
  /** Qué puede hacer el visitante con el artefacto vivo. */
  artefacto: string;
  stack: string[];
  enlaces: Enlace[];
  /** Posición en el laboratorio (menor = más destacado). */
  orden: number;
}
