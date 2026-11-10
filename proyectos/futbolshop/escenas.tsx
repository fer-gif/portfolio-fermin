import { EscenaLab as Escena } from "@/components/laboratorio/EscenaLab";
import type { Linea } from "@/components/personaje/guion";
import type { Destino } from "@/components/laboratorio/MenuLaboratorio";
import { FichaTecnica } from "@/components/laboratorio/FichaTecnica";
import { Hallazgos } from "./escenas/Hallazgos";
import { Sandbox } from "./escenas/Sandbox";
import { PASOS_HALLAZGOS } from "./data/pasos";
import { meta } from "./meta";

// FutbolShop: la copia de juguete del inventario y tres bugs que solo
// aparecieron con los datos reales. Los números de cómo está hecho van en la
// ficha (resultado). PENDIENTE: revisar el guion con Fermín.

const P = meta.slug;

export const guion: Record<string, Linea> = {
  [`mesa-${P}`]: {
    texto: "Una tienda que llevaba todo en Excel y hoy vende con un sistema a medida. Acá te doy una copia de juguete para que la rompas tranquilo.",
    pose: "senalando",
  },
  [`${P}-sandbox`]: {
    texto: "Buscá, tildá varios, subiles el precio, tocá un nombre y ajustá el stock. Los datos son inventados: rompé todo.",
    pose: "senalando",
  },
  [`${P}-hallazgos`]: {
    texto: "Decía «guardado» y era mentira.",
    pose: "sorprendido",
    pasos: PASOS_HALLAZGOS.map((p) => ({ texto: p.dice, pose: p.pose })),
  },
  [`${P}-ficha`]: {
    texto: "La letra chica. El código es privado, es el sistema de un cliente: lo que se puede mostrar está en la copia de juguete.",
    pose: "quieto",
  },
};

export const dimensiones: NonNullable<Destino["hijos"]> = [
  { escena: `${P}-sandbox`, etiqueta: "1 · El inventario, para jugar" },
  { escena: `${P}-hallazgos`, etiqueta: "2 · Tres bugs con datos reales" },
  { escena: `${P}-ficha`, etiqueta: "Ficha técnica" },
];

export function Escenas() {
  return (
    <>
      <Escena id={`${P}-sandbox`} duracion={1}>
        <Sandbox />
      </Escena>

      <Escena id={`${P}-hallazgos`} duracion={1.8}>
        <Hallazgos />
      </Escena>

      <Escena id={`${P}-ficha`} duracion={0.6}>
        <FichaTecnica
          proyecto={meta}
          filasExtra={[
            {
              etiqueta: "Código",
              contenido: "Repositorio privado de Muove: es el sistema de un cliente en producción. Lo que se puede mostrar está en la copia de juguete de arriba.",
            },
          ]}
        />
      </Escena>
    </>
  );
}
