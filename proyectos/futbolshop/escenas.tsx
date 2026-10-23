import { EscenaLab as Escena } from "@/components/laboratorio/EscenaLab";
import type { Linea } from "@/components/personaje/guion";
import type { Destino } from "@/components/laboratorio/MenuLaboratorio";
import { FichaTecnica } from "@/components/laboratorio/FichaTecnica";
import { Construccion } from "./escenas/Construccion";
import { Hallazgos } from "./escenas/Hallazgos";
import { LineaDeTiempo } from "./escenas/LineaDeTiempo";
import { Sandbox } from "./escenas/Sandbox";
import { PASOS_CONSTRUCCION, PASOS_HALLAZGOS, PASOS_LINEA } from "./data/pasos";
import { meta } from "./meta";

// FutbolShop: de cero a producción, la copia de juguete del inventario, cómo
// está hecho y los tres bugs del núcleo. PENDIENTE: revisar el guion con Fermín.

const P = meta.slug;

export const guion: Record<string, Linea> = {
  [`mesa-${P}`]: {
    texto: "Un sistema de caja e inventario que una tienda usa todos los días. Acá te doy una copia de juguete para que la rompas tranquilo.",
    pose: "senalando",
  },
  [`${P}-linea`]: {
    texto: "Del primer commit al cierre de las 84 tareas pasaron seis días.",
    pose: "senalando",
    pasos: PASOS_LINEA.map((p) => ({ texto: p.dice, pose: p.pose })),
  },
  [`${P}-sandbox`]: {
    texto: "Buscá, tildá varios, subiles el precio, tocá un nombre y ajustá el stock. Los datos son inventados: rompé todo.",
    pose: "senalando",
  },
  [`${P}-construccion`]: {
    texto: "El núcleo es de otro y se actualiza solo.",
    pose: "senalando",
    pasos: PASOS_CONSTRUCCION.map((p) => ({ texto: p.dice, pose: p.pose })),
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
  { escena: `${P}-linea`, etiqueta: "1 · De cero a producción" },
  { escena: `${P}-sandbox`, etiqueta: "2 · El inventario, para jugar" },
  { escena: `${P}-construccion`, etiqueta: "3 · Cómo está hecho" },
  { escena: `${P}-hallazgos`, etiqueta: "4 · Tres bugs del núcleo" },
  { escena: `${P}-ficha`, etiqueta: "Ficha técnica" },
];

export function Escenas() {
  return (
    <>
      <Escena id={`${P}-linea`} duracion={3.2}>
        <LineaDeTiempo />
      </Escena>

      <Escena id={`${P}-sandbox`} duracion={1.6}>
        <Sandbox />
      </Escena>

      <Escena id={`${P}-construccion`} duracion={3.2}>
        <Construccion />
      </Escena>

      <Escena id={`${P}-hallazgos`} duracion={3.2}>
        <Hallazgos />
      </Escena>

      <Escena id={`${P}-ficha`} duracion={0.8}>
        <FichaTecnica
          proyecto={meta}
          filasExtra={[
            {
              etiqueta: "Código",
              contenido: "Repositorio privado de Muove: es el sistema de un cliente en producción. Lo que se puede mostrar está en la copia de juguete de arriba.",
            },
            {
              etiqueta: "Base",
              contenido: "NexoPOS 6.2.2, de Blair Jersyer, con su licencia. Todo lo propio vive en modules/FutbolShop y en docs/; el núcleo recibe actualizaciones.",
            },
          ]}
        />
      </Escena>
    </>
  );
}
