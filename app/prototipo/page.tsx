import type { Metadata } from "next";
import { BarraProgreso, Escena, Recorrido } from "@/components/recorrido";
import { Personaje } from "@/components/personaje/Personaje";
import type { Guion } from "@/components/personaje/guion";
import { Ambiente } from "./Ambiente";
import { EscenaDatos } from "./EscenaDatos";
import { EscenaMultiverso } from "./EscenaMultiverso";
import { EscenaPortal } from "./EscenaPortal";

export const metadata: Metadata = {
  title: "Prototipo del recorrido",
  robots: { index: false },
};

const guion: Guion = {
  inicial: { texto: "Bienvenido al laboratorio. Scrolleá, que te muestro." },
  escenas: {
    portal: {
      texto: "Antes de este proyecto, el fútbol de Necochea no existía en ninguna computadora.",
      pose: "quieto",
    },
    multiverso: {
      texto: "En el multiverso de los datos este club existe en 6 versiones. Mi trabajo fue convencerlas de que son la misma.",
      pose: "sorprendido",
    },
    datos: {
      texto: "Y esto es lo que antes no existía: el fútbol de Necochea, ordenado y disponible para cualquiera.",
      pose: "senalando",
      lado: "derecha",
    },
  },
};

// Prototipo de las Etapas 1 y 2: sirve para probar cómo se siente el scroll
// y cómo se mueve el personaje. Se borra cuando el laboratorio real esté armado.
export default function Prototipo() {
  return (
    <Recorrido>
      <BarraProgreso />
      <Ambiente />
      <Personaje guion={guion} />

      <Escena id="portal" duracion={2}>
        <EscenaPortal />
      </Escena>
      <Escena id="multiverso" duracion={2.5}>
        <EscenaMultiverso />
      </Escena>
      <Escena id="datos" duracion={2}>
        <EscenaDatos />
      </Escena>

      <section className="grid h-svh place-items-center">
        <p className="font-mono text-sm text-lab-tenue">fin del prototipo · volvé a subir</p>
      </section>
    </Recorrido>
  );
}
