"use client";

import { useEffect } from "react";

// Las páginas de proyecto no tienen intro: lo que espera a que se abra la
// puerta (el científico, la repisa, el personaje de Rive) aparece de una.
export function SinCortina() {
  useEffect(() => {
    document.documentElement.classList.add("intro-lista");
  }, []);
  return null;
}
