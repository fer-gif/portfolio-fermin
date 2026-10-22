// Un guion le dice al personaje qué decir y cómo pararse en cada escena.
// Cada recorrido (home, cada proyecto) tiene el suyo.

export type Pose =
  | "quieto"
  | "senalando"
  | "sorprendido"
  | "eureka"
  | "empujando" // inclinado, con los dos brazos adelante (la intro)
  | "ausente"; // sale de pantalla

export type Lado = "izquierda" | "derecha";

export interface Linea {
  texto: string;
  pose?: Pose;
  lado?: Lado;
  /**
   * Escenas por pasos: una línea por paso, en orden. La escena se divide en
   * tantos tramos iguales como pasos; `texto`/`pose` de arriba son el
   * respaldo si faltara alguno.
   */
  pasos?: { texto: string; pose?: Pose; lado?: Lado }[];
}

export interface Guion {
  /** Qué dice antes de entrar a la primera escena. */
  inicial?: Linea;
  /** Una línea por id de escena. */
  escenas: Record<string, Linea>;
}
