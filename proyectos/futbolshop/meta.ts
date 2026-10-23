import type { Proyecto } from "../tipos";

// Muove Stock para FutbolShop: caja e inventario sobre un fork de NexoPOS
// (repo privado MuoveAgencia/futbolshop). Números medidos el 23/10/2026.
// PENDIENTE: que Fermín confirme su rol, "qué hice" y los créditos.
export const meta: Proyecto = {
  slug: "futbolshop",
  titulo: "FutbolShop",
  categoria: "software",
  estado: "publicado",
  autoria: "equipo",
  rol: "Desarrollo del módulo, las pruebas y la documentación, con un sistema de trabajo escrito: reglas, planes por fases, decisiones y bitácoras.",
  queHice: [
    "Armé el módulo que adapta NexoPOS a la tienda sin tocar el núcleo: hooks, filtros y eventos, con prefijo propio.",
    "Resolví el feedback del cliente en producción en planes por fases: inventario, caja, vendedores con PIN, permisos, dos locales, devoluciones.",
    "Encontré y arreglé tres bugs del núcleo probando a mano con los datos reales, con su prueba y su registro.",
  ],
  resultado:
    "En producción desde el 08/09/2026 en una tienda real con dos locales: 400 productos y 995 variantes cargados por el cliente. 1.969 pruebas de PHP, 2.403 de front y 56 recorridos e2e. 21 planes y tres despliegues en dos meses.",
  creditos: "Agencia Muove, para la tienda FutbolShop (Necochea y Quequén)",
  resumen:
    "Sistema de caja e inventario para una tienda de insumos deportivos, construido como módulo sobre NexoPOS sin tocar el núcleo. En producción desde septiembre de 2026, con el cliente cargando y vendiendo con datos reales.",
  artefacto:
    "Usar una copia de juguete del inventario: buscar mientras escribís, tildar varios y cambiarles el precio, abrir un producto y ajustar su stock con motivo.",
  stack: ["Laravel 12 · PHP 8.3", "Vue 3 · TypeScript", "Tailwind 4 · Vite", "MySQL", "PHPUnit · node:test · Playwright", "NexoPOS 6.2.2 (fork)"],
  enlaces: [{ etiqueta: "NexoPOS, la base", url: "https://github.com/Blair2004/NexoPOS" }],
  orden: 3,
};
