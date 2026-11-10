import { BarraProgreso, Recorrido } from "@/components/recorrido";
import { Personaje } from "@/components/personaje/Personaje";
import type { Guion, Linea } from "@/components/personaje/guion";
import { Ambiente } from "@/components/laboratorio/Ambiente";
import { AnclasViejas } from "@/components/laboratorio/AnclasViejas";
import { BarraCapitulos, type Capitulo } from "@/components/laboratorio/BarraCapitulos";
import { ContactoFijo } from "@/components/laboratorio/ContactoFijo";
import { Cortina } from "@/components/laboratorio/Cortina";
import { EscenaLab as Escena } from "@/components/laboratorio/EscenaLab";
import { EscenaContacto } from "@/components/laboratorio/EscenaContacto";
import { EscenaPortada } from "@/components/laboratorio/EscenaPortada";
import { EscenaPresentacion } from "@/components/laboratorio/EscenaPresentacion";
import { EscenaVidriera } from "@/components/laboratorio/EscenaVidriera";
import { FondoLaboratorio } from "@/components/laboratorio/FondoLaboratorio";
import { MenuLaboratorio, type Destino } from "@/components/laboratorio/MenuLaboratorio";
import { Repisa } from "@/components/laboratorio/Repisa";
import { perfil } from "@/lib/perfil";
import { proyectos } from "@/proyectos";

// La página principal es corta: portada → quién soy → los experimentos →
// contacto. Cada experimento vive en su propia página (app/proyectos/[slug]),
// a la que se llega por el portal.

// Lo que dice el científico en cada pantalla.
// PENDIENTE: revisar el tono con Fermín.
const escenas: Record<string, Linea> = {
  entrada: { texto: `Hola, soy ${perfil.nombre}. Bienvenido a mi laboratorio.` },
  "quien-soy": { texto: "El de la foto soy yo, versión laboratorio.", pose: "senalando" },
  experimentos: {
    texto: "Cada proyecto es un experimento que se puede tocar. Elegí uno y te llevo por el portal.",
    pose: "senalando",
  },
  contacto: { texto: "Si querés hablar, acá estoy.", pose: "eureka" },
};

const guion: Guion = {
  inicial: { texto: `Hola, soy ${perfil.nombre}. Bienvenido a mi laboratorio.` },
  escenas,
};

const destinos: Destino[] = [
  { escena: "entrada", etiqueta: "Inicio" },
  { escena: "quien-soy", etiqueta: "Quién soy" },
  {
    escena: "experimentos",
    etiqueta: "Experimentos",
    hijos: proyectos.map((p) => ({ href: `/proyectos/${p.slug}`, etiqueta: p.titulo })),
  },
  { escena: "contacto", etiqueta: "Contacto" },
];

const capitulos: Capitulo[] = [
  { escena: "entrada", etiqueta: "Inicio" },
  { escena: "quien-soy", etiqueta: "Quién soy" },
  { escena: "experimentos", etiqueta: "Experimentos" },
  { escena: "contacto", etiqueta: "Contacto" },
];

const enlace = (etiqueta: string) => perfil.enlaces.find((e) => e.etiqueta === etiqueta)?.url ?? "#";

export default function Laboratorio() {
  return (
    <Recorrido>
      <AnclasViejas slugs={proyectos.map((p) => p.slug)} />
      <FondoLaboratorio />
      <Cortina />
      <BarraProgreso />
      <Ambiente />
      <MenuLaboratorio destinos={destinos} />
      <ContactoFijo email={perfil.email} linkedin={enlace("LinkedIn")} github={enlace("GitHub")} cv={perfil.cv} />
      <BarraCapitulos capitulos={capitulos} />
      <Repisa />
      <Personaje guion={guion} esperarIntro />

      <Escena id="entrada" duracion={0.5} solapar={false}>
        <EscenaPortada nombre={perfil.nombre} titulo={perfil.titulo} />
      </Escena>
      <Escena id="quien-soy" duracion={0.8}>
        <EscenaPresentacion
          sobreMi={perfil.sobreMi}
          lenguajes={perfil.herramientas.find((h) => h.grupo === "lenguajes")?.items ?? []}
        />
      </Escena>
      <Escena id="experimentos" duracion={0.7}>
        <EscenaVidriera proyectos={proyectos} />
      </Escena>
      <Escena id="contacto" duracion={0.6} cubierta={false}>
        <EscenaContacto
          frase={perfil.contacto}
          email={perfil.email}
          enlaces={perfil.enlaces}
          cv={perfil.cv}
          repositorio={perfil.repositorio}
        />
      </Escena>
    </Recorrido>
  );
}
