import { BarraProgreso, Escena, Recorrido } from "@/components/recorrido";
import { Personaje } from "@/components/personaje/Personaje";
import type { Guion } from "@/components/personaje/guion";
import { Ambiente } from "@/components/laboratorio/Ambiente";
import { EscenaPortal } from "@/components/laboratorio/EscenaPortal";
import { MenuLaboratorio } from "@/components/laboratorio/MenuLaboratorio";
import { VolverAlLaboratorio } from "@/components/laboratorio/VolverAlLaboratorio";
import { obtenerClubes, obtenerGoleadores, obtenerNoticias, obtenerPosiciones, obtenerUltimaFecha } from "./api";
import { Caos } from "./escenas/Caos";
import { Diarios } from "./escenas/Diarios";
import { Ficha } from "./escenas/Ficha";
import { MonitorAPI } from "./escenas/MonitorAPI";
import { Multiverso } from "./escenas/Multiverso";
import { meta } from "./meta";

// Fútbol de Necochea: un viaje por cuatro dimensiones.
// PENDIENTE: revisar el guion con Fermín.
const guion: Guion = {
  inicial: { texto: "Bienvenido. Antes de este proyecto, el fútbol de Necochea no existía… al menos no en ninguna computadora." },
  escenas: {
    portal: { texto: "Abrí el portal. Te muestro de dónde salió todo.", pose: "senalando" },
    caos: {
      texto: "Esto es lo que había. Resultados en fotos borrosas, nombres escritos como a cada uno se le cantaba. Ningún sistema puede leer esto.",
      pose: "sorprendido",
    },
    multiverso: {
      texto: "En el multiverso de los datos un club existe en muchas versiones. Mi trabajo fue convencerlas de que son la misma. Probá vos.",
      pose: "senalando",
    },
    api: {
      texto: "Y esto es lo que antes no existía: el fútbol de Necochea, ordenado y disponible para cualquiera que lo pida.",
      pose: "eureka",
    },
    diarios: {
      texto: "Muove llevó estos datos a los diarios de la zona. Hoy los lee gente que no tiene idea de que existió el caos.",
      pose: "quieto",
    },
    ficha: { texto: "La letra chica, por si sos de los que la leen.", pose: "quieto" },
  },
};

const destinos = [
  { escena: "caos", etiqueta: "1 · Caos" },
  { escena: "multiverso", etiqueta: "2 · Multiverso" },
  { escena: "api", etiqueta: "3 · API en vivo" },
  { escena: "diarios", etiqueta: "4 · Diarios" },
  { escena: "ficha", etiqueta: "Ficha técnica" },
];

export default async function PaginaFutbol() {
  const [posiciones, ultimaFecha, goleadores, clubes, noticias] = await Promise.all([
    obtenerPosiciones(),
    obtenerUltimaFecha(),
    obtenerGoleadores(),
    obtenerClubes(),
    obtenerNoticias(),
  ]);

  return (
    <Recorrido>
      <BarraProgreso />
      <Ambiente />
      <VolverAlLaboratorio />
      <MenuLaboratorio destinos={destinos} />
      <Personaje guion={guion} />

      <Escena id="portal" duracion={1.6}>
        <EscenaPortal
          etiqueta="Experimento 01 · caso principal"
          titulo={meta.titulo}
          gancho="Los resultados vivían en fotos de Instagram y grupos de WhatsApp. Hoy son una API que usan los diarios."
        />
      </Escena>

      <Escena id="caos" duracion={1.8}>
        <Caos />
      </Escena>

      <Escena id="multiverso" duracion={3}>
        <Multiverso clubes={clubes} />
      </Escena>

      <Escena id="api" duracion={1.4}>
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

      <Escena id="diarios" duracion={1.4}>
        <Diarios noticias={noticias} />
      </Escena>

      <Escena id="ficha" duracion={0.8}>
        <Ficha proyecto={meta} />
      </Escena>
    </Recorrido>
  );
}
