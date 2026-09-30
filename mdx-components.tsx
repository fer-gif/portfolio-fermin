import type { MDXComponents } from "mdx/types";

// Componentes disponibles globalmente en todos los caso.mdx
// (ej: comparadores antes/después, citas, métricas).
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
