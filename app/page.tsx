import { BarraProgreso, Escena, Recorrido } from "@/components/recorrido";
import { Personaje } from "@/components/personaje/Personaje";
import type { Guion } from "@/components/personaje/guion";
import { Ambiente } from "@/components/laboratorio/Ambiente";
import { EscenaEntrada } from "@/components/laboratorio/EscenaEntrada";
import { EscenaSalida } from "@/components/laboratorio/EscenaSalida";
import { Mesa } from "@/components/laboratorio/Mesa";
import { MenuLaboratorio } from "@/components/laboratorio/MenuLaboratorio";
import { perfil } from "@/lib/perfil";
import { proyectos } from "@/proyectos";

// Lo que dice el científico en cada parada del laboratorio.
// PENDIENTE: revisar el tono con Fermín.
const guion: Guion = {
  inicial: { texto: `Hola, soy ${perfil.nombre}. Bienvenido a mi laboratorio.` },
  escenas: {
    entrada: {
      texto: "Acá adentro cada proyecto es un experimento que podés tocar. Vení, te muestro.",
      pose: "senalando",
    },
    "mesa-futbol-necochea": {
      texto: "Mi experimento favorito. El fútbol de Necochea no existía en ninguna computadora. Ahora sí.",
      pose: "senalando",
    },
    "mesa-argentina-brasil": {
      texto: "¿Cuánto depende Argentina de Brasil? Elegí un sector y mirá lo que pasa.",
      pose: "quieto",
    },
    "mesa-futbolshop": {
      texto: "Un inventario real, de un cliente real. Acá te doy una copia para que la rompas tranquilo.",
      pose: "senalando",
    },
    "mesa-zona-fria": {
      texto: "Clima más tarifas: cuánto le cuesta a una familia de Junín que le saquen la Zona Fría.",
      pose: "quieto",
    },
    "mesa-ypf": {
      texto: "Esto todavía está en el tubo de ensayo. No toques nada.",
      pose: "sorprendido",
    },
    salida: {
      texto: "Eso es todo por ahora. Si querés hablar, acá estoy.",
      pose: "eureka",
    },
  },
};

const destinos = [
  { escena: "entrada", etiqueta: "Entrada" },
  ...proyectos.map((p) => ({ escena: `mesa-${p.slug}`, etiqueta: p.titulo })),
  { escena: "salida", etiqueta: "Contacto" },
];

export default function Laboratorio() {
  return (
    <Recorrido>
      <BarraProgreso />
      <Ambiente />
      <MenuLaboratorio destinos={destinos} />
      <Personaje guion={guion} />

      <Escena id="entrada" duracion={1.2} solapar={false}>
        <EscenaEntrada nombre={perfil.nombre} titulo={perfil.titulo} />
      </Escena>

      {proyectos.map((proyecto, i) => (
        <Escena key={proyecto.slug} id={`mesa-${proyecto.slug}`} duracion={1.4}>
          <Mesa proyecto={proyecto} numero={i + 1} />
        </Escena>
      ))}

      <Escena id="salida" duracion={0.8} cubierta={false}>
        <EscenaSalida
          nombre={perfil.nombre}
          presentacion={perfil.presentacion}
          enlaces={perfil.enlaces}
        />
      </Escena>
    </Recorrido>
  );
}
