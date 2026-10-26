import type { Proyecto } from "../tipos";

// FutbolShop: sistema a medida de caja e inventario para una tienda de
// insumos deportivos que llevaba todo en planillas (repo privado de Muove).
// Números medidos el 23/10/2026.
export const meta: Proyecto = {
  slug: "futbolshop",
  titulo: "FutbolShop",
  categoria: "software",
  estado: "publicado",
  autoria: "equipo",
  rol: "Desarrollo del sistema, las pruebas y la documentación, con un sistema de trabajo escrito: reglas, planes por fases, decisiones y bitácoras.",
  queHice: [
    "Armé el sistema que reemplazó las planillas: catálogo con variantes, stock por local, compras, caja, clientes, permisos y dos locales.",
    "Resolví el feedback del cliente en producción en planes por fases: inventario, caja, vendedores con PIN, permisos, devoluciones, cupones.",
    "Encontré y arreglé tres bugs que solo aparecieron con los datos reales, probando a mano, con su prueba y su registro.",
  ],
  resultado:
    "En producción desde el 08/09/2026 en una tienda real con dos locales: 400 productos y 995 variantes cargados por el cliente. 1.969 pruebas de PHP, 2.403 de front y 56 recorridos e2e. 21 planes y tres despliegues en dos meses.",
  creditos: "Agencia Muove, para la tienda FutbolShop (Necochea y Quequén)",
  resumen:
    "FutbolShop manejaba todo el negocio con planillas de Excel. Le hicimos un sistema a medida de caja e inventario: catálogo con variantes, stock, compras, vendedores, clientes y dos locales. En producción desde septiembre de 2026.",
  artefacto:
    "Usar una copia de juguete del inventario: buscar mientras escribís, tildar varios y cambiarles el precio, abrir un producto y ajustar su stock con motivo.",
  stack: ["Laravel 12 · PHP 8.3", "Vue 3 · TypeScript", "Tailwind 4 · Vite", "MySQL", "PHPUnit · node:test · Playwright"],
  enlaces: [],
  orden: 3,
};
