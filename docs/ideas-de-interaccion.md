# Ideas de interacción: que el visitante toque el laboratorio

Segunda tanda de ideas (23/10/2026), después de que el laboratorio ya tiene
escenografía, personaje que camina, historias paso a paso, contacto fijo y los
cinco proyectos vivos. El foco ahora es otro: **que la persona que entra haga
cosas, y que el laboratorio le responda**.

Lo que se repite en los portfolios que mejor funcionan hoy: una capa escondida
que premia la curiosidad sin molestar al que va apurado (atajos, clics en
objetos, logros por explorar), luz y cursor que reaccionan al mouse, y
pequeñas personalizaciones según quién entra. Fuentes al final.

Cada idea dice **qué ve el visitante**, **cómo se hace** (en simple), el
**esfuerzo** (chico · medio · grande) y **qué necesito de Fermín**.

## A. El laboratorio se puede tocar

| # | Idea | Qué ve el visitante | Cómo se hace | Esfuerzo | Necesito |
|---|---|---|---|---|---|
| 1 | **Objetos clicables** | Pasa el mouse por el cuadro del surf y se inclina; lo toca y el científico cuenta: «Los domingos, si hay olas, me ven en Necochea». Lo mismo con el kimono, los palos de rugby, la tabla, el pan, los frascos del estante, el monitor. Es el "sobre mí" repartido por el laboratorio, sin una sección aburrida | Cada objeto del SVG es un botón con su frase en un archivo de guion; hover = micro-movimiento CSS; clic = el científico lo dice (ya tenemos el globo) | medio | una frase tuya por objeto (8 frases) |
| 2 | **Clic en el científico** | Lo tocás y dice algo distinto cada vez: un dato tuyo, un chiste de laboratorio o una pista («¿probaste la calculadora de gas?») | Lista de frases + elegir una al azar sin repetir | chico | 10–15 frases (puedo proponerlas) |
| 3 | **Arrastrar cosas de la mesada** | Agarrás un frasco de tecnología y lo movés; cuando lo soltás vuelve a su lugar rebotando. El pan se corta: cada clic saca una rebanada | GSAP Draggable (viene con GSAP) + animación de vuelta; el pan son 4 estados del dibujo | medio | nada |
| 4 | **Cursor del laboratorio** | El puntero es una pipeta verde con una estela de gotitas; sobre los botones se vuelve un círculo que "agarra" | Un div fijo que sigue al mouse con suavizado; solo donde hay mouse (en celular no) | chico | nada |

## B. El laboratorio reacciona a la persona

| # | Idea | Qué ve el visitante | Cómo se hace | Esfuerzo | Necesito |
|---|---|---|---|---|---|
| 5 | **La lámpara sigue al mouse** | El cono de luz se inclina hacia donde está el cursor, y lo que queda bajo la luz brilla un poco más (referencias: los efectos "flashlight" de Awwwards) | Una variable CSS con la posición del mouse; el cono rota con `transform`; una máscara radial suave sobre la escena | chico | nada |
| 6 | **El científico se aburre o se asusta** | Si te quedás 20 s sin hacer nada: «¿Seguís ahí? Tocá algo, no muerde». Si scrolleás a toda velocidad: «¡Pará, pará, que te perdés lo mejor!». Si te vas a otra pestaña, el título de la pestaña dice «¡volvé al laboratorio!» | Temporizador de inactividad, medir velocidad de scroll, evento `visibilitychange` | chico | nada |
| 7 | **Día y noche en la ventana** | Una ventana en la pared con el mar de Necochea: sol a la mañana, atardecer a la tarde, luna y la lámpara prendida de noche. El científico saluda según la hora | La hora del navegador del visitante elige una de 3 variantes del SVG | chico-medio | nada |
| 8 | **Micro-interacciones** | La tarjeta de cada mesa se inclina apenas siguiendo el mouse; los botones se "aplastan" al apretar; los tubos burbujean más rápido cuando pasás por encima; las luces de estado parpadean más al scrollear | CSS y un par de listeners; se van sumando de a poco | chico (acumulativo) | nada |

## C. El visitante se lleva algo

| # | Idea | Qué ve el visitante | Cómo se hace | Esfuerzo | Necesito |
|---|---|---|---|---|---|
| 9 | **Experimentos desbloqueados** | Cada cosa que usa (la calculadora, el dependómetro, la consulta de sismos, el inventario, el widget, cada objeto que descubre) suma un frasco a una repisa chiquita arriba a la derecha. En la salida: «desbloqueaste 6 de 11 experimentos», con links a los que faltan. Da un motivo para tocar todo | Un registro en el navegador (localStorage) + eventos desde cada artefacto + la repisa en el Ambiente | medio | nada |
| 10 | **Resultados para compartir** | En la calculadora de gas, el dependómetro y la consulta de sismos: botón «copiar resultado» y un link que abre esa escena con tu valor puesto (`?meses=6`) | Leer y escribir parámetros de la URL; `navigator.clipboard` (ya lo usamos para el mail) | chico | nada |
| 11 | **Libro de visitas** | «Firmá el cuaderno del laboratorio»: nombre, una línea, y se ve lo que dejaron los demás (como los "whispers" de Bruno Simon) | Necesita una base de datos (Upstash Redis o Supabase por el Marketplace de Vercel) y moderación básica | medio + backend | decidir si querés moderar |

## D. Según quién entra

| # | Idea | Qué ve el visitante | Cómo se hace | Esfuerzo | Necesito |
|---|---|---|---|---|---|
| 12 | **«¿Y vos quién sos?»** | Después de la cortina, el científico pregunta: reclutador · programador · curioso, y un nombre opcional. Te nombra durante todo el recorrido («Mirá esto, Lucía»). Al reclutador le ofrece el atajo: «en dos minutos: las cinco fichas, el CV y el contacto» | Se guarda en el navegador; el guion ya admite texto dinámico; el atajo es una ruta de escenas | medio | nada |
| 13 | **Modo directo** | Botón «sin vueltas» que apaga el recorrido y muestra todo como una página normal: proyectos, fichas, contacto. Para quien entra desde el celular con apuro o desde un link en un mail | Una vista alternativa que reusa las fichas técnicas | medio | nada |
| 14 | **Atajos y easter eggs** | Flechas ← → para pasar de escena, `?` muestra los atajos, escribir `rick` hace que el científico se vuelva loco y abra un portal | Listener de teclado global | chico | nada |

## E. Marca de la casa

| # | Idea | Qué ve el visitante | Cómo se hace | Esfuerzo | Necesito |
|---|---|---|---|---|---|
| 15 | **Portal entre proyectos** | Al terminar la ficha de un proyecto, un portal verde se abre en la pared y la siguiente mesa "sale" de ahí; el científico lo cruza caminando | SVG del portal con anillos girando + coordinarlo con el apagado de la escena y la caminata | medio-grande | nada |
| 16 | **Sonido, apagado por defecto** | Un botón de altavoz: burbujeo suave de fondo, «plic» cuando caen los frascos, zumbido del portal | Web Audio con 3 o 4 sonidos cortos; siempre opcional | chico-medio | nada |

## Prioridad para nosotros

Ordenado por cuánta interacción da contra cuánto cuesta:

1. **Objetos clicables + clic en el científico** (1, 2): es la forma más directa de que la persona "hable" con el laboratorio, y mete tu vida (surf, jiu-jitsu, rugby, pan) sin una sección "sobre mí". Necesito tus frases.
2. **Experimentos desbloqueados** (9): convierte el recorrido en un juego liviano y empuja a probar todos los artefactos. Sin backend.
3. **La lámpara sigue al mouse + cursor pipeta + micro-interacciones** (5, 4, 8): dinamismo barato y constante, se siente en cada pantalla.
4. **El científico se aburre o se asusta** (6): tres frases y el personaje parece vivo.
5. **«¿Y vos quién sos?» + modo directo** (12, 13): lo que un reclutador agradece.
6. **Portal entre proyectos** (15): el momento "guau"; conviene después del dibujo definitivo del personaje.
7. **Resultados para compartir, atajos, día y noche, arrastrar, sonido** (10, 14, 7, 3, 16): detalles para ir sumando.
8. **Libro de visitas** (11): cuando decidamos sumar una base de datos.

## Fuentes

- [Awwwards: Flashlight following the cursor (Killian Herzer)](https://www.awwwards.com/inspiration/flashlight-following-the-cursor-on-hero-killian-herzer-1) · [Interactive illuminating chandelier cursor](https://www.awwwards.com/inspiration/interactive-illuminating-chandelier-cursor) · [Light power cursor (Red Collar)](https://www.awwwards.com/inspiration/light-power-cursor-interaction)
- [Awwwards: Cursor interaction, Cynx Portfolio 2026](https://www.awwwards.com/inspiration/cursor-interaction-cynx-portfolio-2026) · [Easter eggs, Studio Illicit](https://www.awwwards.com/inspiration/easter-eggs-studio-illicit)
- [Speckyboy: el efecto linterna como tendencia](https://speckyboy.com/flashlight-effect-web-design-trend.md)
- [Bolt: portfolio tipo sistema operativo con easter eggs y logros](https://bolt.new/blog/how-to-create-a-macos-style-porfolio-website)
- [Centric: elementos interactivos y gamificación en portfolios](https://centricdxb.com/insights/websites/the-use-of-interactive-elements-and-gamification-in-a-portfolio-website-to-engage-and-entertain-visitors)
- [Webflow: cómo usar gamificación en una web](https://webflow.com/blog/gamification)
- [Framer: plantilla Arcade, logros al explorar](https://www.framer.com/community/posts/UK646pPSMCQYD1vFvtcbUQ/) · [Guigolo: logros guardados en el navegador](https://www.mintlify.com/memorstx/guigolo/concepts/gamification)
- [Bruno Simon](https://bruno-simon.com/) (whispers, logros) · [Hishaam Fataar, portfolio 2026](https://za.linkedin.com/in/hishaam-fataar) (cursor follower con GSAP)
