// El viaje por portal entre páginas (de la vidriera a un proyecto, de un
// proyecto al siguiente o de vuelta al laboratorio). <Viaje> vive en el layout
// raíz, así sobrevive al cambio de página, y enchufa acá cómo se viaja; el
// resto del sitio solo llama a viajar(href).
//
// La página nueva avisa cuando ya está armada (avisarLlegada, desde
// <Recorrido>) y lo que tiene que animarse recién cuando se ve (la tarjeta de
// la mesa que sale del portal) espera con cuandoSeVea.

let impl: ((href: string) => void) | null = null;
let resolverLlegada: (() => void) | null = null;
let enViaje = false;
let alVerse: (() => void)[] = [];

/** Lleva a otra página pasando por el portal. */
export function viajar(href: string) {
  if (impl) impl(href);
  else window.location.assign(href);
}

/** <Viaje> registra acá cómo se viaja. */
export function conectarViaje(fn: ((href: string) => void) | null) {
  impl = fn;
}

/** Para <Viaje>: una promesa que se cumple cuando la página nueva avisa (o a los 8 s). */
export function esperarLlegada(): Promise<void> {
  enViaje = true;
  return new Promise((resolver) => {
    const plazo = setTimeout(() => resolver(), 8000);
    resolverLlegada = () => {
      clearTimeout(plazo);
      resolverLlegada = null;
      resolver();
    };
  });
}

/** <Recorrido> lo llama cuando la página nueva ya midió todas sus escenas. */
export function avisarLlegada() {
  resolverLlegada?.();
}

/** Para <Viaje>: la página nueva empieza a salir del portal. */
export function empezoLaVuelta() {
  enViaje = false;
  const pendientes = alVerse;
  alVerse = [];
  pendientes.forEach((fn) => fn());
}

/**
 * Corre `fn` cuando la página se ve: enseguida si se entró directo, o cuando
 * empieza a salir del portal si se llegó viajando. Devuelve cómo cancelarlo.
 */
export function cuandoSeVea(fn: () => void): () => void {
  if (!enViaje) {
    const id = setTimeout(fn, 250);
    return () => clearTimeout(id);
  }
  alVerse.push(fn);
  return () => {
    alVerse = alVerse.filter((f) => f !== fn);
  };
}
