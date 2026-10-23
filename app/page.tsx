import type { ComponentType } from "react";
import { BarraProgreso, Recorrido } from "@/components/recorrido";
import { Personaje } from "@/components/personaje/Personaje";
import type { Guion, Linea } from "@/components/personaje/guion";
import { Ambiente } from "@/components/laboratorio/Ambiente";
import { BarraCapitulos, type Capitulo } from "@/components/laboratorio/BarraCapitulos";
import { ContactoFijo } from "@/components/laboratorio/ContactoFijo";
import { Cortina } from "@/components/laboratorio/Cortina";
import { EscenaLab as Escena } from "@/components/laboratorio/EscenaLab";
import { EscenaEntrada } from "@/components/laboratorio/EscenaEntrada";
import { EscenaSalida } from "@/components/laboratorio/EscenaSalida";
import { FondoLaboratorio } from "@/components/laboratorio/FondoLaboratorio";
import { Mesa } from "@/components/laboratorio/Mesa";
import { MenuLaboratorio, type Destino } from "@/components/laboratorio/MenuLaboratorio";
import { Repisa } from "@/components/laboratorio/Repisa";
import { perfil } from "@/lib/perfil";
import { proyectos } from "@/proyectos";
import * as futbol from "@/proyectos/futbol-necochea/escenas";
import * as argentinaBrasil from "@/proyectos/argentina-brasil/escenas";
import * as zonaFria from "@/proyectos/zona-fria/escenas";
import * as ypf from "@/proyectos/ypf/escenas";
import * as futbolshop from "@/proyectos/futbolshop/escenas";

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
  "argentina-brasil": argentinaBrasil,
  "zona-fria": zonaFria,
  ypf,
  futbolshop,
};

// Lo que dice el científico en las paradas comunes. Cada proyecto trae las suyas.
// PENDIENTE: revisar el tono con Fermín.
const guionBase: Record<string, Linea> = {
  entrada: {
    texto: "Acá adentro cada proyecto es un experimento que podés tocar. Vení, te muestro.",
    pose: "senalando",
  },
  salida: {
    texto: "Eso es todo por ahora. Si querés hablar, acá estoy.",
    pose: "eureka",
  },
};

// En cada mesa el científico camina hasta el banco (al lado del pan, para no
// pararse encima de los frascos); en el resto de las escenas vuelve a su
// rincón de la izquierda.
const POSICION_MESA = 0.46;
const escenasDelGuion: Record<string, Linea> = {
  ...guionBase,
  ...Object.assign({}, ...Object.values(modulos).map((m) => m.guion)),
};
for (const [id, linea] of Object.entries(escenasDelGuion)) {
  if (id.startsWith("mesa-") && linea.posicion === undefined) {
    escenasDelGuion[id] = { ...linea, posicion: POSICION_MESA };
  }
}

const guion: Guion = {
  inicial: { texto: `Hola, soy ${perfil.nombre}. Bienvenido a mi laboratorio.` },
  escenas: escenasDelGuion,
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

// Los capítulos de la barra lateral: un punto por parada; las dimensiones
// de un proyecto cuentan como su mesa.
const capitulos: Capitulo[] = [
  { escena: "entrada", etiqueta: "Entrada" },
  ...proyectos.map((p) => ({ escena: `mesa-${p.slug}`, etiqueta: p.titulo, prefijos: [`${p.slug}-`] })),
  { escena: "salida", etiqueta: "Contacto" },
];

const enlace = (etiqueta: string) => perfil.enlaces.find((e) => e.etiqueta === etiqueta)?.url ?? "#";

export default function Laboratorio() {
  return (
    <Recorrido>
      <FondoLaboratorio />
      <Cortina />
      <BarraProgreso />
      <Ambiente />
      <MenuLaboratorio destinos={destinos} />
      <ContactoFijo email={perfil.email} linkedin={enlace("LinkedIn")} github={enlace("GitHub")} cv={perfil.cv} />
      <BarraCapitulos capitulos={capitulos} />
      <Repisa />
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
          nombre={perfil.nombreCompleto}
          presentacion={perfil.presentacion}
          enlaces={perfil.enlaces}
          cv={perfil.cv}
          repositorio={perfil.repositorio}
        />
      </Escena>
    </Recorrido>
  );
}
