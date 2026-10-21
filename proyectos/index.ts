import type { Proyecto } from "./tipos";
import { meta as futbolNecochea } from "./futbol-necochea/meta";
import { meta as argentinaBrasil } from "./argentina-brasil/meta";
import { meta as futbolshop } from "./futbolshop/meta";
import { meta as zonaFria } from "./zona-fria/meta";
import { meta as ypf } from "./ypf/meta";

// Registro central: para sumar un proyecto, crear su carpeta con meta.ts
// y agregarlo acá. El orden de las mesas sale de `orden`.
export const proyectos: Proyecto[] = [
  futbolNecochea,
  argentinaBrasil,
  futbolshop,
  zonaFria,
  ypf,
].sort((a, b) => a.orden - b.orden);

export function obtenerProyecto(slug: string): Proyecto | undefined {
  return proyectos.find((p) => p.slug === slug);
}

export type { Proyecto } from "./tipos";
export { ETIQUETA_CATEGORIA } from "./tipos";
