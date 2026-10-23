// Un guion le dice al personaje qué decir y cómo pararse en cada escena.
// Cada recorrido (home, cada proyecto) tiene el suyo.

export type Pose =
  | "quieto"
  | "senalando"
  | "sorprendido"
  | "eureka"
  | "empujando" // inclinado, con los dos brazos adelante (la intro)
  | "caminando" // el ciclo de caminata; la pone el personaje solo cuando se mueve
  | "ausente"; // sale de pantalla

export type Lado = "izquierda" | "derecha";

export interface Linea {
  texto: string;
  pose?: Pose;
  /** Atajo: "derecha" equivale a posicion 1. */
  lado?: Lado;
  /**
   * Dónde se para, de 0 (borde izquierdo) a 1 (borde derecho). Si cambia de
   * una escena a otra, el personaje camina hasta ahí antes de hablar.
   */
  posicion?: number;
  /**
   * Escenas por pasos: una línea por paso, en orden. La escena se divide en
   * tantos tramos iguales como pasos; `texto`/`pose` de arriba son el
   * respaldo si faltara alguno.
   */
  pasos?: { texto: string; pose?: Pose; lado?: Lado; posicion?: number }[];
}

export interface Guion {
  /** Qué dice antes de entrar a la primera escena. */
  inicial?: Linea;
  /** Una línea por id de escena. */
  escenas: Record<string, Linea>;
}
