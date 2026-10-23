// Genera scene.rml: el científico del laboratorio como archivo Rive.
// Correr: node generar.mjs  →  luego  rive . --verify
//
// Coordenadas: la figura ocupa 240x300 y va centrada en un artboard de 400x340.
// Poses fijas (quieto, señalando, sorprendido, eureka) y una en loop (caminando).
// La cabeza es un nodo con pivote en el cuello (120,150); sus hijos usan
// coordenadas locales. Los ojos son otro nodo (centro de los ojos) para poder
// agrandarlos. Orden de declaración = de adelante hacia atrás.
import { writeFileSync } from "node:fs";

// ---------- utilidades ----------
let siguiente = 10;
const id = () => `0:${siguiente++}`;
const rad = (grados) => (grados * Math.PI) / 180;
const f = (n) => Number(n.toFixed(3)).toString();

// Sentido horario (y hacia abajo): suma del shoelace > 0.
function esHorario(puntos) {
  let s = 0;
  for (let i = 0; i < puntos.length; i++) {
    const [x1, y1] = puntos[i];
    const [x2, y2] = puntos[(i + 1) % puntos.length];
    s += x1 * y2 - x2 * y1;
  }
  return s > 0;
}

const fill = (color) => `<Fill name="Fill"><SolidColor colorValue="${color}" name="Color"/></Fill>`;
const stroke = (color, grosor) =>
  `<Stroke thickness="${grosor}" cap="round" join="round" name="Stroke"><SolidColor colorValue="${color}" name="Color"/></Stroke>`;

// Polígono cerrado; `radio` redondea todos los vértices.
function poligono(nombre, puntos, color, { radio = 0, extra = "", pintura } = {}) {
  const vs = puntos.map(([x, y]) => `<StraightVertex x="${f(x)}" y="${f(y)}"${radio ? ` radius="${radio}"` : ""}/>`).join("");
  return `<Shape name="${nombre}"${extra}><PointsPath isClosed="true" isClockwise="${esHorario(puntos)}" name="Path">${vs}</PointsPath>${pintura ?? fill(color)}</Shape>`;
}

// Rectángulo centrado en (x, y).
function rect(nombre, x, y, w, h, color, radio = 0, extra = "", origenArriba = false) {
  return `<Shape x="${f(x)}" y="${f(y)}" name="${nombre}"${extra}><Rectangle width="${w}" height="${h}" cornerRadiusTL="${radio}"${origenArriba ? ' originY="0"' : ""} name="Path"/>${fill(color)}</Shape>`;
}

function elipse(nombre, x, y, w, h, color, extra = "", pintura = fill(color)) {
  return `<Shape x="${f(x)}" y="${f(y)}" name="${nombre}"${extra}><Ellipse width="${w}" height="${h}" name="Path"/>${pintura}</Shape>`;
}

// Trazo abierto por puntos; los del medio se redondean con `radio`.
function trazo(nombre, puntos, color, grosor, radio = 8, extra = "") {
  const vs = puntos
    .map(([x, y], i) => `<StraightVertex x="${f(x)}" y="${f(y)}"${i > 0 && i < puntos.length - 1 ? ` radius="${radio}"` : ""}/>`)
    .join("");
  return `<Shape name="${nombre}"${extra}><PointsPath isClosed="false" name="Path">${vs}</PointsPath>${stroke(color, grosor)}</Shape>`;
}

// Trazo abierto con un vértice curvo en el medio (sonrisa).
function arco(nombre, [a, m, b], color, grosor, curva = 10, extra = "") {
  return `<Shape name="${nombre}"${extra}><PointsPath isClosed="false" name="Path"><StraightVertex x="${f(a[0])}" y="${f(a[1])}"/><CubicMirroredVertex x="${f(m[0])}" y="${f(m[1])}" rotation="0" distance="${curva}"/><StraightVertex x="${f(b[0])}" y="${f(b[1])}"/></PointsPath>${stroke(color, grosor)}</Shape>`;
}

// ---------- colores ----------
const PIEL = "FFF1C9A5", PIEL_SOMBRA = "FFDFAE8A", OJERA = "FFC9956F";
const BATA = "FFE9EEF2", BATA_SOMBRA = "FFD5DDE3", CAMISA = "FFCFE3F5", VERDE = "FF7EE35B";
const PELO = "FFBBD1EA", OSCURO = "FF3A4A3F", PANTALON = "FF2B3640", ZAPATO = "FF15191D", CINTO = "FF1F262C";
const BOCA = "FF6E4034", BLANCO = "FFFFFFFF", NEGRO = "FF1A1A1A", VIDRIO = "D9CFE9FF", BURBUJA = "FFE6FFE0";

// ---------- ids que se referencian ----------
const ID = {
  artboard: id(), estilo: id(), maquina: id(), vm: id(), vmInstancia: id(), vmPose: id(), enumPose: id(),
  cuerpo: id(), cabeza: id(), pelo: id(), ojos: id(), cejas: id(),
  pesadoIzq: id(), pesadoDer: id(), parpadoIzq: id(), parpadoDer: id(),
  boca: id(), bocaPlana: id(), bocaO: id(), bocaSonrisa: id(),
  brazoSenala: id(), brazoFrasco: id(), burbuja1: id(), burbuja2: id(), piernaIzq: id(), piernaDer: id(),
  pupilaIzq: id(), pupilaDer: id(), joystick: id(), animMiradaX: id(), animMiradaY: id(), vmMiradaX: id(), vmMiradaY: id(),
  animVida: id(), animParpadeo: id(),
  capaVida: id(), capaParpadeo: id(), capaPose: id(), estadoVida: id(), estadoParpadeo: id(),
};

// Cada pose: brazos (grados), tamaño de ojos, párpados pesados (0 = abiertos,
// 1 = cerrados), altura de la ceja y boca. "Caminando" no es un cuadro fijo
// sino un ciclo en loop (ver animCaminar).
const POSES = [
  { clave: "quieto", etiqueta: "Quieto", senala: 0, frasco: 0, ojos: 1, pesado: 0.42, cejas: 0, boca: "plana" },
  { clave: "senalando", etiqueta: "Señalando", senala: -105, frasco: 0, ojos: 1, pesado: 0.3, cejas: -2, boca: "sonrisa" },
  { clave: "sorprendido", etiqueta: "Sorprendido", senala: 0, frasco: 0, ojos: 1.2, pesado: 0, cejas: -9, boca: "o" },
  { clave: "eureka", etiqueta: "Eureka", senala: -160, frasco: 160, ojos: 1.15, pesado: 0, cejas: -7, boca: "sonrisa" },
  { clave: "caminando", etiqueta: "Caminando", ojos: 1, pesado: 0.3, cejas: -2, boca: "sonrisa", camina: true },
];
for (const p of POSES) { p.valorId = id(); p.animId = id(); p.estadoId = id(); }

// ---------- el pelo: puntas barridas hacia la derecha ----------
// Centro de la cabeza en coordenadas del nodo Cabeza: (0,-50).
function pelo() {
  const cx = 0, cy = -50, base = 44;
  const puntas = [[-170, 68], [-152, 86], [-132, 100], [-110, 110], [-88, 108], [-66, 100], [-45, 92], [-25, 80], [-6, 66]];
  const punto = (ang, r) => [cx + r * Math.cos(rad(ang)), cy + r * Math.sin(rad(ang))];
  const pts = [punto(-182, base)];
  puntas.forEach(([ang, r], i) => {
    pts.push(punto(ang + 4, r)); // la punta, apenas inclinada hacia la derecha
    const sig = puntas[i + 1]?.[0] ?? 8;
    pts.push(punto((ang + sig) / 2, base));
  });
  return poligono("Pelo", pts, PELO);
}

// ---------- la cabeza ----------
const cabeza = `
<Node x="120" y="150" name="Cabeza" id="${ID.cabeza}">
  <Node name="Cejas" id="${ID.cejas}">
    ${trazo("Uniceja", [[-40, -74], [-20, -70], [0, -66], [20, -70], [40, -74]], OSCURO, 5.5, 6)}
  </Node>
  <Node y="-50" name="Ojos" id="${ID.ojos}">
    ${rect("Párpado izq", -20, -15, 32, 31, PIEL, 0, ` id="${ID.parpadoIzq}"`, true)}
    ${rect("Párpado der", 20, -15, 32, 31, PIEL, 0, ` id="${ID.parpadoDer}"`, true)}
    ${rect("Párpado pesado izq", -20, -15, 32, 31, PIEL, 0, ` id="${ID.pesadoIzq}"`, true)}
    ${rect("Párpado pesado der", 20, -15, 32, 31, PIEL, 0, ` id="${ID.pesadoDer}"`, true)}
    ${elipse("Pupila izq", -17, 3, 8, 8, NEGRO, ` id="${ID.pupilaIzq}"`)}
    ${elipse("Pupila der", 24, 3, 8, 8, NEGRO, ` id="${ID.pupilaDer}"`)}
    ${elipse("Ojo izq", -20, 0, 29, 29, BLANCO)}
    ${elipse("Ojo der", 20, 0, 29, 29, BLANCO)}
    ${trazo("Ojera izq", [[-30, 16], [-20, 19], [-10, 16]], OJERA, 2.2, 4)}
    ${trazo("Ojera der", [[10, 16], [20, 19], [30, 16]], OJERA, 2.2, 4)}
  </Node>
  ${poligono("Nariz", [[-1, -44], [10, -26], [-8, -24]], PIEL_SOMBRA, { radio: 4 })}
  <Solo y="-12" activeComponentId="${ID.bocaPlana}" name="Boca" id="${ID.boca}">
    ${trazo("Plana", [[-17, 0], [0, 2], [17, -2]], BOCA, 4, 6, ` id="${ID.bocaPlana}"`)}
    ${elipse("O", 0, 4, 14, 18, BOCA, ` id="${ID.bocaO}"`)}
    ${arco("Sonrisa", [[-20, -2], [0, 10], [20, -2]], BOCA, 4.2, 12, ` id="${ID.bocaSonrisa}"`)}
  </Solo>
  ${elipse("Lente izq", -22, -94, 26, 26, VERDE, "", fill(VERDE) + stroke(OSCURO, 4))}
  ${elipse("Lente der", 22, -94, 26, 26, VERDE, "", fill(VERDE) + stroke(OSCURO, 4))}
  ${rect("Anteojos", 0, -93, 88, 10, OSCURO, 4)}
  ${elipse("Cara", 0, -50, 98, 114, PIEL)}
  <Node y="-62" name="Pelo" id="${ID.pelo}">
    <Node y="62">${pelo()}</Node>
  </Node>
</Node>`;

// ---------- brazos: nodos con pivote en el hombro ----------
const brazoSenala = `
<Node x="176" y="148" name="Brazo señala" id="${ID.brazoSenala}">
  ${rect("Dedo", 1, 86, 6, 18, PIEL, 3)}
  ${elipse("Mano", 0, 80, 22, 22, PIEL)}
  ${rect("Puño", 0, 66, 26, 10, BATA_SOMBRA, 3)}
  ${rect("Manga", 0, 38, 24, 76, BATA, 12)}
</Node>`;

const brazoFrasco = `
<Node x="64" y="148" name="Brazo frasco" id="${ID.brazoFrasco}">
  <Node name="Frasco">
    ${elipse("Burbuja 1", -4, 86, 2.8, 2.8, BURBUJA, ` id="${ID.burbuja1}"`)}
    ${elipse("Burbuja 2", 6, 88, 2, 2, BURBUJA, ` id="${ID.burbuja2}"`)}
    ${poligono("Líquido", [[-16, 72], [16, 72], [24, 92], [-24, 92]], VERDE)}
    ${poligono("Vidrio", [[-8, 44], [8, 44], [8, 60], [24, 92], [-24, 92], [-8, 60]], VIDRIO)}
  </Node>
  ${elipse("Mano", 0, 80, 22, 22, PIEL)}
  ${rect("Puño", 0, 66, 26, 10, BATA_SOMBRA, 3)}
  ${rect("Manga", 0, 38, 24, 76, BATA, 12)}
</Node>`;

// ---------- torso: guardapolvo abierto, camisa, cinturón ----------
// El guardapolvo va abierto: entre las dos mitades se ven la camisa, el
// cinturón con hebilla verde y el pantalón.
const torso = `
${poligono("Solapa izq", [[98, 146], [116, 146], [116, 184]], BATA_SOMBRA)}
${poligono("Solapa der", [[142, 146], [124, 146], [124, 184]], BATA_SOMBRA)}
${poligono("Bata izq", [[66, 146], [116, 146], [116, 184], [108, 272], [56, 272]], BATA)}
${poligono("Bata der", [[174, 146], [124, 146], [124, 184], [132, 272], [184, 272]], BATA)}
${rect("Hebilla", 120, 241, 14, 12, VERDE, 2)}
${rect("Cinturón", 120, 241, 116, 10, CINTO)}
${poligono("Camisa", [[100, 146], [140, 146], [134, 236], [106, 236]], CAMISA)}`;

// Piernas: cada una es un nodo con pivote en la cadera, para poder caminar.
const CADERA = 233;
const piernas = `
<Node x="108" y="${CADERA}" name="Pierna izq" id="${ID.piernaIzq}">
  ${rect("Zapato izq", -4, 57, 36, 14, ZAPATO, 6)}
  ${rect("Pantalón izq", 0, 29, 28, 58, PANTALON, 6)}
</Node>
<Node x="132" y="${CADERA}" name="Pierna der" id="${ID.piernaDer}">
  ${rect("Zapato der", 4, 57, 36, 14, ZAPATO, 6)}
  ${rect("Pantalón der", 0, 29, 28, 58, PANTALON, 6)}
</Node>`;

// ---------- animaciones ----------
const ease = `<CubicEaseInterpolator x1="0.42" y1="0" x2="0.58" y2="1"/>`;
const kf = (valor, frame, tipo = "cubic") =>
  `<KeyFrameDouble value="${f(valor)}" frame="${frame}" interpolationType="${tipo}">${tipo === "cubic" ? ease : ""}</KeyFrameDouble>`;
const keyed = (objeto, prop, cuadros) => `<KeyedObject objectId="${objeto}"><KeyedProperty property="${prop}">${cuadros}</KeyedProperty></KeyedObject>`;

// Vida: respira, el pelo se mece, las burbujas suben. 4 segundos en loop.
const animVida = `
<LinearAnimation loopValue="loop" duration="240" name="Vida" id="${ID.animVida}">
  ${keyed(ID.cuerpo, "y", kf(0, 0) + kf(-3, 120) + kf(0, 240, "linear"))}
  ${keyed(ID.pelo, "rotation", kf(rad(-1.5), 0) + kf(rad(1.5), 120) + kf(rad(-1.5), 240, "linear"))}
  ${keyed(ID.burbuja1, "y", kf(86, 0, "linear") + kf(72, 108, "hold") + kf(86, 120, "linear") + kf(72, 228, "hold") + kf(86, 240, "hold"))}
  ${keyed(ID.burbuja1, "opacity", kf(0.9, 0, "linear") + kf(0, 108, "hold") + kf(0.9, 120, "linear") + kf(0, 228, "hold") + kf(0.9, 240, "hold"))}
  ${keyed(ID.burbuja2, "y", kf(88, 0, "hold") + kf(88, 54, "linear") + kf(74, 162, "hold") + kf(88, 174, "linear") + kf(80, 240, "hold"))}
  ${keyed(ID.burbuja2, "opacity", kf(0, 0, "hold") + kf(0.9, 54, "linear") + kf(0, 162, "hold") + kf(0.9, 174, "linear") + kf(0.5, 240, "hold"))}
</LinearAnimation>`;

// Parpadeo: cada 4,6 s los párpados bajan, quedan cerrados un instante y suben (capa propia).
const parpadeo = (objeto) =>
  keyed(objeto, "scaleY", kf(0, 0, "hold") + kf(0, 248, "linear") + kf(1, 253, "linear") + kf(1, 258, "linear") + kf(0, 264, "hold") + kf(0, 276, "hold"));
const animParpadeo = `
<LinearAnimation loopValue="loop" duration="276" name="Parpadeo" id="${ID.animParpadeo}">
  ${parpadeo(ID.parpadoIzq)}${parpadeo(ID.parpadoDer)}
</LinearAnimation>`;

// Mirada: dos rangos que el joystick "frota" según dónde está el mouse.
// Cuadro 0 = izquierda / arriba, cuadro 60 = derecha / abajo.
const animMirada = `
<LinearAnimation duration="60" name="Mirada X" id="${ID.animMiradaX}">
  ${keyed(ID.pupilaIzq, "x", kf(-25, 0, "linear") + kf(-9, 60, "linear"))}
  ${keyed(ID.pupilaDer, "x", kf(16, 0, "linear") + kf(32, 60, "linear"))}
  ${keyed(ID.cabeza, "rotation", kf(rad(-2.5), 0, "linear") + kf(rad(2.5), 60, "linear"))}
</LinearAnimation>
<LinearAnimation duration="60" name="Mirada Y" id="${ID.animMiradaY}">
  ${keyed(ID.pupilaIzq, "y", kf(-3, 0, "linear") + kf(9, 60, "linear"))}
  ${keyed(ID.pupilaDer, "y", kf(-3, 0, "linear") + kf(9, 60, "linear"))}
</LinearAnimation>`;

// El joystick vive en el artboard; sus x/y (-1..1) vienen del view model.
const joystick = `
<Joystick posX="120" posY="100" width="100" height="100" xId="${ID.animMiradaX}" yId="${ID.animMiradaY}" name="Mirada" id="${ID.joystick}">
  <DataBindContext sourcePathIds="${ID.vm}-${ID.vmMiradaX}" propertyKey="299"/>
  <DataBindContext sourcePathIds="${ID.vm}-${ID.vmMiradaY}" propertyKey="300"/>
</Joystick>`;

// Poses: un cuadro cada una; la transición entre estados hace la mezcla.
const idBoca = { plana: ID.bocaPlana, o: ID.bocaO, sonrisa: ID.bocaSonrisa };
const cara = (p) =>
  keyed(ID.ojos, "scaleX", kf(p.ojos, 0, "hold")) +
  keyed(ID.ojos, "scaleY", kf(p.ojos, 0, "hold")) +
  keyed(ID.pesadoIzq, "scaleY", kf(p.pesado, 0, "hold")) +
  keyed(ID.pesadoDer, "scaleY", kf(p.pesado, 0, "hold")) +
  keyed(ID.cejas, "y", kf(p.cejas, 0, "hold")) +
  `<KeyedObject objectId="${ID.boca}"><KeyedProperty property="activeComponentId"><KeyFrameId value="${idBoca[p.boca]}" frame="0" interpolationType="hold"/></KeyedProperty></KeyedObject>`;

// Una pierna: rotación (zancada) y altura (se levanta al dar el paso).
const pierna = (objeto, rotacion, altura) =>
  `<KeyedObject objectId="${objeto}"><KeyedProperty property="rotation">${rotacion}</KeyedProperty><KeyedProperty property="y">${altura}</KeyedProperty></KeyedObject>`;

const animPoseFija = (p) => `
<LinearAnimation duration="1" name="Pose ${p.etiqueta}" id="${p.animId}">
  ${keyed(ID.brazoSenala, "rotation", kf(rad(p.senala), 0, "hold"))}
  ${keyed(ID.brazoFrasco, "rotation", kf(rad(p.frasco), 0, "hold"))}
  ${pierna(ID.piernaIzq, kf(0, 0, "hold"), kf(CADERA, 0, "hold"))}
  ${pierna(ID.piernaDer, kf(0, 0, "hold"), kf(CADERA, 0, "hold"))}
  ${cara(p)}
</LinearAnimation>`;

// Caminar: 40 cuadros en loop (dos pasos). Las piernas se alternan, cada brazo
// va al revés que la pierna de su lado y el cuerpo rebota en cada paso.
// Rotación negativa = hacia adelante (el personaje mira a la derecha).
// La zancada es corta (las piernas están una al lado de la otra y se
// cruzarían); lo que se ve es que cada pierna se levanta al ir hacia adelante.
const CICLO = 40, ZANCADA = rad(16), BRACEO = rad(16), REBOTE = 6, LEVANTE = 9;
const vaiven = (a, b) => kf(a, 0) + kf(b, CICLO / 2) + kf(a, CICLO, "linear");
const levanteIzq = kf(CADERA, 0) + kf(CADERA - LEVANTE, CICLO / 4) + kf(CADERA, CICLO / 2, "hold") + kf(CADERA, CICLO, "hold");
const levanteDer = kf(CADERA, 0, "hold") + kf(CADERA, CICLO / 2) + kf(CADERA - LEVANTE, (3 * CICLO) / 4) + kf(CADERA, CICLO, "linear");
const animCaminar = (p) => `
<LinearAnimation loopValue="loop" duration="${CICLO}" name="Pose ${p.etiqueta}" id="${p.animId}">
  ${pierna(ID.piernaIzq, vaiven(ZANCADA, -ZANCADA), levanteIzq)}
  ${pierna(ID.piernaDer, vaiven(-ZANCADA, ZANCADA), levanteDer)}
  ${keyed(ID.brazoSenala, "rotation", vaiven(BRACEO, -BRACEO))}
  ${keyed(ID.brazoFrasco, "rotation", vaiven(-BRACEO, BRACEO))}
  ${keyed(ID.cuerpo, "y", kf(0, 0) + kf(-REBOTE, CICLO / 4) + kf(0, CICLO / 2) + kf(-REBOTE, (3 * CICLO) / 4) + kf(0, CICLO, "linear"))}
  ${cara(p)}
</LinearAnimation>`;

const animPoses = POSES.map((p) => (p.camina ? animCaminar(p) : animPoseFija(p))).join("");

// ---------- máquina de estados ----------
const condicion = (p) => `
<TransitionViewModelCondition opValue="equal">
  <TransitionPropertyViewModelComparator>
    <BindablePropertyEnum><DataBindContext sourcePathIds="${ID.vm}-${ID.vmPose}" propertyKey="637"/></BindablePropertyEnum>
  </TransitionPropertyViewModelComparator>
  <TransitionValueEnumComparator value="${p.valorId}"/>
</TransitionViewModelCondition>`;

const estadosPose = POSES.map(
  (p, i) => `
<AnimationState x="${160 + i * 220}" y="${i % 2 ? 120 : 0}" animationId="${p.animId}" id="${p.estadoId}">
  ${POSES.filter((q) => q !== p)
    .map((q) => `<StateTransition stateToId="${q.estadoId}" duration="350" interpolationType="cubic">${ease}${condicion(q)}</StateTransition>`)
    .join("")}
</AnimationState>`,
).join("");

const maquina = `
<StateMachine name="Personaje" id="${ID.maquina}">
  <StateMachineLayer name="Vida" id="${ID.capaVida}">
    <AnyState x="400" y="-120"/><ExitState x="520" y="-120"/>
    <EntryState x="0" y="0"><StateTransition stateToId="${ID.estadoVida}"/></EntryState>
    <AnimationState x="160" y="0" animationId="${ID.animVida}" id="${ID.estadoVida}"/>
  </StateMachineLayer>
  <StateMachineLayer name="Parpadeo" id="${ID.capaParpadeo}">
    <AnyState x="400" y="-120"/><ExitState x="520" y="-120"/>
    <EntryState x="0" y="0"><StateTransition stateToId="${ID.estadoParpadeo}"/></EntryState>
    <AnimationState x="160" y="0" animationId="${ID.animParpadeo}" id="${ID.estadoParpadeo}"/>
  </StateMachineLayer>
  <StateMachineLayer name="Pose" id="${ID.capaPose}">
    <AnyState x="1000" y="-120"/><ExitState x="1120" y="-120"/>
    <EntryState x="0" y="0"><StateTransition stateToId="${POSES[0].estadoId}"/></EntryState>
    ${estadosPose}
  </StateMachineLayer>
</StateMachine>`;

// ---------- datos: la pose la elige el sitio ----------
const datos = `
<DataEnumCustom name="Pose" id="${ID.enumPose}">
  ${POSES.map((p) => `<DataEnumValue key="${p.clave}" value="${p.etiqueta}" id="${p.valorId}"/>`).join("")}
</DataEnumCustom>

<ViewModel defaultInstanceId="${ID.vmInstancia}" name="Personaje" id="${ID.vm}">
  <ViewModelPropertyEnumCustom enumId="${ID.enumPose}" name="pose" id="${ID.vmPose}"/>
  <ViewModelPropertyNumber name="miradaX" id="${ID.vmMiradaX}"/>
  <ViewModelPropertyNumber name="miradaY" id="${ID.vmMiradaY}"/>
  <ViewModelInstance exports="true" name="Default" id="${ID.vmInstancia}">
    <ViewModelInstanceEnum propertyValue="${POSES[0].valorId}" viewModelPropertyId="${ID.vmPose}"/>
    <ViewModelInstanceNumber propertyValue="0" viewModelPropertyId="${ID.vmMiradaX}"/>
    <ViewModelInstanceNumber propertyValue="0" viewModelPropertyId="${ID.vmMiradaY}"/>
  </ViewModelInstance>
</ViewModel>`;

const rml = `<Rive version="1" kind="fragment">
<Artboard defaultStateMachineId="${ID.maquina}" viewModelId="${ID.vm}" styleId="${ID.estilo}" width="400" height="340" name="Cientifico" id="${ID.artboard}">
  <LayoutComponentStyle name="Artboard Style" id="${ID.estilo}"/>
  <Node x="80" y="30" name="Raíz">
  <Node name="Cuerpo" id="${ID.cuerpo}">
    ${cabeza}
    ${brazoSenala}
    ${brazoFrasco}
    ${torso}
    ${piernas}
  </Node>
  </Node>
  ${joystick}
  ${maquina}
  ${animVida}
  ${animParpadeo}
  ${animMirada}
  ${animPoses}
</Artboard>
${datos}
</Rive>
`;

writeFileSync(new URL("./scene.rml", import.meta.url), rml);
console.log("scene.rml generado:", rml.length, "caracteres");
