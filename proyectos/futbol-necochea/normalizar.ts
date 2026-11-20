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
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(texto: string): string[] {
  return limpiar(texto)
    .split(" ")
    .filter((t) => t && !PALABRAS_VACIAS.has(t));
}

/** Une letras sueltas consecutivas: ["defensores", "p", "q"] → ["defensores", "pq"]. */
function colapsarSiglas(toks: string[]): string[] {
  const out: string[] = [];
  let buf = "";
  for (const t of toks) {
    if (t.length === 1) {
      buf += t;
    } else {
      if (buf) {
        out.push(buf);
        buf = "";
      }
      out.push(t);
    }
  }
  if (buf) out.push(buf);
  return out;
}

function iniciales(texto: string): string {
  return tokens(texto)
    .map((t) => t[0])
    .join("");
}

/** Mapa de cada subsigla contigua (ej. "jnf" → índices de ["juan", "n", "fernandez"]). */
function mapaSubsiglas(toks: string[]): Map<string, number[]> {
  const m = new Map<string, number[]>();
  for (let i = 0; i < toks.length; i++) {
    let acc = toks[i][0];
    const idxs = [i];
    if (toks[i].length > 1 && !m.has(acc)) m.set(acc, [...idxs]);
    for (let j = i + 1; j < toks.length; j++) {
      acc += toks[j][0];
      idxs.push(j);
      if (!m.has(acc)) m.set(acc, [...idxs]);
    }
  }
  return m;
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

  const teRaw = tokens(entrada);
  const tcRaw = tokens(club);
  const te = colapsarSiglas(teRaw);
  const tc = colapsarSiglas(tcRaw);
  if (!te.length || !tc.length) return dice(bigramas(entrada), bigramas(club));

  const siglasC = mapaSubsiglas(tcRaw);
  const siglasE = mapaSubsiglas(teRaw);

  const cubiertosE = new Set<number>();
  const cubiertosC = new Set<number>();

  // 1. Coincidencias directas o por prefijo abreviado ("sp" → "sportivo", "ind" → "independiente")
  te.forEach((t, i) => {
    tc.forEach((c, j) => {
      if (t === c || (t.length >= 2 && c.startsWith(t)) || (c.length >= 2 && t.startsWith(c))) {
        cubiertosE.add(i);
        cubiertosC.add(j);
      }
    });
  });

  // 2. Siglas en la entrada que expanden a varios tokens del club ("jnf" → "juan n fernandez", "sc" → "san cayetano")
  te.forEach((t, i) => {
    const idxs = siglasC.get(t);
    if (idxs && (t.length >= 2 || te.length >= 2)) {
      cubiertosE.add(i);
      for (const j of idxs) {
        if (j < tc.length) cubiertosC.add(j);
      }
    }
  });

  // 3. Siglas en el club que cubren varios tokens de la entrada ("pq" ← "puerto quequen")
  tc.forEach((c, j) => {
    const idxs = siglasE.get(c);
    if (idxs && (c.length >= 2 || tc.length >= 2)) {
      cubiertosC.add(j);
      for (const i of idxs) {
        if (i < te.length) cubiertosE.add(i);
      }
    }
  });

  const precision = cubiertosE.size / te.length;
  const recall = cubiertosC.size / tc.length;
  const porTokens = cubiertosE.size > 0 ? (precision * 0.72 + recall * 0.28) * 0.94 : 0;

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
