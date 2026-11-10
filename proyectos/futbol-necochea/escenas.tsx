import { EscenaLab as Escena } from "@/components/laboratorio/EscenaLab";
import type { Linea } from "@/components/personaje/guion";
import type { Destino } from "@/components/laboratorio/MenuLaboratorio";
import { obtenerClubes, obtenerGoleadores, obtenerNoticias, obtenerPosiciones, obtenerUltimaFecha } from "./api";
import { Ficha } from "./escenas/Ficha";
import { MonitorAPI } from "./escenas/MonitorAPI";
import { Multiverso } from "./escenas/Multiverso";
import { meta } from "./meta";

// Fútbol de Necochea: del caos de nombres a la API que usan los diarios, en
// dos paradas. El caos vive al principio del Multiverso (las versiones de un
// club desordenadas) y los diarios, al pie del monitor de la API.
// PENDIENTE: revisar el guion con Fermín.

const P = meta.slug;

export const guion: Record<string, Linea> = {
  [`mesa-${P}`]: {
    texto: "Mi experimento favorito. El fútbol de Necochea no existía en ninguna computadora. Bajá, que te muestro de dónde salió.",
    pose: "senalando",
  },
  [`${P}-multiverso`]: {
    texto: "Los resultados vivían en fotos y planillas, y cada club estaba escrito como a cada uno se le cantaba. Mi trabajo fue convencer a todas esas versiones de que son la misma. Probá vos.",
    pose: "senalando",
  },
  [`${P}-api`]: {
    texto: "Y esto es lo que antes no existía: el fútbol de Necochea ordenado y en vivo. Abajo, las notas de los diarios que lo usan.",
    pose: "eureka",
  },
  [`${P}-ficha`]: { texto: "La letra chica, por si sos de los que la leen.", pose: "quieto" },
};

export const dimensiones: NonNullable<Destino["hijos"]> = [
  { escena: `${P}-multiverso`, etiqueta: "1 · Del caos al orden" },
  { escena: `${P}-api`, etiqueta: "2 · La API en vivo" },
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
      <Escena id={`${P}-multiverso`} duracion={1.8}>
        <Multiverso clubes={clubes} />
      </Escena>

      <Escena id={`${P}-api`} duracion={1}>
        <MonitorAPI
          datos={{
            liga: posiciones?.ligaNombre ?? null,
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
