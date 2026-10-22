import type { ComponentProps } from "react";
import { Escena } from "@/components/recorrido";
import { Escenografia } from "./Escenografia";

// Una Escena del recorrido con la escenografía del laboratorio puesta:
// pared azulejada, piso, estante y lámpara. Todas las escenas del portfolio
// usan esta en vez de la Escena pelada del motor.
export function EscenaLab({ className = "", children, ...resto }: ComponentProps<typeof Escena>) {
  return (
    // `isolate`: la escenografía va en z negativo y necesita el contexto de
    // apilamiento de la sección para quedar sobre su fondo y bajo el contenido.
    <Escena className={`fondo-laboratorio isolate ${className}`} {...resto}>
      <Escenografia />
      {children}
    </Escena>
  );
}
