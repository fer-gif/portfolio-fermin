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

## Cómo funciona el recorrido

Cada página es un `<Recorrido>` con varias `<Escena>`. Una escena se queda
clavada en pantalla y el scroll avanza su línea de tiempo (GSAP ScrollTrigger +
Lenis). Lo que hay adentro suma animaciones con `useEscena().linea`. El
`Director` sabe en qué escena está el visitante; el `<Personaje>` lee de ahí
su `guion` (texto, pose y lado por escena).

- La primera escena lleva `solapar={false}`; la última, `cubierta={false}`.
  Las demás suben y cubren a la anterior, sin scroll común entre escenas.
- Las escenas tienen fondo opaco y reservan espacio en celular para los
  botones fijos (arriba) y el personaje (abajo).
- Ojo: ScrollTrigger no reserva espacio de pin si el padre es `display: flex`.
  Por eso `<Recorrido>` envuelve todo en un bloque normal.

## Sumar un proyecto

1. Crear `proyectos/<slug>/` con `meta.ts` y, al principio, `caso.mdx` + `Artefacto.tsx`
   (molde genérico).
2. Registrarlo en `proyectos/index.ts`.
3. Cuando el proyecto tenga su experiencia propia, crear `Pagina.tsx` (un
   `<Recorrido>` con sus escenas) y anotarlo en `app/proyectos/[slug]/page.tsx`.
   `futbol-necochea/` es el ejemplo completo.

La ruta `/proyectos/<slug>` se genera sola.

## Desarrollo

```bash
npm run dev
```
