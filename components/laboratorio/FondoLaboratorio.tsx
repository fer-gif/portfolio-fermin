"use client";

import { useState } from "react";
import { useDirector } from "@/components/recorrido";
import { CapaDeObjetos } from "./CapaDeObjetos";
import { Escenografia } from "./Escenografia";
import { tocarObjeto } from "./objetos";

// El laboratorio, fijo detrás de todo el recorrido: pared azulejada, piso,
// estante, lámpara, cuadros, kimono y tabla. No se mueve nunca; las escenas
// (transparentes) pasan por delante. Y por delante de todo, invisible, la capa
// con las zonas que el visitante puede tocar.
export function FondoLaboratorio() {
  const director = useDirector();
  const [activo, setActivo] = useState<string | null>(null);
  const [tocado, setTocado] = useState<string | null>(null);

  const tocar = (id: string) => {
    tocarObjeto(id, director);
    setTocado(id);
    setTimeout(() => setTocado((t) => (t === id ? null : t)), 800);
  };

  return (
    <>
      <div aria-hidden className="fondo-laboratorio pointer-events-none fixed inset-0 z-0">
        <Escenografia activo={activo} tocado={tocado} />
      </div>
      <CapaDeObjetos onEntrar={setActivo} onSalir={() => setActivo(null)} onTocar={tocar} />
    </>
  );
}
