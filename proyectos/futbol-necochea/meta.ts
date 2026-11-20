import type { Proyecto } from "../tipos";

export const meta: Proyecto = {
  slug: "futbol-necochea",
  titulo: "Fútbol de Necochea",
  categoria: "principal",
  estado: "publicado",
  autoria: "individual",
  rol: "Desarrollo integral: recolección y normalización de datos, base de datos, API, paneles y widget embebible",
  queHice: [
    "Relevé y normalicé los datos de la Liga Necochea (16 clubes en dos zonas), que antes solo existían como texto plano en notas y planillas.",
    "Diseñé la base PostgreSQL en Supabase (14 tablas, RLS, trigger SQL para el Prode y métricas) junto con los endpoints cacheados en Next.js.",
    "Desarrollé el widget embebible <futbol-widget> (Web Component con Shadow DOM), los paneles con carga móvil en vivo desde la cancha y el Prode.",
  ],
  resultado:
    "En producción en Data eNe con los 16 clubes de la Liga Necochea (Zonas A y B): tabla de posiciones calculada automáticamente desde partidos finalizados, widget embebible sin dependencias, carga en vivo desde la cancha y Prode con ligas privadas.",
  creditos: "Data eNe y Muove, con respaldo de VorkNews",
  gancho: "Plataforma, API y widget en vivo del fútbol de Necochea, hoy en producción en Data eNe.",
  resumen:
    "Los datos del fútbol de Necochea solo existían en los diarios locales en formato de texto, planillas sueltas y desordenadas. Armé un sistema para acomodar y administrar todos los datos del Fútbol de Necochea, a través de base de datos, creación de API, partidos en vivo y el widget embebible que usa Data eNe.",
  artefacto:
    "Comparar cómo se veía antes en los diarios y cómo se ve ahora, probar cómo administré los nombres de los equipos y consultar la API en vivo.",
  stack: ["Next.js 16 · React 19", "TypeScript", "Tailwind 4", "Web Components", "PostgreSQL · Supabase", "Vercel"],
  codigo: "https://github.com/fer-gif/widget-futbol-muove",
  enlaces: [],
  orden: 1,
};
