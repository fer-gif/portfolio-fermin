# Laboratorio: portfolio interactivo

Portfolio de Programador y Data Analyst. No es una vitrina estática: todo el
sitio es **un solo recorrido** por un laboratorio, guiado por un científico
loco (el personaje), donde cada proyecto es un experimento que se puede usar.

Stack: Next.js (App Router) · TypeScript · Tailwind CSS · GSAP + ScrollTrigger · Lenis.

Publicado en https://portfolio-fermin.vercel.app (cada push a `main` se despliega solo).

## Cómo está armado

```
app/page.tsx                  ← el recorrido completo: intro → entrada → mesas → salida
app/globals.css               ← paleta del laboratorio y animaciones de ambiente

components/
├─ recorrido/                 ← motor del scrollytelling: Recorrido, Escena, Director, barra
├─ laboratorio/               ← la carcasa: Cortina (intro), EscenaEntrada, Mesa, EscenaSalida,
│                                MenuLaboratorio ("saltar a"), FichaTecnica, Ambiente
└─ personaje/                 ← el científico: SVG v0, poses, globo de diálogo, tipo Guion

proyectos/                    ← un módulo por proyecto
├─ tipos.ts · index.ts        ← ficha de cada proyecto y registro central (orden de las mesas)
└─ <slug>/
   ├─ meta.ts                 ← título, categoría, rol, créditos, enlaces, orden
   ├─ escenas.tsx             ← (si el proyecto ya "vive") sus escenas, su guion y sus dimensiones
   ├─ escenas/                ← los componentes de cada escena
   └─ data/                   ← datos procesados

lib/perfil.ts                 ← nombre, presentación y contactos
public/proyectos/<slug>/      ← imágenes de cada proyecto
```

## Cómo funciona el recorrido

Cada `<Escena>` se queda clavada en pantalla y el scroll avanza su línea de
tiempo (GSAP ScrollTrigger + Lenis). Lo que hay adentro suma animaciones con
`useEscena().linea`. El `Director` sabe en qué escena está el visitante; el
`<Personaje>` lee de ahí su `guion` (texto, pose y lado por escena).

- La primera escena lleva `solapar={false}`; la última, `cubierta={false}`.
  Las demás suben y cubren a la anterior, sin scroll común entre escenas.
- Las escenas tienen fondo opaco y reservan espacio en celular para los
  botones fijos (arriba) y el personaje (abajo).
- La `Cortina` es la intro (el científico empuja la puerta). Se ve una vez por
  sesión y se saltea con `#ancla` o con "reducir movimiento".
- Ojo: ScrollTrigger no reserva espacio de pin si el padre es `display: flex`.
  Por eso `<Recorrido>` envuelve todo en un bloque normal.

## Sumar un proyecto

1. Crear `proyectos/<slug>/meta.ts` y registrarlo en `proyectos/index.ts`.
   Con eso ya aparece su mesa en el laboratorio.
2. Cuando tenga experiencia propia, crear `proyectos/<slug>/escenas.tsx` que
   exporte `Escenas`, `guion` y `dimensiones` (ver `futbol-necochea/` o
   `zona-fria/`), y anotarlo en `modulos` dentro de `app/page.tsx`.

Los ids de escena van con el slug adelante (`zona-fria-calculadora`); la mesa
es `mesa-<slug>`. `/proyectos/<slug>` redirige a `/#mesa-<slug>`.

## Desarrollo

```bash
npm run dev
```
