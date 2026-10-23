import type { Pose } from "@/components/personaje/guion";
import { MODULO } from "./sistema";

// Las historias de FutbolShop contadas en pasos: qué dice el panel y qué dice
// el científico en cada uno.
export interface Paso {
  panel: string;
  dice: string;
  pose?: Pose;
}

const n = (v: number) => v.toLocaleString("es-AR");

export const PASOS_LINEA: Paso[] = [
  {
    panel: "31 de agosto de 2026: arranca el repo como fork de NexoPOS, con un módulo propio y seis reglas escritas. El 5 de septiembre están cerradas las 84 tareas del proyecto original, en seis olas sobre catorce dominios.",
    dice: "Del primer commit al cierre de las 84 tareas pasaron seis días. No es magia: es un sistema de trabajo escrito antes de empezar.",
    pose: "senalando",
  },
  {
    panel: `8 de septiembre: la tienda empieza a vender con el sistema. El cliente carga a mano ${n(MODULO.tienda.productos)} productos y ${n(MODULO.tienda.variantes)} variantes. Desde ahí, todo se prueba contra una copia: no hay acceso a la base de producción.`,
    dice: "Tres días después ya vendían con esto. Cuatrocientos productos cargados por el cliente, con sus datos reales. Sin red.",
    pose: "sorprendido",
  },
  {
    panel: "17 de septiembre: el cliente usó el sistema y devolvió catorce pedidos sobre Inventario. Se resolvieron en doce fases chicas, cada una entregable por separado, y subieron a producción el 25.",
    dice: "Después vino lo mejor: el cliente lo usó y pidió catorce cosas. Doce fases y a producción. Así se mejora un sistema vivo.",
    pose: "quieto",
  },
  {
    panel: `Y así hasta hoy: ${MODULO.docs.planes} planes entre septiembre y octubre (caja, vendedores con PIN, permisos, dos locales, devoluciones, cupones, rendimiento) y tres despliegues. Cada plan con sus fases, sus decisiones y su bitácora.`,
    dice: "Veintiún planes y tres despliegues en dos meses. Cada uno con su bitácora: qué se hizo, qué se encontró y por qué.",
    pose: "eureka",
  },
];

export const PASOS_CONSTRUCCION: Paso[] = [
  {
    panel: "Muove Stock es un fork de NexoPOS 6.2.2, un punto de venta libre. Regla número uno: el núcleo no se toca. Todo lo propio vive en un módulo aparte y se engancha por hooks, filtros y eventos. Así el núcleo sigue recibiendo actualizaciones sin conflictos.",
    dice: "El núcleo es de otro y se actualiza solo. Lo nuestro vive al lado y se engancha con ganchos. Si lo tocás, lo pagás para siempre.",
    pose: "senalando",
  },
  {
    panel: `Adentro del módulo: ${MODULO.piezas.map((p) => `${p.cantidad} ${p.nombre}`).join(", ")}. Unas ${n(MODULO.lineas.php)} líneas de PHP, ${n(MODULO.lineas.ts)} de TypeScript y ${n(MODULO.lineas.vue)} de Vue, todo con prefijo propio.`,
    dice: "Cincuenta y dos filtros, sesenta y dos oyentes, cuarenta y cinco componentes. Todo con prefijo propio, para que nadie lo confunda con el núcleo.",
    pose: "quieto",
  },
  {
    panel: `Sin prueba no está hecho, y la prueba se escribe antes: tiene que fallar primero. Hoy son ${n(MODULO.pruebas[0].cantidad)} pruebas de PHP, ${n(MODULO.pruebas[1].cantidad)} de front y ${MODULO.pruebas[2].cantidad} recorridos de navegador.`,
    dice: "Casi cuatro mil quinientas pruebas. La regla: primero la prueba en rojo, después el código que la pone en verde.",
    pose: "senalando",
  },
  {
    panel: `Nada se afirma sin verificarlo en el código, con archivo y línea. Y todo queda escrito: ${MODULO.docs.planes} planes con ${MODULO.docs.fases} fichas de fase, decisiones y bitácoras. ${MODULO.docs.archivos} documentos, ${n(MODULO.docs.lineas)} líneas.`,
    dice: "Y todo escrito: qué se hizo, qué se encontró y por qué. Sesenta y dos mil líneas de documentación. Más que de código PHP.",
    pose: "eureka",
  },
];

export const PASOS_HALLAZGOS: Paso[] = [
  {
    panel: "Bug 1 · Arrastrabas las categorías, el sistema decía «guardado»… y ninguna pantalla leía ese orden. Estaba en el núcleo desde siempre y nadie lo había notado.",
    dice: "Decía «guardado» y era mentira: el orden se guardaba en un cajón que nadie abría.",
    pose: "sorprendido",
  },
  {
    panel: "Bug 2 · El orden de los productos se guardaba en un tinyint, que llega hasta 127. La categoría Pelotas tiene 168 productos: su orden nunca pudo guardarse.",
    dice: "Ciento veintisiete es el tope de un tinyint. Pelotas tiene ciento sesenta y ocho. Se descubrió contando pelotas, literalmente.",
    pose: "senalando",
  },
  {
    panel: "Bug 3 · El pop-up de reordenar abría vacío: las categorías tienen parent_id = 0 y la consulta pedía IS NULL. El propio núcleo se contradecía, porque para el POS preguntaba null OR 0.",
    dice: "Cero no es nulo. El núcleo lo sabía en una pantalla y lo olvidaba en la otra.",
    pose: "quieto",
  },
  {
    panel: "Los tres salieron de abrir la pantalla y usarla con datos reales. Ninguna prueba automática los habría visto: todas verificaban que el código hiciera lo que decía, y el problema era que lo que decía no servía.",
    dice: "Ninguna de las cuatro mil pruebas los vio. Probar a mano también es método, y queda escrito en la bitácora.",
    pose: "eureka",
  },
];
