import { Escenografia } from "./Escenografia";

// El laboratorio, fijo detrás de todo el recorrido: pared azulejada, piso,
// estante, lámpara, cuadros, kimono y tabla. No se mueve nunca; las escenas
// (transparentes) pasan por delante.
export function FondoLaboratorio() {
  return (
    <div aria-hidden className="fondo-laboratorio pointer-events-none fixed inset-0 z-0">
      <Escenografia />
    </div>
  );
}
