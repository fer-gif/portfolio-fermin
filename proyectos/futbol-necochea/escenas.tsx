import { EscenaLab as Escena } from "@/components/laboratorio/EscenaLab";
import type { Linea } from "@/components/personaje/guion";
import type { Destino } from "@/components/laboratorio/MenuLaboratorio";
import { obtenerClubes, obtenerGoleadores, obtenerNoticias, obtenerPosiciones, obtenerUltimaFecha } from "./api";
import { AntesDespues } from "./escenas/AntesDespues";
import { Ficha } from "./escenas/Ficha";
import { MonitorAPI } from "./escenas/MonitorAPI";
import { Multiverso } from "./escenas/Multiverso";
import { meta } from "./meta";

// Fútbol de Necochea: del antes en texto plano al widget embebible, la
// normalización de nombres reales y la API en vivo de Data eNe.
// PENDIENTE: revisar el guion con Fermín.

const P = meta.slug;

export const guion: Record<string, Linea> = {
  [`mesa-${P}`]: {
    texto: "Uno de mis proyectos favoritos. El fútbol de Necochea solo existía en diarios digitales; hoy vive en un sistema moderno y vistoso para los lectores y los que les interesa el fútbol local.",
    pose: "senalando",
  },
  [`${P}-antes-despues`]: {
    texto: "Así se veía el fútbol local en los diarios: texto plano y tabla solo con los puntos. Tocá «Después» para ver cómo se ve ahora.",
    pose: "senalando",
  },
  [`${P}-multiverso`]: {
    texto: "Además, cada nota escribía el mismo club distinto: Defensores (PQ), Defensores de Puerto Quequén, Independiente (SC)… Probá con cualquiera.",
    pose: "senalando",
  },
  [`${P}-api`]: {
    texto: "Y esto es la API en vivo: posiciones calculadas desde PostgreSQL, última fecha y las notas de Data eNe donde hoy corre el widget.",
    pose: "eureka",
  },
  [`${P}-ficha`]: { texto: "La letra chica, el stack real y el link al código, por si sos de los que lo leen.", pose: "quieto" },
};

export const dimensiones: NonNullable<Destino["hijos"]> = [
  { escena: `${P}-antes-despues`, etiqueta: "1 · Antes y después" },
  { escena: `${P}-multiverso`, etiqueta: "2 · Del caos al orden" },
  { escena: `${P}-api`, etiqueta: "3 · La API en vivo" },
  { escena: `${P}-ficha`, etiqueta: "Ficha técnica" },
];

export async function Escenas() {
  const [posiciones, ultimaFecha, goleadores, clubes, noticias] = await Promise.all([
    obtenerPosiciones(),
    obtenerUltimaFecha(),
    obtenerGoleadores(),
    obtenerClubes(),
    obtenerNoticias(),
  ]);

  return (
    <>
      <Escena id={`${P}-antes-despues`} duracion={1.1}>
        <AntesDespues />
      </Escena>

      <Escena id={`${P}-multiverso`} duracion={1.8}>
        <Multiverso clubes={clubes} />
      </Escena>

      <Escena id={`${P}-api`} duracion={1}>
        <MonitorAPI
          datos={{
            liga: posiciones?.ligaNombre ?? null,
            clasifican: posiciones?.clasifican ?? 0,
            zonaA: posiciones?.zonaA ?? [],
            zonaB: posiciones?.zonaB ?? [],
            ultimaFecha,
            goleadores: goleadores ?? [],
          }}
          noticias={noticias}
        />
      </Escena>

      <Escena id={`${P}-ficha`} duracion={0.6}>
        <Ficha proyecto={meta} />
      </Escena>
    </>
  );
}
