"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const CONSULTA = "(prefers-reduced-motion: reduce)";

function suscribirMovimiento(fn: () => void) {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener("change", fn);
  return () => mq.removeEventListener("change", fn);
}

/** true si el visitante pidió reducir el movimiento en su sistema. */
export function useReducirMovimiento(): boolean {
  return useSyncExternalStore(
    suscribirMovimiento,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}

/** Devuelve el texto escribiéndose letra por letra. Reinicia al cambiar el texto. */
export function useMaquinaDeEscribir(texto: string, ms = 22) {
  const reducido = useReducirMovimiento();
  const [estado, setEstado] = useState({ texto, n: 0 });

  // Si cambió el texto, arrancamos de cero (patrón de "ajustar estado al cambiar props").
  if (estado.texto !== texto) setEstado({ texto, n: 0 });

  const terminado = reducido || estado.n >= texto.length;

  useEffect(() => {
    if (terminado) return;
    const id = setTimeout(
      () => setEstado((e) => (e.texto === texto ? { ...e, n: e.n + 1 } : e)),
      ms,
    );
    return () => clearTimeout(id);
  }, [terminado, estado.n, texto, ms]);

  return {
    visible: reducido ? texto : texto.slice(0, estado.n),
    escribiendo: !terminado,
  };
}
