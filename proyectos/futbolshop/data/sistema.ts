// Los números del proyecto, medidos sobre el repositorio el 23/10/2026
// (modules/FutbolShop y docs/, sin pruebas ni e2e en las líneas de código).
export const MODULO = {
  lineas: { php: 57902, ts: 41881, vue: 15333 },
  piezas: [
    { clave: "filtros", cantidad: 52, nombre: "filtros" },
    { clave: "oyentes", cantidad: 62, nombre: "oyentes de eventos" },
    { clave: "hooks", cantidad: 10, nombre: "hooks" },
    { clave: "migraciones", cantidad: 44, nombre: "migraciones" },
    { clave: "modelos", cantidad: 20, nombre: "modelos" },
    { clave: "componentes", cantidad: 45, nombre: "componentes Vue" },
  ],
  pruebas: [
    { clave: "php", cantidad: 1969, nombre: "pruebas de PHP", detalle: "232 archivos" },
    { clave: "front", cantidad: 2403, nombre: "pruebas de front", detalle: "lógica pura, node:test" },
    { clave: "e2e", cantidad: 56, nombre: "recorridos e2e", detalle: "Playwright" },
  ],
  docs: { archivos: 185, lineas: 62645, planes: 21, fases: 49 },
  tienda: { productos: 400, variantes: 995, produccion: "08/09/2026", locales: 2 },
};

export interface Hito {
  fecha: string;
  etiqueta: string;
  detalle: string;
  /** A qué paso de la narración pertenece. */
  grupo: number;
}

export const HITOS: Hito[] = [
  { fecha: "31/08", etiqueta: "Arranca el repo", detalle: "Fork de NexoPOS 6.2.2, módulo propio y las seis reglas.", grupo: 0 },
  { fecha: "05/09", etiqueta: "84 tareas cerradas", detalle: "Seis olas sobre catorce dominios: productos, variantes, stock, compras, POS, clientes, contabilidad…", grupo: 0 },
  { fecha: "08/09", etiqueta: "En producción", detalle: "La tienda empieza a vender con el sistema. El cliente carga 400 productos y 995 variantes a mano.", grupo: 1 },
  { fecha: "17/09", etiqueta: "Catorce pedidos del cliente", detalle: "Feedback sobre Inventario, resuelto en doce fases: pop-ups, acciones masivas, ajuste de stock nuevo.", grupo: 2 },
  { fecha: "25/09", etiqueta: "Primer despliegue de mejoras", detalle: "Con respaldo de la base antes de traer el código, migraciones solo aditivas e idempotentes.", grupo: 2 },
  { fecha: "24/09 → 10/10", etiqueta: "La caja y los vendedores", detalle: "Cobro en pocos clics, vendedor con PIN, búsqueda mientras escribís, propiedades, devoluciones.", grupo: 3 },
  { fecha: "15/10 → 19/10", etiqueta: "Permisos, dos locales, cupones", detalle: "Roles y permisos, ventas en espera, caja por local, pantalla de ingreso, notas de crédito.", grupo: 3 },
  { fecha: "22/10", etiqueta: "Tercer despliegue", detalle: "Plan de rendimiento medido en el Chrome del cliente. Veintiún planes en total, cada uno con bitácora y decisiones.", grupo: 3 },
];

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
    causa: "El núcleo guardaba el orden en la base, pero ninguna pantalla lo consultaba: ni el POS ni el panel.",
    arreglo: "El módulo lee ese orden y lo aplica en los dos lugares. Hoy el orden manda.",
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
    causa: "Las categorías tienen parent_id = 0 y el endpoint buscaba IS NULL. El propio núcleo se contradice: para el POS pregunta null OR 0.",
    arreglo: "Un filtro del módulo que consulta como lo hace el POS.",
    visual: "vacio",
  },
];
