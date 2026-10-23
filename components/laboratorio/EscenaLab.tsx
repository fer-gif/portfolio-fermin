import type { ComponentProps } from "react";
import { Escena } from "@/components/recorrido";

// Una Escena del recorrido dentro del laboratorio. La escenografía ya no va
// acá: vive fija detrás de todas las escenas (FondoLaboratorio), así el
// laboratorio queda quieto y solo entra y sale el contenido.
export function EscenaLab(props: ComponentProps<typeof Escena>) {
  return <Escena {...props} />;
}
