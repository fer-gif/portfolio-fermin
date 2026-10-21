import type { Metadata } from "next";
import { Escena, Recorrido } from "@/components/recorrido";
import { Ambiente } from "./Ambiente";
import { EscenaDatos } from "./EscenaDatos";
import { EscenaMultiverso } from "./EscenaMultiverso";
import { EscenaPortal } from "./EscenaPortal";
import { PersonajePrueba } from "./PersonajePrueba";

export const metadata: Metadata = {
  title: "Prototipo del recorrido",
  robots: { index: false },
};

// Prototipo de la Etapa 1: sirve para probar cómo se siente el scroll.
// Se borra cuando el laboratorio real esté armado.
export default function Prototipo() {
  return (
    <Recorrido>
      <Ambiente />
      <PersonajePrueba />

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
