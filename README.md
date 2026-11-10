# Laboratorio: portfolio interactivo

Portfolio de Programador y Data Analyst. No es una vitrina estática: el sitio
es un laboratorio, guiado por un científico loco (el personaje), donde cada
proyecto es un experimento que se puede usar. La página principal es corta
(portada, quién soy, los experimentos y contacto) y cada experimento tiene su
propia página, a la que se llega por un portal.

Stack: Next.js (App Router) · TypeScript · Tailwind CSS · GSAP + ScrollTrigger · Lenis.

Publicado en https://portfolio-fermin.vercel.app (cada push a `main` se despliega solo).

## Cómo está armado

```
app/page.tsx                  ← la principal: intro → portada → quién soy → vidriera → contacto
app/proyectos/[slug]/page.tsx ← la página de cada experimento: mesa → sus paradas → el que sigue
app/layout.tsx                ← las tres tipografías (Bricolage Grotesque, Martian Mono, Patrick Hand)
app/globals.css               ← paleta del laboratorio, ajustes de cada tipografía y animaciones de ambiente

components/
├─ recorrido/                 ← motor del scrollytelling: Recorrido, Escena, Director, barra
├─ laboratorio/               ← la carcasa: Cortina (intro), EscenaPortada, EscenaPresentacion
│                                (con RetratoCientifico), EscenaVidriera, EscenaContacto, Mesa,
│                                EscenaSiguiente (el final de cada proyecto),
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

lib/perfil.ts                 ← nombre, presentación, contactos, repo, ruta del CV y "con qué trabajo"
lib/tecnologias.ts            ← qué logo lleva cada tecnología (nombre → archivo de public/logos/)
public/logos/                 ← logos originales de cada tecnología (Devicon v2.17.0, MIT)
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
  Las demás arrancan donde termina la anterior. Al final de cada escena hay
  media pantalla de salida (`SALIDA` en `Escena.tsx`). Hay dos transiciones:
  - **Relevo**, entre escenas de un mismo proyecto: lo que había sube y se
    apaga; lo nuevo sube y se enciende.
  - **Portal** (hoy sin uso: era el paso entre proyectos cuando todo estaba
    en una sola página): la escena que llega lleva `entrada="portal"`. Se
    abre un portal verde en el medio que se traga la escena anterior (la anterior se entera sola: mira si
    la siguiente tiene `data-entrada="portal"`), y la tarjeta del proyecto
    nuevo sale girando de ahí (`Mesa.tsx`). El dibujo está en `Portal.tsx`.
- Cada escena dice dónde aterriza un salto (`data-llegada`): el menú, la barra
  de capítulos y los enlaces `#escena` llevan a ese punto, con el contenido ya
  a la vista, y no al borde (donde la escena todavía está vacía).
- **La página principal.** `entrada` (`EscenaPortada`): "el
  portafolio de Fermín, Programador y Data Analyst", nada más. `quien-soy`
  (`EscenaPresentacion`): el saludo y dos frases de `perfil.sobreMi`, los
  lenguajes con su logo y el retrato de Fermín en versión científico
  (`RetratoCientifico`, un SVG). `experimentos` (`EscenaVidriera`): todos los
  proyectos como tarjetas sobre una mesada (en celular, una lista); cada
  tarjeta usa `gancho` de su `meta.ts` y es un link a su página. `contacto`
  (`EscenaContacto`): el mail (para copiar), LinkedIn, GitHub y el CV.
- **El viaje por portal entre páginas.** Tocar una tarjeta de la vidriera, "el
  que sigue" al final de un proyecto, "volver al laboratorio" o un proyecto
  del menú llama a `viajar(href)` (`components/recorrido/viajes.ts`).
  `<Viaje>` vive en el layout raíz para sobrevivir al cambio de página y lo
  hace en dos View Transitions: en la ida, el portal se traga la foto de la
  pantalla y queda el vacío (`.viaje-vacio`) con el portal girando; mientras,
  se cambia de página. Cuando la nueva avisa que está armada
  (`avisarLlegada()` desde `<Recorrido>`), en la vuelta sale girando del
  portal y el portal se cierra. La tarjeta de la mesa sale del portal recién
  cuando la página se ve (`cuandoSeVea`). CSS en `globals.css`, "el viaje por
  portal". La intro de la puerta solo se ve al entrar al sitio.
- **El salto por portal dentro de una página.** El menú o un capítulo
  (`director.irA`) pasa por `saltar()` en `Recorrido.tsx`. Con View
  Transitions, el navegador fotografía la pantalla entera y, aparte, el portal
  abierto (`view-transition-name: salto-portal`); la página real ya cambia de
  lugar sin desfilar por las escenas del medio, y el CSS (`globals.css`, "el
  salto por portal") abre el portal, le hace tragarse la foto girando y hace
  salir el destino. Sin View Transitions, el portal se abre, la pantalla se
  llena de verde y se cambia de lugar. Con "reducir movimiento", se salta
  directo.
- **Largo.** La principal mide unas 5 pantallas de scroll. Cada proyecto tiene
  a lo sumo tres paradas después de su mesa: lo que se toca, la historia más
  fuerte y la ficha técnica; las escenas por pasos duran 1,8 pantallas (unas
  0,45 por paso).
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
  el conteo y avisa cada desbloqueo.

## Sumar un proyecto

1. Crear `proyectos/<slug>/meta.ts` (con su `gancho` de una línea para la
   vidriera) y registrarlo en `proyectos/index.ts`. Con eso ya aparece su
   tarjeta en la vidriera y su página (`/proyectos/<slug>`) con su mesa.
2. Cuando tenga experiencia propia, crear `proyectos/<slug>/escenas.tsx` que
   exporte `Escenas`, `guion` y `dimensiones` (ver `futbol-necochea/` o
   `zona-fria/`), y anotarlo en `modulos` dentro de
   `app/proyectos/[slug]/page.tsx`.

Los ids de escena van con el slug adelante (`zona-fria-calculadora`); la mesa
es `mesa-<slug>`. Los links viejos de cuando todo era una página
(`/#mesa-<slug>`, `/#<slug>-<escena>`) llevan a la página del proyecto
(`AnclasViejas`).

En `meta.ts`, `probar` (dónde se usa de verdad) y `codigo` (repo) son los dos
botones grandes de la ficha técnica; `queHice` y `resultado` son las filas que
mira un reclutador. Todo lo que falte simplemente no se muestra.

`stack` se ve dos veces: en la ficha técnica, y en la mesa del proyecto como
frascos que caen y rebotan sobre la mesada, cada uno con el **logo original**
de la tecnología sobre una etiqueta clara (en celular, una fila de logos
dentro de la tarjeta). Un elemento "A · B" o "A + B" son dos frascos; se
muestran hasta nueve. Las fuentes de datos (INDEC, USGS…) van enteras, con un
ícono de datos.

Para sumar un logo: guardar el SVG original en `public/logos/<archivo>.svg` y
anotar el nombre en `LOGOS` de `lib/tecnologias.ts` (en minúsculas y sin
versión: "Laravel 12" busca "laravel"). Lo que no tiene logo lleva un tubo de
ensayo. La caja "con qué trabajo" del modo directo y los lenguajes de "quién
soy" salen de `herramientas` en `lib/perfil.ts`.

### CV descargable

Poner el PDF en `public/cv-fermin-hernando.pdf` y cambiar `cv` en
`lib/perfil.ts` a `"/cv-fermin-hernando.pdf"`. Con eso aparece el botón "CV"
arriba a la izquierda y "descargar CV" en el contacto.

## Rendimiento

El recorrido tiene más de treinta escenas montadas a la vez; cada cuadro
cuenta. Lo que se aprendió midiendo (scroll de punta a punta con Chrome):

- **Nada de animaciones CSS dentro de un `<svg>`** que esté siempre a la
  vista: obligan a repintar el dibujo entero en cada cuadro. Lo que se mueve
  todo el tiempo va en una capa propia (la lámpara y el kimono son
  `.capa-hamaca`, con el punto de giro calculado en `globals.css`); lo que solo
  importa en una escena se pausa fuera de ella (`.escena-activa`).
- `usePasoActual` solo escucha a la escena que lo contiene: si escuchara a
  todas, un gráfico se redibujaría cada vez que avanza cualquier otra escena.
- En datos con miles de elementos (el mapa de sismos), el color y la
  transparencia van en el grupo, no en cada punto.
- Las escenas que no están en pantalla llevan `content-visibility: hidden` y
  su contenido se apaga con `autoAlpha` (no se pinta ni recibe clics).
- Sin `backdrop-blur` sobre contenido que se mueve, sin `mix-blend-mode` a
  pantalla completa y sin filtros SVG de ruido: el grano es `public/grano.png`.
- Rive dibuja a 30 cuadros por segundo (`limitarCuadros` en
  `PersonajeRive.tsx`) y su motor (2 MB) se pide recién terminada la intro.
- Lenis ya suaviza el scroll: las escenas usan `scrub: true`.

## Desarrollo

```bash
npm run dev
```

`npm run dev` es mucho más lento que el sitio publicado. Para juzgar la
fluidez, usar `npm run build && npm start`.
