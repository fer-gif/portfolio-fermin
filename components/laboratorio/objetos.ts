"use client";

import type { Director } from "@/components/recorrido";
import type { Pose } from "@/components/personaje/guion";
import { registrarObjeto } from "./logros";

// Lo que el científico cuenta cuando el visitante toca algo del laboratorio.
// Es el "sobre mí" repartido por la escenografía.
// PENDIENTE: que Fermín revise o reescriba cada frase con lo suyo.

export interface Objeto {
  id: string;
  nombre: string;
  texto: string;
  pose: Pose;
}

export const OBJETOS: Objeto[] = [
  { id: "surf", nombre: "el cuadro del surf", texto: "Surfeo desde chico. Cuando hay olas en Necochea, el laboratorio espera.", pose: "eureka" },
  { id: "jiujitsu", nombre: "el cuadro del jiu-jitsu", texto: "Jiu-jitsu: el deporte donde aprendés más perdiendo que ganando. Igual que programar.", pose: "senalando" },
  { id: "rugby", nombre: "el cuadro del rugby", texto: "Rugby. Quince tipos, un plan, y el plan dura hasta el primer tackle. Como un sprint.", pose: "sorprendido" },
  { id: "kimono", nombre: "el kimono", texto: "Ese kimono es el mío. Entreno después de cerrar el laboratorio. Todavía huele a tatami.", pose: "senalando" },
  { id: "tabla", nombre: "la tabla de surf", texto: "La tabla siempre lista: Necochea tiene mar a diez cuadras. Sería un pecado no usarla.", pose: "eureka" },
  { id: "estante", nombre: "el estante de frascos", texto: "Los frascos del estante son experimentos viejos: cosas que probé y no salieron. También cuentan.", pose: "quieto" },
  { id: "pan", nombre: "el pan de la mesada", texto: "Masa madre. Cocinar es como programar: seguís la receta, igual falla, y aprendés por qué.", pose: "senalando" },
];

/** El visitante tocó un objeto: el científico lo cuenta y queda registrado. */
export function tocarObjeto(id: string, director: Director) {
  const objeto = OBJETOS.find((o) => o.id === id);
  if (!objeto) return;
  director.decir(objeto.texto, objeto.pose, 7000);
  registrarObjeto(id);
}

// Lo que dice el científico cuando lo tocan a él: datos, pistas y algún chiste.
// PENDIENTE: que Fermín revise las frases que hablan de él.
const FRASES_CIENTIFICO: { texto: string; pose: Pose }[] = [
  { texto: "Soy Fermín. Bueno, la versión de laboratorio: más pelo, mismas ideas.", pose: "senalando" },
  { texto: "Programo y analizo datos. Y los domingos, si hay olas, me ven en el mar.", pose: "eureka" },
  { texto: "Los frascos de la mesada son las tecnologías de cada proyecto. Caen solos, no los tires.", pose: "senalando" },
  { texto: "Pista: en Zona Fría podés calcular tu propia factura de gas. Después no digas que no avisé.", pose: "senalando" },
  { texto: "Hay cosas en la pared que se pueden tocar. No todas. Averiguá cuáles.", pose: "sorprendido" },
  { texto: "El pan de la mesada es masa madre. Tarda 24 horas. Como un buen deploy.", pose: "quieto" },
  { texto: "Dato: la mitad de los sismos de Argentina pasan en unas islas chiquitas al sur. Bajá hasta la mesa 5.", pose: "sorprendido" },
  { texto: "Un modelo que no le gana al promedio también es un resultado. Lo cuento en Sismos.", pose: "quieto" },
  { texto: "Si estás apurado: arriba a la derecha dice «saltar a». No me ofendo.", pose: "senalando" },
  { texto: "¿Reclutador? El mail está arriba a la izquierda. Se copia solo.", pose: "eureka" },
  { texto: "Cada experimento que probás se guarda en la repisa de arriba. Coleccionalos.", pose: "senalando" },
  { texto: "Iba a decir mi frase famosa, pero tiene derechos de autor.", pose: "quieto" },
];

let ultimaFrase = -1;

/** Una frase al azar, nunca la misma dos veces seguidas. */
export function fraseDelCientifico(): { texto: string; pose: Pose } {
  let i = Math.floor(Math.random() * FRASES_CIENTIFICO.length);
  if (i === ultimaFrase) i = (i + 1) % FRASES_CIENTIFICO.length;
  ultimaFrase = i;
  return FRASES_CIENTIFICO[i];
}

// Lo que dice cuando el visitante hace algo raro.
export const REACCIONES = {
  inactivo: { texto: "¿Seguís ahí? Tocá algo, no muerde.", pose: "sorprendido" as Pose },
  apurado: { texto: "¡Pará, pará, que te perdés lo mejor!", pose: "sorprendido" as Pose },
  tituloAusente: "¡Volvé al laboratorio! 🧪",
};
