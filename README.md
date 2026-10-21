# Laboratorio: portfolio interactivo

Portfolio de Programador y Data Analyst. No es una vitrina estática: cada proyecto
"vive" dentro del sitio como un artefacto que el visitante puede usar, y un
personaje (el científico loco del laboratorio) guía la visita.

Stack: Next.js (App Router) · TypeScript · Tailwind CSS · MDX · GSAP + ScrollTrigger · Lenis.

Publicado en https://portfolio-fermin.vercel.app (cada push a `main` se despliega solo).
Prototipo del recorrido guiado: https://portfolio-fermin.vercel.app/prototipo

## Estructura

```
app/
├─ page.tsx                   ← el laboratorio (home)
└─ proyectos/[slug]/page.tsx  ← página de cada caso (se genera desde el registro)

proyectos/                    ← un módulo autocontenido por proyecto
├─ tipos.ts                   ← qué datos describe cada proyecto
├─ index.ts                   ← registro central
└─ <slug>/
   ├─ meta.ts                 ← ficha: título, categoría, rol, enlaces, orden
   ├─ caso.mdx                ← la historia: problema → proceso → resultado
   ├─ Artefacto.tsx           ← el componente vivo (se inserta desde caso.mdx)
   └─ data/                   ← datos procesados que usa el artefacto

components/
├─ recorrido/                 ← motor del scrollytelling: Recorrido, Escena, Director, barra
├─ laboratorio/               ← piezas de la escena (marco del artefacto, tarjetas)
└─ personaje/                 ← el científico (SVG v0, poses, globo de diálogo, guion)

public/
├─ proyectos/<slug>/          ← imágenes de cada caso (capturas, escudos…)
└─ personaje/                 ← archivos de animación del personaje

mdx-components.tsx            ← componentes disponibles en todos los caso.mdx
```

## Sumar un proyecto

1. Crear `proyectos/<slug>/` con `meta.ts`, `caso.mdx` y `Artefacto.tsx`.
2. Registrarlo en `proyectos/index.ts`.

La ruta `/proyectos/<slug>` se genera sola.

## Desarrollo

```bash
npm run dev
```
