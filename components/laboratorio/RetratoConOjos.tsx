"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// El retrato de "quién soy" con ojos que siguen al mouse. Encima de la imagen
// va un SVG con su mismo tamaño: una máscara con la forma de lo blanco de
// cada ojo (public/retrato/ojos-mascara.png, sacada de la imagen) tapa las
// pupilas dibujadas, y adentro de esa máscara van dos pupilas que se mueven.
// Arrancan donde están en el dibujo y desde ahí solo van a los costados y
// hacia abajo: arriba están los párpados y se esconderían.
//
// Las medidas están en píxeles de la imagen (710×887).

const ANCHO = 710;
const ALTO = 887;
/** Dónde está la máscara dentro de la imagen. */
const MASCARA = { x: 253, y: 280, ancho: 236, alto: 85 };
/** Las pupilas tal como están en el dibujo. */
const PUPILAS = [
  { cx: 297.1, cy: 316.4 },
  { cx: 431.6, cy: 297.6 },
];
const RADIO_PUPILA = 7.3;
/** Entre los dos ojos: desde acá se mide hacia dónde está el mouse. */
const ENTRE_OJOS = { x: 364.5, y: 307 };
/** Cuánto se corren como mucho (en píxeles de la imagen) y a qué distancia del mouse llegan al tope. */
const TOPE_X = 24;
const TOPE_Y = 20;
const ALCANCE = 500;

const limitar = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function RetratoConOjos({ alt }: { alt: string }) {
  const caja = useRef<HTMLDivElement>(null);
  const pupilas = useRef<SVGGElement>(null);

  useEffect(() => {
    const contenedor = caja.current;
    const grupo = pupilas.current;
    // Solo donde hay mouse: en el celular no hay nada que seguir.
    if (!contenedor || !grupo || !window.matchMedia("(hover: hover)").matches) return;

    let objetivo = { x: 0, y: 0 };
    let actual = { x: 0, y: 0 };
    let cuadro = 0;

    const animar = () => {
      // se acercan suavemente al objetivo: la mirada no "salta"
      actual = { x: actual.x + (objetivo.x - actual.x) * 0.18, y: actual.y + (objetivo.y - actual.y) * 0.18 };
      grupo.setAttribute("transform", `translate(${actual.x.toFixed(2)} ${actual.y.toFixed(2)})`);
      cuadro = Math.abs(objetivo.x - actual.x) > 0.05 || Math.abs(objetivo.y - actual.y) > 0.05 ? requestAnimationFrame(animar) : 0;
    };
    const pedirCuadro = () => {
      if (!cuadro) cuadro = requestAnimationFrame(animar);
    };
    const alMover = (e: PointerEvent) => {
      const r = contenedor.getBoundingClientRect();
      if (!r.width) return;
      const ojosX = r.left + (ENTRE_OJOS.x / ANCHO) * r.width;
      const ojosY = r.top + (ENTRE_OJOS.y / ALTO) * r.height;
      objetivo = {
        x: limitar((e.clientX - ojosX) / ALCANCE, -1, 1) * TOPE_X,
        // hacia arriba no: si el mouse está más alto, se quedan a la altura de siempre
        y: limitar((e.clientY - ojosY) / ALCANCE, 0, 1) * TOPE_Y,
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
    <div ref={caja} className="relative">
      {/* se carga de una (y no al aparecer): la escena está oculta hasta que llega */}
      <Image
        src="/retrato/fermin-cientifico.webp"
        width={ANCHO}
        height={ALTO}
        loading="eager"
        sizes="(min-width: 640px) 28vw, 40vw"
        alt={alt}
        className="block h-auto w-full"
      />
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
        <defs>
          <mask id="retrato-ojos" maskUnits="userSpaceOnUse" x={MASCARA.x} y={MASCARA.y} width={MASCARA.ancho} height={MASCARA.alto}>
            <image href="/retrato/ojos-mascara.png" x={MASCARA.x} y={MASCARA.y} width={MASCARA.ancho} height={MASCARA.alto} />
          </mask>
        </defs>
        <g mask="url(#retrato-ojos)">
          <rect x={MASCARA.x} y={MASCARA.y} width={MASCARA.ancho} height={MASCARA.alto} fill="#f2f2f2" />
          <g ref={pupilas}>
            {PUPILAS.map((p) => (
              <circle key={p.cx} cx={p.cx} cy={p.cy} r={RADIO_PUPILA} fill="#141414" />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
