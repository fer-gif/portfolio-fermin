import type { ComponentType } from "react";
import { BarraProgreso, Escena, Recorrido } from "@/components/recorrido";
import { Personaje } from "@/components/personaje/Personaje";
import type { Guion, Linea } from "@/components/personaje/guion";
import { Ambiente } from "@/components/laboratorio/Ambiente";
import { Cortina } from "@/components/laboratorio/Cortina";
import { EscenaEntrada } from "@/components/laboratorio/EscenaEntrada";
import { EscenaSalida } from "@/components/laboratorio/EscenaSalida";
import { Mesa } from "@/components/laboratorio/Mesa";
import { MenuLaboratorio, type Destino } from "@/components/laboratorio/MenuLaboratorio";
import { perfil } from "@/lib/perfil";
import { proyectos } from "@/proyectos";
import * as futbol from "@/proyectos/futbol-necochea/escenas";
import * as zonaFria from "@/proyectos/zona-fria/escenas";

// Todo el portfolio es un solo recorrido: entrada → cada mesa con las escenas
// de su proyecto justo después → salida. Un proyecto "vive" acá cuando tiene
// su módulo de escenas; mientras no lo tenga, solo muestra su mesa.
interface ModuloProyecto {
  Escenas: ComponentType;
  guion: Record<string, Linea>;
  dimensiones: NonNullable<Destino["hijos"]>;
}

const modulos: Record<string, ModuloProyecto> = {
  "futbol-necochea": futbol,
  "zona-fria": zonaFria,
};

// Lo que dice el científico en las paradas comunes. Cada proyecto trae las suyas.
// PENDIENTE: revisar el tono con Fermín.
const guionBase: Record<string, Linea> = {
  entrada: {
    texto: "Acá adentro cada proyecto es un experimento que podés tocar. Vení, te muestro.",
    pose: "senalando",
  },
  "mesa-argentina-brasil": {
    texto: "¿Cuánto depende Argentina de Brasil? Elegí un sector y mirá lo que pasa. Este experimento todavía se está armando.",
    pose: "quieto",
  },
  "mesa-futbolshop": {
    texto: "Un inventario real, de un cliente real. Pronto te doy una copia para que la rompas tranquilo.",
    pose: "senalando",
  },
  "mesa-ypf": {
    texto: "Esto todavía está en el tubo de ensayo. No toques nada.",
    pose: "sorprendido",
  },
  salida: {
    texto: "Eso es todo por ahora. Si querés hablar, acá estoy.",
    pose: "eureka",
  },
};

const guion: Guion = {
  inicial: { texto: `Hola, soy ${perfil.nombre}. Bienvenido a mi laboratorio.` },
  escenas: {
    ...guionBase,
    ...Object.assign({}, ...Object.values(modulos).map((m) => m.guion)),
  },
};

const destinos: Destino[] = [
  { escena: "entrada", etiqueta: "Entrada" },
  ...proyectos.map((p) => ({
    escena: `mesa-${p.slug}`,
    etiqueta: p.titulo,
    hijos: modulos[p.slug]?.dimensiones,
  })),
  { escena: "salida", etiqueta: "Contacto" },
];

export default function Laboratorio() {
  return (
    <Recorrido>
      <Cortina />
      <BarraProgreso />
      <Ambiente />
      <MenuLaboratorio destinos={destinos} />
      <Personaje guion={guion} esperarIntro />

      <Escena id="entrada" duracion={1.2} solapar={false}>
        <EscenaEntrada nombre={perfil.nombre} titulo={perfil.titulo} />
      </Escena>

      {proyectos.map((proyecto, i) => {
        const modulo = modulos[proyecto.slug];
        return (
          <div key={proyecto.slug} className="contents">
            <Escena id={`mesa-${proyecto.slug}`} duracion={1.4}>
              <Mesa proyecto={proyecto} numero={i + 1} tieneEscenas={Boolean(modulo)} />
            </Escena>
            {modulo && <modulo.Escenas />}
          </div>
        );
      })}

      <Escena id="salida" duracion={0.8} cubierta={false}>
        <EscenaSalida
          nombre={perfil.nombre}
          presentacion={perfil.presentacion}
          enlaces={perfil.enlaces}
        />
      </Escena>
    </Recorrido>
  );
}
