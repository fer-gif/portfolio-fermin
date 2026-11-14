"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Pose } from "./guion";

// El científico que guía el laboratorio: Fermín versión laboratorio (como el
// retrato de "quién soy"): pelo castaño despeinado, cejas gruesas, barba de
// pocos días, guardapolvo y remera turquesa.
//
// Es un SVG. Las poses, el parpadeo y la caminata son CSS (personaje.css,
// según la clase pose-*); los ojos siguen al mouse con dos variables CSS
// (--mx, --my, de -1 a 1). Respira moviendo el dibujo entero, que el
// navegador mueve sin volver a pintarlo.
//
// Las medidas salen de rive/cientifico/generar.mjs (la versión de Rive, que
// se dejó de usar porque la cuenta gratis le pone la marca de Rive encima):
// un lienzo de 400×340 con la figura corrida (80, 30). Todo va en coordenadas
// del lienzo para que los puntos de giro (hombros, caderas, cuello) sean
// fijos y el CSS los use tal cual.

/** Dónde empieza la figura en el lienzo. */
const FX = 80;
const FY = 30;
/** El cuello: el centro de la cabeza para sus piezas (y su punto de giro). */
const CX = FX + 120;
const CY = FY + 150;

type Punto = [number, number];
const n = (v: number) => Number(v.toFixed(1));
const enFigura = ([x, y]: Punto): Punto => [x + FX, y + FY];
const enCabeza = ([x, y]: Punto): Punto => [x + CX, y + CY];
const camino = (pts: Punto[], cerrado = true) => `M${pts.map(([x, y]) => `${n(x)} ${n(y)}`).join(" L")}${cerrado ? " Z" : ""}`;

const PIEL = "#f1c9a5";
const PIEL_SOMBRA = "#dfae8a";
const BATA = "#e9eef2";
const BATA_SOMBRA = "#d5dde3";
const REMERA = "#6fc3c1";
const VERDE = "#97ce4c";
const PELO = "#3f2719";
const PELO_CLARO = "#573826";
const CEJA = "#2e1b12";
const BARBA = "#553524";
const PANTALON = "#2b3640";
const ZAPATO = "#15191d";
const CINTO = "#1f262c";
const BOCA = "#6e4034";
const NEGRO = "#1a1a1a";

// El pelo de atrás: mechones cortos y desparejos alrededor de la cabeza.
const PELO_ATRAS = (() => {
  const centro: Punto = [0, -50];
  const base = 50;
  const mechones: Punto[] = [[-178, 58], [-162, 68], [-144, 80], [-124, 92], [-104, 86], [-84, 96], [-64, 90], [-44, 84], [-24, 74], [-6, 62]];
  const punto = (grados: number, r: number): Punto => {
    const a = (grados * Math.PI) / 180;
    return [centro[0] + r * Math.cos(a), centro[1] + r * Math.sin(a)];
  };
  const pts: Punto[] = [punto(-182, base)];
  mechones.forEach(([a, r], i) => {
    pts.push(punto(a + 4, r));
    pts.push(punto((a + (mechones[i + 1]?.[0] ?? 8)) / 2, base));
  });
  return camino(pts.map(enCabeza));
})();

// El flequillo: tapa la frente y termina en mechones que caen desparejos.
const FLEQUILLO = camino(
  (
    [
      [-50, -64], [-53, -90], [-45, -108], [-28, -119], [-6, -123], [16, -121], [36, -113], [50, -97], [52, -76],
      [45, -86], [41, -77], [33, -90], [21, -82], [14, -94], [1, -85], [-7, -96], [-19, -87], [-26, -98], [-38, -88], [-43, -79], [-46, -70],
    ] as Punto[]
  ).map(enCabeza),
);

const CEJA_IZQ = camino(([[-36, -72], [-24, -77], [-9, -74]] as Punto[]).map(enCabeza), false);
const CEJA_DER = camino(([[9, -75], [22, -81], [36, -77]] as Punto[]).map(enCabeza), false);
const NARIZ = camino(([[-1, -44], [10, -26], [-8, -24]] as Punto[]).map(enCabeza));
const BIGOTE = camino(([[-14, -20], [0, -22], [14, -20]] as Punto[]).map(enCabeza), false);
// La boca, 12 por encima del cuello.
const [bx, by] = enCabeza([0, -12]);
const BOCA_PLANA = `M${bx - 17} ${by} L${bx} ${by + 2} L${bx + 17} ${by - 2}`;
const BOCA_SONRISA = `M${bx - 20} ${by - 2} C${bx - 20} ${by - 2} ${bx - 12} ${by + 10} ${bx} ${by + 10} C${bx + 12} ${by + 10} ${bx + 20} ${by - 2} ${bx + 20} ${by - 2}`;

const TORSO = {
  remera: camino(([[100, 146], [140, 146], [134, 236], [106, 236]] as Punto[]).map(enFigura)),
  bataIzq: camino(([[66, 146], [116, 146], [116, 184], [108, 272], [56, 272]] as Punto[]).map(enFigura)),
  bataDer: camino(([[174, 146], [124, 146], [124, 184], [132, 272], [184, 272]] as Punto[]).map(enFigura)),
  solapaIzq: camino(([[98, 146], [116, 146], [116, 184]] as Punto[]).map(enFigura)),
  solapaDer: camino(([[142, 146], [124, 146], [124, 184]] as Punto[]).map(enFigura)),
};

// Hombros y caderas (los puntos de giro de brazos y piernas).
const HOMBRO_FRASCO = enFigura([64, 148]);
const HOMBRO_SENALA = enFigura([176, 148]);
const CADERA_IZQ = enFigura([108, 233]);
const CADERA_DER = enFigura([132, 233]);

const VIDRIO = camino(([[-8, 44], [8, 44], [8, 60], [24, 92], [-24, 92], [-8, 60]] as Punto[]).map(([x, y]) => [x + HOMBRO_FRASCO[0], y + HOMBRO_FRASCO[1]]));
const LIQUIDO = camino(([[-16, 72], [16, 72], [24, 92], [-24, 92]] as Punto[]).map(([x, y]) => [x + HOMBRO_FRASCO[0], y + HOMBRO_FRASCO[1]]));

/** Un rectángulo dado por su centro. */
function Caja({ c: [x, y], w, h, r = 0, fill }: { c: Punto; w: number; h: number; r?: number; fill: string }) {
  return <rect x={n(x - w / 2)} y={n(y - h / 2)} width={w} height={h} rx={r} fill={fill} />;
}

const giro = ([x, y]: Punto) => ({ transformOrigin: `${n(x)}px ${n(y)}px` });

function Brazo({ hombro: [hx, hy], clase, children }: { hombro: Punto; clase: string; children?: ReactNode }) {
  return (
    <g className={clase} style={giro([hx, hy])}>
      <Caja c={[hx, hy + 38]} w={24} h={76} r={12} fill={BATA} />
      <Caja c={[hx, hy + 66]} w={26} h={10} r={3} fill={BATA_SOMBRA} />
      <circle cx={hx} cy={hy + 80} r={11} fill={PIEL} />
      {children}
    </g>
  );
}

function Pierna({ cadera: [x, y], clase, zapato }: { cadera: Punto; clase: string; zapato: number }) {
  return (
    <g className={clase} style={giro([x, y])}>
      <Caja c={[x, y + 29]} w={28} h={58} r={6} fill={PANTALON} />
      <Caja c={[x + zapato, y + 57]} w={36} h={14} r={6} fill={ZAPATO} />
    </g>
  );
}

/** El dibujo solo, con la pose como clase. */
export function CientificoSVG({ pose, className = "" }: { pose: Pose; className?: string }) {
  return (
    <svg viewBox="0 0 400 340" className={`personaje-svg pose-${pose} ${className}`} aria-hidden>
      <g className="cuerpo">
        <Pierna cadera={CADERA_DER} clase="pierna pierna-der" zapato={4} />
        <Pierna cadera={CADERA_IZQ} clase="pierna pierna-izq" zapato={-4} />

        <path d={TORSO.remera} fill={REMERA} />
        <Caja c={enFigura([120, 241])} w={116} h={10} fill={CINTO} />
        <Caja c={enFigura([120, 241])} w={14} h={12} r={2} fill={VERDE} />
        <path d={TORSO.bataDer} fill={BATA} />
        <path d={TORSO.bataIzq} fill={BATA} />
        <path d={TORSO.solapaDer} fill={BATA_SOMBRA} />
        <path d={TORSO.solapaIzq} fill={BATA_SOMBRA} />

        <Brazo hombro={HOMBRO_FRASCO} clase="brazo brazo-frasco">
          <path d={VIDRIO} fill="#cfe9ff" fillOpacity={0.85} />
          <path d={LIQUIDO} fill={VERDE} />
          <circle cx={HOMBRO_FRASCO[0] - 4} cy={HOMBRO_FRASCO[1] + 84} r={1.6} fill="#e6ffe0" />
          <circle cx={HOMBRO_FRASCO[0] + 6} cy={HOMBRO_FRASCO[1] + 87} r={1.1} fill="#e6ffe0" />
        </Brazo>
        <Brazo hombro={HOMBRO_SENALA} clase="brazo brazo-senala">
          <Caja c={[HOMBRO_SENALA[0] + 1, HOMBRO_SENALA[1] + 86]} w={6} h={18} r={3} fill={PIEL} />
        </Brazo>

        <g className="cabeza" style={giro([CX, CY])}>
          <path d={PELO_ATRAS} fill={PELO} />
          <ellipse cx={CX + 47} cy={CY - 48} rx={7} ry={11} fill={PIEL_SOMBRA} />
          <ellipse cx={CX - 47} cy={CY - 48} rx={7} ry={11} fill={PIEL_SOMBRA} />
          <ellipse cx={CX} cy={CY - 49} rx={47} ry={59} fill={PIEL} />
          <ellipse cx={CX} cy={CY + 1} rx={18} ry={6} fill={BARBA} opacity={0.22} />
          <path d={BIGOTE} stroke={BARBA} strokeOpacity={0.22} strokeWidth={4.5} strokeLinecap="round" fill="none" />

          <g className="boca" fill="none" stroke={BOCA} strokeLinecap="round" strokeLinejoin="round">
            <path className="boca-plana" d={BOCA_PLANA} strokeWidth={4} />
            <path className="boca-sonrisa" d={BOCA_SONRISA} strokeWidth={4.2} />
            <ellipse className="boca-o" cx={bx} cy={by + 4} rx={7} ry={9} fill={BOCA} stroke="none" />
          </g>
          <path d={NARIZ} fill={PIEL_SOMBRA} strokeLinejoin="round" stroke={PIEL_SOMBRA} strokeWidth={3} />

          {/* los ojos: blancos grandes, pupilas que siguen al mouse, párpados pesados y el del parpadeo */}
          <g className="ojos" style={giro([CX, CY - 50])}>
            <circle cx={CX - 20} cy={CY - 50} r={14.5} fill="#fff" />
            <circle cx={CX + 20} cy={CY - 50} r={14.5} fill="#fff" />
            <g className="pupilas">
              <circle cx={CX - 17} cy={CY - 47} r={4} fill={NEGRO} />
              <circle cx={CX + 24} cy={CY - 47} r={4} fill={NEGRO} />
            </g>
            <rect className="parpado-pesado" x={CX - 36} y={CY - 65} width={32} height={31} fill={PIEL} />
            <rect className="parpado-pesado" x={CX + 4} y={CY - 65} width={32} height={31} fill={PIEL} />
            <rect className="parpado" x={CX - 36} y={CY - 65} width={32} height={31} fill={PIEL} />
            <rect className="parpado" x={CX + 4} y={CY - 65} width={32} height={31} fill={PIEL} />
          </g>

          <g className="cejas" fill="none" stroke={CEJA} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
            <path d={CEJA_IZQ} />
            <path d={CEJA_DER} />
          </g>
          <path d={FLEQUILLO} fill={PELO_CLARO} stroke={PELO_CLARO} strokeWidth={3} strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}

/** A cuántos píxeles del personaje la mirada llega al tope (-1 / 1). */
const ALCANCE_MIRADA = 420;

// El científico con vida: el dibujo, dado vuelta si camina hacia la izquierda
// (el dibujo mira a la derecha), y con los ojos siguiendo al mouse.
export function Cientifico({ pose, direccion = 1, className = "" }: { pose: Pose; direccion?: 1 | -1; className?: string }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const direccionRef = useRef(direccion);
  useEffect(() => {
    direccionRef.current = direccion;
  }, [direccion]);

  // Los ojos siguen el puntero. Solo donde hay mouse: en el celular no hay
  // nada que seguir y los ojos quedan al frente.
  useEffect(() => {
    const caja = contenedor.current;
    if (!caja || !window.matchMedia("(hover: hover)").matches) return;

    let objetivo = { x: 0, y: 0 };
    let actual = { x: 0, y: 0 };
    let cuadro = 0;

    const animar = () => {
      // se acerca suavemente al objetivo: la mirada no "salta"
      actual = { x: actual.x + (objetivo.x - actual.x) * 0.15, y: actual.y + (objetivo.y - actual.y) * 0.15 };
      // si está dado vuelta, la mirada también
      caja.style.setProperty("--mx", (actual.x * direccionRef.current).toFixed(3));
      caja.style.setProperty("--my", actual.y.toFixed(3));
      cuadro = Math.abs(objetivo.x - actual.x) > 0.002 || Math.abs(objetivo.y - actual.y) > 0.002 ? requestAnimationFrame(animar) : 0;
    };
    const pedirCuadro = () => {
      if (!cuadro) cuadro = requestAnimationFrame(animar);
    };
    const alMover = (e: PointerEvent) => {
      const r = caja.getBoundingClientRect();
      // los ojos están en el tercio de arriba del personaje
      const centroX = r.left + r.width * 0.5;
      const centroY = r.top + r.height * 0.3;
      objetivo = {
        x: Math.max(-1, Math.min(1, (e.clientX - centroX) / ALCANCE_MIRADA)),
        y: Math.max(-1, Math.min(1, (e.clientY - centroY) / ALCANCE_MIRADA)),
      };
      pedirCuadro();
    };
    const alSalir = () => {
      objetivo = { x: 0, y: 0 };
      pedirCuadro();
    };

    window.addEventListener("pointermove", alMover);
    document.addEventListener("pointerleave", alSalir);
    return () => {
      window.removeEventListener("pointermove", alMover);
      document.removeEventListener("pointerleave", alSalir);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, []);

  return (
    <div
      ref={contenedor}
      className={`relative aspect-[400/340] transition-transform duration-300 ${className}`}
      style={{ transform: direccion < 0 ? "scaleX(-1)" : undefined }}
    >
      <CientificoSVG pose={pose} className="h-full w-full" />
    </div>
  );
}
