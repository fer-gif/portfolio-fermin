// Cliente de la API pública de Fútbol de Necochea.
// Se consulta desde el servidor y se cachea: el sitio no le pega a la API en
// cada visita, y si la API se cae se siguen mostrando los últimos datos.

const BASE = "https://widget-futbol-muove.vercel.app/api";
const REVALIDAR_SEGUNDOS = 300;

export const ENDPOINTS = {
  posiciones: `${BASE}/prode/standings`,
  goleadores: `${BASE}/goleadores`,
  partidos: `${BASE}/widget`,
  noticias: `${BASE}/news`,
} as const;

export interface Club {
  nombre: string;
  logo: string;
}

export interface Noticia {
  id: string;
  url: string;
  title: string;
  image: string;
  description: string;
  siteName: string;
}

export interface Posicion {
  posicion: number;
  equipo: string;
  logo: string;
  jugados: number;
  ganados: number;
  empatados: number;
  perdidos: number;
  golesFavor: number;
  golesContra: number;
  diferenciaGol: number;
  puntos: number;
  zona: string;
}

export interface Goleador {
  posicion: number;
  nombre: string;
  equipo: string;
  logo: string;
  goles: number;
}

export interface Equipo {
  nombre: string;
  logo: string;
}

export interface Partido {
  id: string;
  goles_local: number | null;
  goles_visitante: number | null;
  estado_partido: string;
  fecha_hora: string;
  jornada: string | null;
  equipo_local: Equipo;
  equipo_visitante: Equipo;
}

interface RespuestaPosiciones {
  ligaNombre: string;
  zonaA: Posicion[];
  zonaB: Posicion[];
}

async function pedir<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDAR_SEGUNDOS } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? (json as T) : null;
  } catch {
    return null;
  }
}

export function obtenerPosiciones() {
  return pedir<RespuestaPosiciones>(ENDPOINTS.posiciones);
}

/** Los clubes de la liga con su escudo, sacados de la tabla. */
export async function obtenerClubes(): Promise<Club[]> {
  const r = await obtenerPosiciones();
  if (!r) return [];
  return [...r.zonaA, ...r.zonaB].map((f) => ({ nombre: f.equipo, logo: f.logo }));
}

/** Notas de prensa que usan los datos. La API repite notas: se deduplican por URL. */
export async function obtenerNoticias(maximo = 4): Promise<Noticia[]> {
  const r = await pedir<{ noticias: Noticia[] }>(ENDPOINTS.noticias);
  if (!r) return [];
  const vistas = new Set<string>();
  return r.noticias
    .filter((n) => !vistas.has(n.url) && vistas.add(n.url))
    .slice(0, maximo);
}

export async function obtenerGoleadores(): Promise<Goleador[] | null> {
  const r = await pedir<{ goleadores: Goleador[] }>(ENDPOINTS.goleadores);
  return r?.goleadores ?? null;
}

/** La API trae jornadas como "Fecha  8" o null: las unificamos. */
export function normalizarJornada(jornada: string | null): string {
  return jornada?.replace(/\s+/g, " ").trim() || "Sin fecha";
}

/** Partidos de la jornada más reciente que tenga partidos finalizados. */
export async function obtenerUltimaFecha(): Promise<{
  jornada: string;
  partidos: Partido[];
} | null> {
  const r = await pedir<{ partidos: Partido[] }>(ENDPOINTS.partidos);
  if (!r) return null;

  const ultimo = r.partidos
    .filter((p) => p.estado_partido === "finalizado")
    .sort((a, b) => b.fecha_hora.localeCompare(a.fecha_hora))[0];
  if (!ultimo) return null;

  const jornada = normalizarJornada(ultimo.jornada);
  return {
    jornada,
    partidos: r.partidos.filter((p) => normalizarJornada(p.jornada) === jornada),
  };
}
