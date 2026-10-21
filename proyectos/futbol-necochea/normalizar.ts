import type { Club } from "./api";

// La "máquina de normalización" del Multiverso: dado un nombre escrito de
// cualquier manera, encuentra a qué club real corresponde.
// Es una versión simplificada y pedagógica del problema que resolvió el
// pipeline real; sirve para que el visitante lo experimente.

const PALABRAS_VACIAS = new Set(["de", "del", "la", "el", "y", "club", "atletico", "c", "a"]);

export function limpiar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(texto: string): string[] {
  return limpiar(texto)
    .split(" ")
    .filter((t) => t && !PALABRAS_VACIAS.has(t));
}

function iniciales(texto: string): string {
  return tokens(texto)
    .map((t) => t[0])
    .join("");
}

function bigramas(texto: string): Set<string> {
  const s = limpiar(texto).replace(/ /g, "");
  const b = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) b.add(s.slice(i, i + 2));
  return b;
}

function dice(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let comunes = 0;
  for (const x of a) if (b.has(x)) comunes++;
  return (2 * comunes) / (a.size + b.size);
}

/** Qué tan parecido es lo escrito al nombre del club, de 0 a 1. */
export function puntaje(entrada: string, club: string): number {
  const e = limpiar(entrada);
  if (!e) return 0;
  if (e === limpiar(club)) return 1;
  if (e.length >= 2 && e.replace(/ /g, "") === iniciales(club)) return 0.95;

  const te = tokens(entrada);
  const tc = tokens(club);
  const acertados = te.filter((t) =>
    tc.some((c) => (t.length >= 3 && c.startsWith(t)) || (c.length >= 3 && t.startsWith(c))),
  ).length;
  const porTokens = te.length ? (acertados / te.length) * 0.9 : 0;

  return Math.max(porTokens, dice(bigramas(entrada), bigramas(club)));
}

export interface Resultado {
  club: Club;
  puntaje: number;
}

export const UMBRAL = 0.45;

/** Los clubes candidatos, del más parecido al menos, por encima del umbral. */
export function normalizar(entrada: string, clubes: Club[]): Resultado[] {
  return clubes
    .map((club) => ({ club, puntaje: puntaje(entrada, club.nombre) }))
    .filter((r) => r.puntaje >= UMBRAL)
    .sort((a, b) => b.puntaje - a.puntaje);
}
