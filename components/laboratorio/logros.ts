"use client";

import { useSyncExternalStore } from "react";

// Los "experimentos desbloqueados": cada artefacto que el visitante usa y cada
// objeto que descubre suma un frasco a su repisa. Se guarda en el navegador,
// nada sale de acá.

export interface Logro {
  id: string;
  nombre: string;
  /** Cómo conseguirlo, para la lista de la salida. */
  pista: string;
  /** Escena a la que lleva la pista, si hay una. */
  escena?: string;
}

export const LOGROS: Logro[] = [
  { id: "cientifico", nombre: "Hiciste hablar al científico", pista: "Tocalo. No muerde." },
  { id: "multiverso", nombre: "Normalizaste un nombre de club", pista: "Escribí un club en la máquina de Fútbol", escena: "futbol-necochea-multiverso" },
  { id: "api", nombre: "Espiaste la API de fútbol en vivo", pista: "Cambiá de pestaña en el monitor de la API", escena: "futbol-necochea-api" },
  { id: "dependometro", nombre: "Pesaste un sector en el dependómetro", pista: "Elegí trigo, autos o peras", escena: "argentina-brasil-dependometro" },
  { id: "inventario", nombre: "Tocaste el inventario de juguete", pista: "Subí precios o ajustá un stock", escena: "futbolshop-sandbox" },
  { id: "calculadora", nombre: "Calculaste tu factura de gas", pista: "Describí tu casa en la calculadora", escena: "zona-fria-calculadora" },
  { id: "consulta", nombre: "Le preguntaste al modelo por los sismos", pista: "Movelé los meses a la consulta", escena: "ypf-consulta" },
  { id: "curioso", nombre: "Descubriste tres objetos del laboratorio", pista: "Hay cosas en la pared y en la mesada que se tocan" },
  { id: "coleccionista", nombre: "Descubriste todos los objetos", pista: "Cuadros, kimono, tabla, estante, pan…" },
  { id: "salida", nombre: "Llegaste al final del recorrido", pista: "Seguí bajando", escena: "salida" },
];

/** Objetos del laboratorio que se pueden descubrir (los define objetos.ts). */
export const CANTIDAD_OBJETOS = 7;

const CLAVE_LOGROS = "lab-logros";
const CLAVE_OBJETOS = "lab-objetos";
const VACIO: string[] = [];

interface Ultimo {
  logro: Logro;
  momento: number;
}

let desbloqueados: string[] = VACIO;
let objetos: string[] = VACIO;
let ultimo: Ultimo | null = null;
let cargado = false;
const oyentes = new Set<() => void>();

function leer(clave: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(clave) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function guardar(clave: string, valor: string[]) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // sin almacenamiento (modo privado, etc.): la repisa vive solo esta visita
  }
}

function cargar() {
  if (cargado || typeof window === "undefined") return;
  cargado = true;
  desbloqueados = leer(CLAVE_LOGROS);
  objetos = leer(CLAVE_OBJETOS);
}

const emitir = () => oyentes.forEach((fn) => fn());

function suscribir(fn: () => void) {
  const yaEstaba = cargado;
  cargar();
  oyentes.add(fn);
  // Si recién se leyó el almacenamiento, que React vuelva a mirar.
  if (!yaEstaba) queueMicrotask(emitir);
  return () => {
    oyentes.delete(fn);
  };
}

/** Marca un experimento como hecho. Devuelve true si era nuevo. */
export function desbloquear(id: string): boolean {
  cargar();
  if (desbloqueados.includes(id)) return false;
  const logro = LOGROS.find((l) => l.id === id);
  if (!logro) return false;
  desbloqueados = [...desbloqueados, id];
  guardar(CLAVE_LOGROS, desbloqueados);
  ultimo = { logro, momento: Date.now() };
  emitir();
  return true;
}

/** Registra un objeto descubierto; a los tres y al completo se desbloquean logros. */
export function registrarObjeto(id: string) {
  cargar();
  if (!objetos.includes(id)) {
    objetos = [...objetos, id];
    guardar(CLAVE_OBJETOS, objetos);
    emitir();
  }
  if (objetos.length >= 3) desbloquear("curioso");
  if (objetos.length >= CANTIDAD_OBJETOS) desbloquear("coleccionista");
}

/** Ids de los experimentos desbloqueados. */
export function useLogros(): string[] {
  return useSyncExternalStore(suscribir, () => desbloqueados, () => VACIO);
}

/** Objetos ya descubiertos. */
export function useObjetosDescubiertos(): string[] {
  return useSyncExternalStore(suscribir, () => objetos, () => VACIO);
}

/** El último desbloqueado (cambia de identidad en cada desbloqueo), para avisar. */
export function useUltimoLogro(): Ultimo | null {
  return useSyncExternalStore(suscribir, () => ultimo, () => null);
}
