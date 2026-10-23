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
    panel: "31 de agosto de 2026: arranca el proyecto. La tienda lleva productos, stock y ventas en planillas de Excel. Se escriben seis reglas de trabajo y un plan en olas; el 5 de septiembre están cerradas las 84 tareas, sobre catorce dominios.",
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
    panel: "FutbolShop llevaba el negocio en planillas de Excel: productos, stock por talle, ventas del día, proveedores. El sistema a medida reúne todo en un solo lugar: catálogo con variantes, stock por local, compras, caja, vendedores, clientes, permisos e informes.",
    dice: "Antes: cinco planillas que no se hablaban entre sí. Ahora: un sistema donde cada venta descuenta el stock sola.",
    pose: "senalando",
  },
  {
    panel: `Cómo está hecho: Laravel y PHP en el servidor, Vue y TypeScript en la pantalla, MySQL para los datos. ${MODULO.piezas.map((p) => `${p.cantidad} ${p.nombre}`).join(", ")}. Unas ${n(MODULO.lineas.php)} líneas de PHP, ${n(MODULO.lineas.ts)} de TypeScript y ${n(MODULO.lineas.vue)} de Vue.`,
    dice: "Laravel atrás, Vue adelante, MySQL abajo. Cuarenta y cinco componentes de pantalla y cuarenta y cuatro migraciones de base.",
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
    panel: "Bug 1 · Arrastrabas las categorías, el sistema decía «guardado»… y ninguna pantalla leía ese orden. Venía de antes y nadie lo había notado.",
    dice: "Decía «guardado» y era mentira: el orden se guardaba en un cajón que nadie abría.",
    pose: "sorprendido",
  },
  {
    panel: "Bug 2 · El orden de los productos se guardaba en un tinyint, que llega hasta 127. La categoría Pelotas tiene 168 productos: su orden nunca pudo guardarse.",
    dice: "Ciento veintisiete es el tope de un tinyint. Pelotas tiene ciento sesenta y ocho. Se descubrió contando pelotas, literalmente.",
    pose: "senalando",
  },
  {
    panel: "Bug 3 · El pop-up de reordenar abría vacío: las categorías tienen parent_id = 0 y la consulta pedía IS NULL. Otra pantalla, para lo mismo, preguntaba null OR 0.",
    dice: "Cero no es nulo. Una pantalla lo sabía y la otra lo olvidaba.",
    pose: "quieto",
  },
  {
    panel: "Los tres salieron de abrir la pantalla y usarla con datos reales. Ninguna prueba automática los habría visto: todas verificaban que el código hiciera lo que decía, y el problema era que lo que decía no servía.",
    dice: "Ninguna de las cuatro mil pruebas los vio. Probar a mano también es método, y queda escrito en la bitácora.",
    pose: "eureka",
  },
];
