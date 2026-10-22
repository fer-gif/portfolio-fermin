import { EscenaLab as Escena } from "@/components/laboratorio/EscenaLab";
import type { Linea } from "@/components/personaje/guion";
import type { Destino } from "@/components/laboratorio/MenuLaboratorio";
import { obtenerClubes, obtenerGoleadores, obtenerNoticias, obtenerPosiciones, obtenerUltimaFecha } from "./api";
import { Caos } from "./escenas/Caos";
import { Diarios } from "./escenas/Diarios";
import { Ficha } from "./escenas/Ficha";
import { MonitorAPI } from "./escenas/MonitorAPI";
import { Multiverso } from "./escenas/Multiverso";
import { meta } from "./meta";

// Fútbol de Necochea: un viaje por cuatro dimensiones, dentro del laboratorio.
// La mesa del proyecto es el portal; estas escenas vienen justo después.
// PENDIENTE: revisar el guion con Fermín.

const P = meta.slug;

export const guion: Record<string, Linea> = {
  [`mesa-${P}`]: {
    texto: "Mi experimento favorito. El fútbol de Necochea no existía en ninguna computadora. Bajá, que te muestro de dónde salió.",
    pose: "senalando",
  },
  [`${P}-caos`]: {
    texto: "Esto es lo que había. Resultados en fotos borrosas, nombres escritos como a cada uno se le cantaba. Ningún sistema puede leer esto.",
    pose: "sorprendido",
  },
  [`${P}-multiverso`]: {
    texto: "En el multiverso de los datos un club existe en muchas versiones. Mi trabajo fue convencerlas de que son la misma. Probá vos.",
    pose: "senalando",
  },
  [`${P}-api`]: {
    texto: "Y esto es lo que antes no existía: el fútbol de Necochea, ordenado y disponible para cualquiera que lo pida.",
    pose: "eureka",
  },
  [`${P}-diarios`]: {
    texto: "Muove llevó estos datos a los diarios de la zona. Hoy los lee gente que no tiene idea de que existió el caos.",
    pose: "quieto",
  },
  [`${P}-ficha`]: { texto: "La letra chica, por si sos de los que la leen.", pose: "quieto" },
};

export const dimensiones: NonNullable<Destino["hijos"]> = [
  { escena: `${P}-caos`, etiqueta: "1 · Caos" },
  { escena: `${P}-multiverso`, etiqueta: "2 · Multiverso" },
  { escena: `${P}-api`, etiqueta: "3 · API en vivo" },
  { escena: `${P}-diarios`, etiqueta: "4 · Diarios" },
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
      <Escena id={`${P}-caos`} duracion={1.8}>
        <Caos />
      </Escena>

      <Escena id={`${P}-multiverso`} duracion={3}>
        <Multiverso clubes={clubes} />
      </Escena>

      <Escena id={`${P}-api`} duracion={1.4}>
        <MonitorAPI
          datos={{
            liga: posiciones?.ligaNombre ?? null,
            zonaA: posiciones?.zonaA ?? [],
            zonaB: posiciones?.zonaB ?? [],
            ultimaFecha,
            goleadores: goleadores ?? [],
          }}
        />
      </Escena>

      <Escena id={`${P}-diarios`} duracion={1.4}>
        <Diarios noticias={noticias} />
      </Escena>

      <Escena id={`${P}-ficha`} duracion={0.8}>
        <Ficha proyecto={meta} />
      </Escena>
    </>
  );
}
