
export interface Hallazgo {
  titulo: string;
  sintoma: string;
  causa: string;
  arreglo: string;
  visual: "orden" | "tope" | "vacio";
}

export const HALLAZGOS: Hallazgo[] = [
  {
    titulo: "El orden que nadie leía",
    sintoma: "Arrastrabas las categorías, el sistema decía «guardado», y no cambiaba nada en ningún lado.",
    causa: "El orden se guardaba en la base, pero ninguna pantalla lo consultaba: ni la caja ni el panel.",
    arreglo: "Las dos pantallas leen ese orden. Hoy el orden manda.",
    visual: "orden",
  },
  {
    titulo: "El tope de 127",
    sintoma: "La categoría Pelotas nunca pudo guardar el orden de sus productos.",
    causa: "La columna position era tinyint: llega hasta 127. Pelotas tiene 168 productos.",
    arreglo: "Una migración aditiva que ensancha la columna. Se descubrió probando a mano con datos reales.",
    visual: "tope",
  },
  {
    titulo: "El pop-up vacío",
    sintoma: "La ventana para reordenar categorías abría siempre vacía.",
    causa: "Las categorías tienen parent_id = 0 y la consulta pedía IS NULL. Otra pantalla, para lo mismo, preguntaba null OR 0.",
    arreglo: "Una sola forma de preguntar, la que funciona, en los dos lugares.",
    visual: "vacio",
  },
];
