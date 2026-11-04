"use client";

import { createContext } from "react";
import type { gsap } from "./gsap";

// Lo que cada Escena le pasa a lo que tiene adentro: su nombre y su línea de
// tiempo. Vive aparte para que el Director pueda leer en qué escena está cada
// componente sin importar Escena.tsx (que ya importa al Director).
export interface ContextoEscena {
  id: string;
  linea: gsap.core.Timeline;
}

export const EscenaContext = createContext<ContextoEscena | null>(null);
