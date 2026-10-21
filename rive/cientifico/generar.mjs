// Genera scene.rml: el científico del laboratorio como archivo Rive.
// La geometría viene del PersonajeSVG (viewBox 120x150) escalada x2.
// Correr: node generar.mjs  →  luego  rive . --verify
import { writeFileSync } from "node:fs";

// ---------- utilidades ----------
let siguiente = 10;
const id = () => `0:${siguiente++}`;
const rad = (grados) => (grados * Math.PI) / 180;
const f = (n) => Number(n.toFixed(3)).toString();

// Sentido horario (coordenadas con y hacia abajo): suma del shoelace > 0.
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

// Polígono cerrado (coordenadas locales al padre).
function poligono(nombre, puntos, color, extra = "") {
  const vs = puntos.map(([x, y]) => `<StraightVertex x="${f(x)}" y="${f(y)}"/>`).join("");
  return `<Shape name="${nombre}"${extra}><PointsPath isClosed="true" isClockwise="${esHorario(puntos)}" name="Path">${vs}</PointsPath>${fill(color)}</Shape>`;
}

// Rectángulo centrado en (x, y).
function rect(nombre, x, y, w, h, color, radio = 0, extra = "") {
  return `<Shape x="${f(x)}" y="${f(y)}" name="${nombre}"${extra}><Rectangle width="${w}" height="${h}" cornerRadiusTL="${radio}" name="Path"/>${fill(color)}</Shape>`;
}

function elipse(nombre, x, y, w, h, color, extra = "", pintura = fill(color)) {
  return `<Shape x="${f(x)}" y="${f(y)}" name="${nombre}"${extra}><Ellipse width="${w}" height="${h}" name="Path"/>${pintura}</Shape>`;
}

// Trazo abierto con un vértice suave en el medio (sonrisa).
function arco(nombre, [a, m, b], color, grosor, curva = 10, extra = "") {
  return `<Shape name="${nombre}"${extra}><PointsPath isClosed="false" name="Path"><StraightVertex x="${f(a[0])}" y="${f(a[1])}"/><CubicMirroredVertex x="${f(m[0])}" y="${f(m[1])}" rotation="0" distance="${curva}"/><StraightVertex x="${f(b[0])}" y="${f(b[1])}"/></PointsPath>${stroke(color, grosor)}</Shape>`;
}

// Trazo abierto en "^" con la punta redondeada (cejas).
function ceja(nombre, [a, m, b], color, grosor, radio = 8) {
  return `<Shape name="${nombre}"><PointsPath isClosed="false" name="Path"><StraightVertex x="${f(a[0])}" y="${f(a[1])}"/><StraightVertex x="${f(m[0])}" y="${f(m[1])}" radius="${radio}"/><StraightVertex x="${f(b[0])}" y="${f(b[1])}"/></PointsPath>${stroke(color, grosor)}</Shape>`;
}

// ---------- colores ----------
const PIEL = "FFF1C9A5", BATA = "FFE9EEF2", BATA_SOMBRA = "FFD5DDE3", VERDE = "FF7EE35B";
const PELO = "FFCFD8E3", OSCURO = "FF3A4A3F", PANTALON = "FF2B3640", ZAPATO = "FF15191D";
const BOCA = "FF7A4A3A", BLANCO = "FFFFFFFF", NEGRO = "FF1A1A1A", VIDRIO = "D9CFE9FF", BURBUJA = "FFE6FFE0";

// ---------- ids que se referencian ----------
const ID = {
  artboard: id(), estilo: id(), maquina: id(), vm: id(), vmInstancia: id(), vmPose: id(), enumPose: id(),
  cuerpo: id(), cabeza: id(), pelo: id(), ojos: id(), parpadoIzq: id(), parpadoDer: id(), cejas: id(),
  boca: id(), sonrisa: id(), bocaO: id(), brazoSenala: id(), brazoFrasco: id(), burbuja1: id(), burbuja2: id(),
  animVida: id(), animParpadeo: id(),
  capaVida: id(), capaParpadeo: id(), capaPose: id(), estadoVida: id(), estadoParpadeo: id(),
};

const POSES = [
  { clave: "quieto", etiqueta: "Quieto", senala: 0, frasco: 0, ojos: 1, cejas: 0, boca: "sonrisa" },
  { clave: "senalando", etiqueta: "Señalando", senala: -105, frasco: 0, ojos: 1, cejas: 0, boca: "sonrisa" },
  { clave: "sorprendido", etiqueta: "Sorprendido", senala: 0, frasco: 0, ojos: 1.25, cejas: -6, boca: "o" },
  { clave: "eureka", etiqueta: "Eureka", senala: -160, frasco: 160, ojos: 1.25, cejas: -6, boca: "o" },
];
for (const p of POSES) { p.valorId = id(); p.animId = id(); p.estadoId = id(); }

// ---------- la escena (orden de declaración = de adelante hacia atrás) ----------
// Cabeza: nodo con pivote en el cuello (120,150); hijos en coordenadas locales.
const cabeza = `
<Node x="120" y="150" name="Cabeza" id="${ID.cabeza}">
  <Node name="Cejas" id="${ID.cejas}">
    ${ceja("Ceja izq", [[-36, -69], [-22, -76], [-8, -70]], OSCURO, 4.4)}
    ${ceja("Ceja der", [[8, -70], [22, -76], [36, -69]], OSCURO, 4.4)}
  </Node>
  <Node y="-50" name="Ojos" id="${ID.ojos}">
    ${rect("Párpado izq", -20, -14, 30, 29, PIEL, 0, ` id="${ID.parpadoIzq}"`).replace('name="Path"', 'originY="0" name="Path"')}
    ${rect("Párpado der", 20, -14, 30, 29, PIEL, 0, ` id="${ID.parpadoDer}"`).replace('name="Path"', 'originY="0" name="Path"')}
    ${elipse("Pupila izq", -17, 2, 10.4, 10.4, NEGRO)}
    ${elipse("Pupila der", 23, 2, 10.4, 10.4, NEGRO)}
    ${elipse("Ojo izq", -20, 0, 26, 26, BLANCO)}
    ${elipse("Ojo der", 20, 0, 26, 26, BLANCO)}
  </Node>
  <Solo y="-24" activeComponentId="${ID.sonrisa}" name="Boca" id="${ID.boca}">
    ${arco("Sonrisa", [[-18, 0], [0, 8], [18, 0]], BOCA, 4.4, 10, ` id="${ID.sonrisa}"`)}
    ${elipse("O", 0, 4, 16, 20, BOCA, ` id="${ID.bocaO}"`)}
  </Solo>
  ${elipse("Lente izq", -22, -92, 26, 26, VERDE, "", fill(VERDE) + stroke(OSCURO, 4))}
  ${elipse("Lente der", 22, -92, 26, 26, VERDE, "", fill(VERDE) + stroke(OSCURO, 4))}
  ${rect("Anteojos", 0, -91, 88, 10, OSCURO, 4)}
  ${elipse("Mentón", 0, -10, 56, 24, "59B8B1A7")}
  ${elipse("Cara", 0, -50, 100, 108, PIEL)}
  <Node y="-62" name="Pelo" id="${ID.pelo}">
    ${poligono("Pelo", [[-60, 0], [-76, -60], [-44, -28], [-36, -80], [-12, -32], [4, -88], [20, -32], [44, -76], [44, -28], [76, -60], [60, 0]], PELO)}
  </Node>
</Node>`;

// Brazos: nodos con pivote en el hombro.
const brazoSenala = `
<Node x="176" y="148" name="Brazo señala" id="${ID.brazoSenala}">
  ${rect("Dedo", 1, 85, 6, 18, PIEL, 3)}
  ${elipse("Mano", 0, 80, 22, 22, PIEL)}
  ${rect("Brazo", 0, 38, 24, 76, BATA, 12)}
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
  ${rect("Brazo", 0, 38, 24, 76, BATA, 12)}
</Node>`;

const bata = `
${poligono("Corbata", [[108, 144], [132, 144], [124, 208], [116, 208]], VERDE)}
${poligono("Solapa izq", [[72, 144], [108, 144], [104, 220]], BATA_SOMBRA)}
${poligono("Solapa der", [[168, 144], [132, 144], [136, 220]], BATA_SOMBRA)}
${poligono("Bata", [[72, 144], [168, 144], [180, 248], [60, 248]], BATA)}`;

const piernas = `
${rect("Zapato izq", 98, 288, 36, 16, ZAPATO, 6)}
${rect("Zapato der", 142, 288, 36, 16, ZAPATO, 6)}
${rect("Pierna izq", 98, 264, 28, 56, PANTALON, 8)}
${rect("Pierna der", 142, 264, 28, 56, PANTALON, 8)}`;

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

// Parpadeo: cada 4,6 s los párpados bajan y suben.
const parpadeo = (objeto) =>
  keyed(objeto, "scaleY", kf(0, 0, "hold") + kf(0, 248, "linear") + kf(1, 254, "linear") + kf(0, 262, "hold") + kf(0, 276, "hold"));
const animParpadeo = `
<LinearAnimation loopValue="loop" duration="276" name="Parpadeo" id="${ID.animParpadeo}">
  ${parpadeo(ID.parpadoIzq)}${parpadeo(ID.parpadoDer)}
</LinearAnimation>`;

// Poses: un cuadro cada una; la transición entre estados hace la mezcla.
const animPoses = POSES.map(
  (p) => `
<LinearAnimation duration="1" name="Pose ${p.etiqueta}" id="${p.animId}">
  ${keyed(ID.brazoSenala, "rotation", kf(rad(p.senala), 0, "hold"))}
  ${keyed(ID.brazoFrasco, "rotation", kf(rad(p.frasco), 0, "hold"))}
  ${keyed(ID.ojos, "scaleX", kf(p.ojos, 0, "hold"))}
  ${keyed(ID.ojos, "scaleY", kf(p.ojos, 0, "hold"))}
  ${keyed(ID.cejas, "y", kf(p.cejas, 0, "hold"))}
  <KeyedObject objectId="${ID.boca}"><KeyedProperty property="activeComponentId"><KeyFrameId value="${p.boca === "o" ? ID.bocaO : ID.sonrisa}" frame="0" interpolationType="hold"/></KeyedProperty></KeyedObject>
</LinearAnimation>`,
).join("");

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
  <ViewModelInstance exports="true" name="Default" id="${ID.vmInstancia}">
    <ViewModelInstanceEnum propertyValue="${POSES[0].valorId}" viewModelPropertyId="${ID.vmPose}"/>
  </ViewModelInstance>
</ViewModel>`;

// El artboard tiene aire alrededor para los brazos levantados y el pelo:
// la figura (240x300) va centrada dentro de 400x340.
const rml = `<Rive version="1" kind="fragment">
<Artboard defaultStateMachineId="${ID.maquina}" viewModelId="${ID.vm}" styleId="${ID.estilo}" width="400" height="340" name="Cientifico" id="${ID.artboard}">
  <LayoutComponentStyle name="Artboard Style" id="${ID.estilo}"/>
  <Node x="80" y="34" name="Raíz">
  <Node name="Cuerpo" id="${ID.cuerpo}">
    ${cabeza}
    ${brazoSenala}
    ${brazoFrasco}
    ${bata}
    ${piernas}
  </Node>
  </Node>
  ${maquina}
  ${animVida}
  ${animParpadeo}
  ${animPoses}
</Artboard>
${datos}
</Rive>
`;

writeFileSync(new URL("./scene.rml", import.meta.url), rml);
console.log("scene.rml generado:", rml.length, "caracteres");
