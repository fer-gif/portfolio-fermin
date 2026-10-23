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
│                                MenuLaboratorio ("saltar a"), ContactoFijo (mail/LinkedIn/
│                                GitHub/CV arriba a la izquierda), BarraCapitulos (puntos a la
│                                derecha), FichaTecnica (con "probarlo" y "ver el código"),
│                                Ambiente, y la escenografía: EscenaLab (escena con pared y piso), Escenografia
│                                (estante y lámpara), Banco (la mesada con tubos y monitor)
└─ personaje/                 ← el científico: SVG v0, poses, globo de diálogo, tipo Guion

proyectos/                    ← un módulo por proyecto
├─ tipos.ts · index.ts        ← ficha de cada proyecto y registro central (orden de las mesas)
└─ <slug>/
   ├─ meta.ts                 ← título, categoría, rol, qué hice, resultado, probar, código, orden
   ├─ escenas.tsx             ← (si el proyecto ya "vive") sus escenas, su guion y sus dimensiones
   ├─ escenas/                ← los componentes de cada escena
   └─ data/                   ← datos procesados

lib/perfil.ts                 ← nombre, presentación, contactos, repo y ruta del CV (null = sin botón)
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
frasco, cuatro poses fijas (quieto, señalando, sorprendido, eureka) y una en
loop (caminando: piernas con pivote en la cadera, braceo y rebote), mezcladas
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
`<Personaje>` lee de ahí su `guion` (texto, pose y `posicion` por escena: de
0, el borde izquierdo, a 1, el derecho). Si la posición cambia entre escenas,
el científico camina hasta ahí a paso constante, mirando hacia donde va, y
recién al llegar habla. Las mesas lo llevan al banco (`POSICION_MESA` en
`app/page.tsx`); las demás escenas lo devuelven a la izquierda.

- El laboratorio (pared, piso, estante, lámpara, cuadros, kimono, tabla) vive
  **fijo detrás de todo** en `FondoLaboratorio`; las escenas son transparentes.
  Así el escenario nunca se mueve: solo entra y sale el contenido.
- La primera escena lleva `solapar={false}`; la última, `cubierta={false}`.
  Las demás arrancan donde termina la anterior. En la pantalla extra del final
  la escena se queda quieta un momento y se apaga; la siguiente viaja invisible
  y aparece recién cuando se clava.
- Las escenas reservan espacio en celular para los botones fijos (arriba) y el
  personaje (abajo).
- La `Cortina` es la intro (el científico empuja la puerta). Se ve una vez por
  sesión y se saltea con `#ancla` o con "reducir movimiento".
- Ojo: ScrollTrigger no reserva espacio de pin si el padre es `display: flex`.
  Por eso `<Recorrido>` envuelve todo en un bloque normal.
- Un panel con scroll propio (calculadora, consulta, ficha técnica) lleva
  `data-desborda`: Lenis le deja la rueda solo cuando su contenido no entra;
  si entra, la página sigue bajando aunque el mouse esté encima.

## La capa de interacción

- **Objetos tocables.** Los dibujos viven en la escenografía (detrás de las
  escenas); `CapaDeObjetos` es una capa invisible por delante con las siluetas
  que reciben el mouse, en el mismo viewBox. Al pasar por encima el objeto se
  asoma (`.objeto.activo`), al tocarlo se sacude y el científico cuenta algo
  (`objetos.ts`, frases por objeto). El pan está en el banco de cada mesa y
  recibe el mouse por su cuenta.
- **El científico habla fuera del guion.** `director.decir(texto, pose, ms)`
  pone una frase por encima de la escena un rato; `useDicho()` la lee. Tocar
  al científico dice una frase al azar (`fraseDelCientifico`). `useReacciones`
  lo hace reaccionar a la inactividad, al scroll a toda velocidad y a irse de
  la pestaña.
- **Experimentos desbloqueados.** `logros.ts` guarda en el navegador qué
  artefactos usó el visitante y qué objetos descubrió (`desbloquear(id)` desde
  cada artefacto, `registrarObjeto(id)` desde los objetos). `Repisa` muestra
  el conteo y avisa cada desbloqueo; la salida lista lo que falta con el
  camino a cada uno.

## Sumar un proyecto

1. Crear `proyectos/<slug>/meta.ts` y registrarlo en `proyectos/index.ts`.
   Con eso ya aparece su mesa en el laboratorio.
2. Cuando tenga experiencia propia, crear `proyectos/<slug>/escenas.tsx` que
   exporte `Escenas`, `guion` y `dimensiones` (ver `futbol-necochea/` o
   `zona-fria/`), y anotarlo en `modulos` dentro de `app/page.tsx`.

Los ids de escena van con el slug adelante (`zona-fria-calculadora`); la mesa
es `mesa-<slug>`. `/proyectos/<slug>` redirige a `/#mesa-<slug>`.

En `meta.ts`, `probar` (dónde se usa de verdad) y `codigo` (repo) son los dos
botones grandes de la ficha técnica; `queHice` y `resultado` son las filas que
mira un reclutador. Todo lo que falte simplemente no se muestra.

`stack` se ve dos veces: en la ficha técnica, y en la mesa del proyecto como
frascos etiquetados que caen y rebotan sobre la mesada (en celular, una línea
dentro de la tarjeta). Un elemento "A · B" son dos frascos; se muestran hasta
nueve.

### CV descargable

Poner el PDF en `public/cv-fermin-hernando.pdf` y cambiar `cv` en
`lib/perfil.ts` a `"/cv-fermin-hernando.pdf"`. Con eso aparece el botón "CV"
arriba a la izquierda y "descargar CV" en la salida.

## Desarrollo

```bash
npm run dev
```
