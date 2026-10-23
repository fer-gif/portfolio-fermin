"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

// El Director es la única fuente de verdad del recorrido: en qué escena está
// el visitante, qué porcentaje de esa escena lleva, y si el personaje tiene
// algo para decir fuera del guion (porque el visitante tocó algo).
// El personaje, los textos y las animaciones leen de acá.

export interface Dicho {
  id: number;
  texto: string;
  pose?: string;
}

export interface EstadoRecorrido {
  escena: string | null;
  progreso: number; // 0..1 dentro de la escena actual, espera final incluida
  progresoAnimacion: number; // 0..1 de la parte animada (sin la espera de cobertura)
  /** Lo que el personaje dice ahora por fuera del guion, si hay algo. */
  dicho: Dicho | null;
}

type Oyente = () => void;

export function crearDirector() {
  let estado: EstadoRecorrido = { escena: null, progreso: 0, progresoAnimacion: 0, dicho: null };
  const oyentes = new Set<Oyente>();
  let navegar: (escena: string) => void = () => {};
  let pausar: (pausado: boolean) => void = () => {};
  // Los hijos (la intro) pueden pedir la pausa antes de que exista el scroll
  // suave: se recuerda y se aplica al conectar.
  let pausado = false;
  let contadorDicho = 0;
  let temporizadorDicho: ReturnType<typeof setTimeout> | null = null;
  // Mientras dura un salto del menú, el scroll es rápido a propósito.
  let saltandoHasta = 0;

  const emitir = () => oyentes.forEach((fn) => fn());

  return {
    /** Lleva al visitante al inicio de una escena. */
    irA(escena: string) {
      saltandoHasta = Date.now() + 1800;
      navegar(escena);
    },
    /** true durante un salto pedido por el visitante (menú, barra de capítulos). */
    estaSaltando: () => Date.now() < saltandoHasta,
    /** Frena o libera el scroll (por ejemplo, durante la intro). */
    pausarScroll(valor: boolean) {
      pausado = valor;
      pausar(valor);
    },
    /** <Recorrido> enchufa acá el scroll suave una vez que existe. */
    conectarNavegacion(irA: typeof navegar, pausarScroll: typeof pausar) {
      navegar = irA;
      pausar = pausarScroll;
      pausar(pausado);
    },
    obtener: () => estado,
    fijar(parcial: Partial<EstadoRecorrido>) {
      estado = { ...estado, ...parcial };
      emitir();
    },
    /**
     * El personaje dice esto ahora, por encima del guion de la escena, durante
     * `ms` milisegundos (o hasta que se lo haga callar).
     */
    decir(texto: string, pose?: string, ms = 6500) {
      const id = ++contadorDicho;
      if (temporizadorDicho) clearTimeout(temporizadorDicho);
      estado = { ...estado, dicho: { id, texto, pose } };
      emitir();
      temporizadorDicho = setTimeout(() => {
        if (estado.dicho?.id === id) {
          estado = { ...estado, dicho: null };
          emitir();
        }
      }, ms);
    },
    /** Vuelve al guion de la escena. */
    callar() {
      if (temporizadorDicho) clearTimeout(temporizadorDicho);
      temporizadorDicho = null;
      if (estado.dicho) {
        estado = { ...estado, dicho: null };
        emitir();
      }
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

/** Lo que el personaje dice fuera del guion ahora mismo, o null. */
export function useDicho(): Dicho | null {
  const director = useDirector();
  return useSyncExternalStore(
    director.suscribir,
    () => director.obtener().dicho,
    () => null,
  );
}

/**
 * En qué paso (0..cantidad-1) de la escena actual está el visitante: la parte
 * animada de la escena se divide en tramos iguales. Re-renderiza solo cuando
 * cambia el paso. Con cantidad 0 devuelve siempre 0.
 */
export function usePasoActual(cantidad: number): number {
  const director = useDirector();
  const calcular = () => {
    if (cantidad <= 0) return 0;
    const p = director.obtener().progresoAnimacion;
    return Math.min(cantidad - 1, Math.floor(p * cantidad));
  };
  return useSyncExternalStore(director.suscribir, calcular, () => 0);
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
