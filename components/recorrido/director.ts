"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

// El Director es la única fuente de verdad del recorrido: en qué escena está
// el visitante y qué porcentaje de esa escena lleva. El personaje, los textos
// y las animaciones leen de acá.

export interface EstadoRecorrido {
  escena: string | null;
  progreso: number; // 0..1 dentro de la escena actual
}

type Oyente = () => void;

export function crearDirector() {
  let estado: EstadoRecorrido = { escena: null, progreso: 0 };
  const oyentes = new Set<Oyente>();
  let navegar: (escena: string) => void = () => {};

  return {
    /** Lleva al visitante al inicio de una escena. */
    irA: (escena: string) => navegar(escena),
    /** <Recorrido> enchufa acá el scroll suave una vez que existe. */
    conectarNavegacion(fn: typeof navegar) {
      navegar = fn;
    },
    obtener: () => estado,
    fijar(parcial: Partial<EstadoRecorrido>) {
      estado = { ...estado, ...parcial };
      oyentes.forEach((fn) => fn());
    },
    suscribir(fn: Oyente) {
      oyentes.add(fn);
      return () => {
        oyentes.delete(fn);
      };
    },
  };
}

export type Director = ReturnType<typeof crearDirector>;

export const DirectorContext = createContext<Director | null>(null);

export function useDirector(): Director {
  const director = useContext(DirectorContext);
  if (!director) {
    throw new Error("useDirector tiene que usarse dentro de <Recorrido>");
  }
  return director;
}

/** Nombre de la escena actual. Re-renderiza solo cuando cambia de escena. */
export function useEscenaActual(): string | null {
  const director = useDirector();
  return useSyncExternalStore(
    director.suscribir,
    () => director.obtener().escena,
    () => null,
  );
}

/**
 * Progreso de la escena actual a alta frecuencia (cada frame de scroll).
 * No re-renderiza: el callback toca el DOM directamente.
 */
export function useProgreso(
  callback: (progreso: number, escena: string | null) => void,
) {
  const director = useDirector();
  useEffect(
    () =>
      director.suscribir(() => {
        const { progreso, escena } = director.obtener();
        callback(progreso, escena);
      }),
    [director, callback],
  );
}
