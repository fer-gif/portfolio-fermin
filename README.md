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
public/personaje/cientifico.riv ← el personaje compilado (sale de rive/cientifico)

rive/cientifico/              ← el personaje como proyecto Rive CLI
├─ generar.mjs                ← genera scene.rml (geometría, animaciones, poses, view model)
├─ scene.rml                  ← el archivo Rive en texto (RML), generado
└─ rive.yaml · AGENTS.md      ← config del CLI e instrucciones para agentes
```

## El personaje en Rive

El científico es un archivo Rive escrito como texto (RML) y compilado con el
[Rive CLI](https://rive.app/docs/cli). `generar.mjs` construye la escena:
cuerpo que respira, pelo que se mece, párpados que parpadean, burbujas en el
frasco, y cuatro poses (quieto, señalando, sorprendido, eureka) mezcladas
por una máquina de estados que lee la propiedad `pose` del view model
`Personaje`. El sitio la cambia con `useViewModelInstanceEnum` en
`components/personaje/PersonajeRive.tsx`; mientras el `.riv` carga se ve el
SVG de `PersonajeSVG.tsx`. La intro (`Cortina`) sigue usando el dibujo SVG
de la pose de empuje.

Para tocar el personaje (requiere el CLI: `irm https://releases.rive.app/cli/install.ps1 | iex`):

```bash
cd rive/cientifico
node generar.mjs                                  # escribe scene.rml
rive . --verify && rive inspect . --summary       # compila y lista problemas
rive . --screenshot=build/eureka.png --data=pose=eureka --advance=40 --viewport=800x680 --fit=contain
rive . --once && cp build/cientifico.riv ../../public/personaje/cientifico.riv
```

El motor WASM de Rive se sirve desde `public/personaje/rive.wasm` (copia de
`node_modules/@rive-app/canvas/rive.wasm`): al actualizar el paquete, volver a
copiarlo. Al cambiar el `.riv`, subir `VERSION` en `PersonajeRive.tsx` para
que el navegador no use la copia en caché.

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
