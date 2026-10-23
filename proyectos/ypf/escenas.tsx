import { EscenaLab as Escena } from "@/components/laboratorio/EscenaLab";
import type { Linea } from "@/components/personaje/guion";
import type { Destino } from "@/components/laboratorio/MenuLaboratorio";
import { FichaTecnica } from "@/components/laboratorio/FichaTecnica";
import { Agosto } from "./escenas/Agosto";
import { Carrera } from "./escenas/Carrera";
import { Consulta } from "./escenas/Consulta";
import { Mapa } from "./escenas/Mapa";
import { PASOS_AGOSTO, PASOS_CARRERA, PASOS_MAPA } from "./data/pasos";
import { meta } from "./meta";

// Sismos en Argentina: el mapa, el mes que rompió la escala, la carrera de
// modelos y la consulta en vivo. PENDIENTE: revisar el guion con Fermín.

const P = meta.slug;

export const guion: Record<string, Linea> = {
  [`mesa-${P}`]: {
    texto: "Diez años de sismos de la Argentina, del catálogo del USGS. Lo hicimos en el programa de Fundación YPF. Bajá, que tiembla.",
    pose: "senalando",
  },
  [`${P}-mapa`]: {
    texto: "Diez años de temblores, un punto por sismo.",
    pose: "senalando",
    pasos: PASOS_MAPA.map((p) => ({ texto: p.dice, pose: p.pose })),
  },
  [`${P}-agosto`]: {
    texto: "Mes a mes, Argentina tiembla unas 46 veces.",
    pose: "quieto",
    pasos: PASOS_AGOSTO.map((p) => ({ texto: p.dice, pose: p.pose })),
  },
  [`${P}-modelos`]: {
    texto: "Primero, el modelo tonto.",
    pose: "quieto",
    pasos: PASOS_CARRERA.map((p) => ({ texto: p.dice, pose: p.pose })),
  },
  [`${P}-consulta`]: {
    texto: "Probá vos: elegí cuántos meses y te digo cuántos sismos esperar. Es estadística, no una bola de cristal.",
    pose: "senalando",
  },
  [`${P}-ficha`]: {
    texto: "La letra chica: USGS, IGN y el repo con los notebooks. Falta la parte no supervisada: ya viene.",
    pose: "quieto",
  },
};

export const dimensiones: NonNullable<Destino["hijos"]> = [
  { escena: `${P}-mapa`, etiqueta: "1 · El mapa" },
  { escena: `${P}-agosto`, etiqueta: "2 · Agosto de 2021" },
  { escena: `${P}-modelos`, etiqueta: "3 · Carrera de modelos" },
  { escena: `${P}-consulta`, etiqueta: "4 · Consulta" },
  { escena: `${P}-ficha`, etiqueta: "Ficha técnica" },
];

export function Escenas() {
  return (
    <>
      <Escena id={`${P}-mapa`} duracion={3.2}>
        <Mapa />
      </Escena>

      <Escena id={`${P}-agosto`} duracion={3.2}>
        <Agosto />
      </Escena>

      <Escena id={`${P}-modelos`} duracion={3.2}>
        <Carrera />
      </Escena>

      <Escena id={`${P}-consulta`} duracion={1.4}>
        <Consulta />
      </Escena>

      <Escena id={`${P}-ficha`} duracion={0.8}>
        <FichaTecnica
          proyecto={meta}
          filasExtra={[
            {
              etiqueta: "Fuentes",
              contenido:
                "USGS Earthquake Catalog (API fdsnws, 2016-09-15 a 2026-09-15) · Capas SIG del IGN: provincias, plataforma continental y límites · Contexto tectónico: Bird (2003)",
            },
            {
              etiqueta: "En proceso",
              contenido: "Modelo no supervisado: agrupar regiones por su comportamiento sísmico, como base para futuros análisis de riesgo.",
            },
          ]}
        />
      </Escena>
    </>
  );
}
