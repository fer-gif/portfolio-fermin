import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BarraProgreso, Recorrido } from "@/components/recorrido";
import { Personaje } from "@/components/personaje/Personaje";
import type { Guion, Linea } from "@/components/personaje/guion";
import { Ambiente } from "@/components/laboratorio/Ambiente";
import { BarraCapitulos, type Capitulo } from "@/components/laboratorio/BarraCapitulos";
import { ContactoFijo } from "@/components/laboratorio/ContactoFijo";
import { EscenaLab as Escena } from "@/components/laboratorio/EscenaLab";
import { EscenaSiguiente } from "@/components/laboratorio/EscenaSiguiente";
import { FondoLaboratorio } from "@/components/laboratorio/FondoLaboratorio";
import { Mesa } from "@/components/laboratorio/Mesa";
import { MenuLaboratorio, type Destino } from "@/components/laboratorio/MenuLaboratorio";
import { Repisa } from "@/components/laboratorio/Repisa";
import { SinCortina } from "@/components/laboratorio/SinCortina";
import { perfil } from "@/lib/perfil";
import { proyectos } from "@/proyectos";
import * as futbol from "@/proyectos/futbol-necochea/escenas";
import * as argentinaBrasil from "@/proyectos/argentina-brasil/escenas";
import * as zonaFria from "@/proyectos/zona-fria/escenas";
import * as ypf from "@/proyectos/ypf/escenas";
import * as futbolshop from "@/proyectos/futbolshop/escenas";

// La página de un experimento, a la que se llega por el portal desde la
// vidriera: su mesa, sus paradas (proyectos/<slug>/escenas.tsx) y, al final,
// el experimento que sigue.

interface ModuloProyecto {
  Escenas: ComponentType;
  guion: Record<string, Linea>;
  dimensiones: Destino[];
}

const modulos: Record<string, ModuloProyecto> = {
  "futbol-necochea": futbol,
  "argentina-brasil": argentinaBrasil,
  "zona-fria": zonaFria,
  ypf,
  futbolshop,
};

/** En la mesa el científico camina hasta el banco (al lado del pan, para no pisar los frascos). */
const POSICION_MESA = 0.46;

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const proyecto = proyectos.find((p) => p.slug === slug);
  return proyecto ? { title: proyecto.titulo, description: proyecto.resumen } : {};
}

const enlace = (etiqueta: string) => perfil.enlaces.find((e) => e.etiqueta === etiqueta)?.url ?? "#";

export default async function PaginaProyecto({ params }: Props) {
  const { slug } = await params;
  const indice = proyectos.findIndex((p) => p.slug === slug);
  if (indice < 0) notFound();
  const proyecto = proyectos[indice];
  const siguiente = proyectos[(indice + 1) % proyectos.length];
  const modulo = modulos[slug];
  const mesa = `mesa-${slug}`;

  const escenas: Record<string, Linea> = {
    ...modulo?.guion,
    siguiente: { texto: "¿Seguimos? Tocá el que sigue y te llevo por el portal.", pose: "senalando" },
  };
  if (escenas[mesa] && escenas[mesa].posicion === undefined) escenas[mesa] = { ...escenas[mesa], posicion: POSICION_MESA };
  const guion: Guion = { inicial: escenas[mesa], escenas };

  const destinos: Destino[] = [
    { href: "/#experimentos", etiqueta: "← Volver al laboratorio" },
    { escena: mesa, etiqueta: proyecto.titulo, hijos: modulo?.dimensiones },
    {
      etiqueta: "Otros experimentos",
      hijos: proyectos.filter((p) => p.slug !== slug).map((p) => ({ href: `/proyectos/${p.slug}`, etiqueta: p.titulo })),
    },
  ];
  const capitulos: Capitulo[] = [
    { escena: mesa, etiqueta: proyecto.titulo },
    ...(modulo?.dimensiones ?? []).flatMap((d) => (d.escena ? [{ escena: d.escena, etiqueta: d.etiqueta }] : [])),
    { escena: "siguiente", etiqueta: "El que sigue" },
  ];

  return (
    <Recorrido>
      <SinCortina />
      <FondoLaboratorio />
      <BarraProgreso />
      <Ambiente />
      <MenuLaboratorio destinos={destinos} />
      <ContactoFijo email={perfil.email} linkedin={enlace("LinkedIn")} github={enlace("GitHub")} cv={perfil.cv} />
      <BarraCapitulos capitulos={capitulos} />
      <Repisa />
      <Personaje guion={guion} />

      <Escena id={mesa} duracion={0.7} solapar={false}>
        <Mesa proyecto={proyecto} numero={indice + 1} tieneEscenas={Boolean(modulo)} />
      </Escena>
      {modulo && <modulo.Escenas />}
      <Escena id="siguiente" duracion={0.6} cubierta={false}>
        <EscenaSiguiente siguiente={siguiente} numero={((indice + 1) % proyectos.length) + 1} email={perfil.email} />
      </Escena>
    </Recorrido>
  );
}
