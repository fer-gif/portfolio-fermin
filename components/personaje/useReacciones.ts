"use client";

import { useEffect } from "react";
import type { Director } from "@/components/recorrido";
import { REACCIONES } from "@/components/laboratorio/objetos";

const INACTIVIDAD_MS = 25000;
const PAUSA_ENTRE_RETOS_MS = 60000;

// El científico reacciona a lo que hace (o no hace) el visitante: si se queda
// quieto mucho tiempo, si scrollea a toda velocidad, si se va a otra pestaña.
export function useReacciones(director: Director) {
  useEffect(() => {
    const introLista = () => document.documentElement.classList.contains("intro-lista");

    // --- inactividad ---
    let ultimaActividad = performance.now();
    let avisado = false;
    const actividad = () => {
      ultimaActividad = performance.now();
      avisado = false;
    };
    const eventos = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;
    eventos.forEach((e) => window.addEventListener(e, actividad, { passive: true }));
    const reloj = setInterval(() => {
      if (document.hidden || !introLista() || avisado) return;
      if (performance.now() - ultimaActividad > INACTIVIDAD_MS) {
        avisado = true;
        director.decir(REACCIONES.inactivo.texto, REACCIONES.inactivo.pose, 7000);
      }
    }, 1000);

    // --- scroll a toda velocidad (más de tres pantallas por segundo) ---
    let ultimoY = window.scrollY;
    let ultimoT = performance.now();
    let ultimoReto = 0;
    const alScroll = () => {
      const ahora = performance.now();
      const dt = ahora - ultimoT;
      const velocidad = Math.abs(window.scrollY - ultimoY) / Math.max(dt, 1); // px/ms
      ultimoY = window.scrollY;
      ultimoT = ahora;
      if (dt > 300 || director.estaSaltando() || !introLista()) return;
      if (velocidad > (window.innerHeight * 3) / 1000 && ahora - ultimoReto > PAUSA_ENTRE_RETOS_MS) {
        ultimoReto = ahora;
        director.decir(REACCIONES.apurado.texto, REACCIONES.apurado.pose, 5000);
      }
    };
    window.addEventListener("scroll", alScroll, { passive: true });

    // --- se fue a otra pestaña ---
    const tituloOriginal = document.title;
    const visibilidad = () => {
      document.title = document.hidden ? REACCIONES.tituloAusente : tituloOriginal;
    };
    document.addEventListener("visibilitychange", visibilidad);

    return () => {
      eventos.forEach((e) => window.removeEventListener(e, actividad));
      clearInterval(reloj);
      window.removeEventListener("scroll", alScroll);
      document.removeEventListener("visibilitychange", visibilidad);
      document.title = tituloOriginal;
    };
  }, [director]);
}
