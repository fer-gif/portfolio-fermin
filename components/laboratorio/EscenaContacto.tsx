"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDirector, useEscena, useEscenaActual, useGSAP } from "@/components/recorrido";
import { desbloquear } from "./logros";

interface Enlace {
  etiqueta: string;
  url: string;
}

interface Gota {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vida: number;
  maxVida: number;
}

interface Tentaculo {
  anguloBase: number;
  anguloPunta: number;
  fase: number;
  frecuencia: number;
  amplitud: number;
  grosor: number;
}

const TENTACULOS: Tentaculo[] = [
  { anguloBase: -2.6, anguloPunta: -2.4, fase: 0.0, frecuencia: 4.2, amplitud: 22, grosor: 7.5 },
  { anguloBase: -1.8, anguloPunta: -1.6, fase: 1.1, frecuencia: 5.1, amplitud: 18, grosor: 6.0 },
  { anguloBase: -1.0, anguloPunta: -0.9, fase: 2.3, frecuencia: 3.8, amplitud: 24, grosor: 7.0 },
  { anguloBase: -0.2, anguloPunta: -0.1, fase: 3.4, frecuencia: 4.7, amplitud: 16, grosor: 5.5 },
  { anguloBase: 0.5, anguloPunta: 0.6, fase: 4.5, frecuencia: 4.0, amplitud: 20, grosor: 6.8 },
  { anguloBase: 1.3, anguloPunta: 1.4, fase: 5.2, frecuencia: 5.4, amplitud: 19, grosor: 5.8 },
  { anguloBase: 2.1, anguloPunta: 2.2, fase: 0.7, frecuencia: 4.5, amplitud: 23, grosor: 7.2 },
  { anguloBase: 2.8, anguloPunta: 2.9, fase: 1.9, frecuencia: 3.6, amplitud: 17, grosor: 5.2 },
];

const FRASES_NO = [
  "¿En serio vas a tocar que no? Ese botón tiene piernas propias.",
  "Casi… pero no. Probá con el verde.",
  "Te juro que es más fácil tocar «Sí».",
  "Ese botón se escapó del laboratorio. No lo vas a agarrar.",
];

// La última pantalla: "¿Querés trabajar conmigo?", botones Sí (con líquido
// verde estilo Venom que atrapa el cursor y abre el mail al tocarlo) y No
// (que se escapa por toda la pantalla), más CV y redes debajo.
export function EscenaContacto({
  email,
  enlaces,
  cv,
}: {
  email: string;
  enlaces: Enlace[];
  /** Ruta al CV en PDF; si no hay, no se muestra el botón. */
  cv?: string | null;
}) {
  const { linea } = useEscena();
  const escena = useEscenaActual();
  const director = useDirector();

  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const btnSiRef = useRef<HTMLButtonElement>(null);
  const btnNoRef = useRef<HTMLButtonElement>(null);

  const [aceptado, setAceptado] = useState(false);
  const [atrapado, setAtrapado] = useState(false);
  const [posNo, setPosNo] = useState<{ x: number; y: number } | null>(null);
  const intentosNoRef = useRef(0);
  const redes = enlaces.filter((e) => !e.url.startsWith("mailto:"));

  // Estado mutable del efecto líquido Venom en Canvas (corre a 60fps sin
  // disparar re-renders de React y se detiene solo cuando está inactivo).
  const simRef = useRef({
    mouseX: 0,
    mouseY: 0,
    mouseActivo: false,
    enganchado: false,
    fuerza: 0,
    blobX: 0,
    blobY: 0,
    gotas: [] as Gota[],
    raf: 0,
    t: 0,
    ultimoFrame: 0,
  });

  // Llegar hasta acá también cuenta como experimento.
  useEffect(() => {
    if (escena === "contacto") desbloquear("salida");
  }, [escena]);

  useGSAP(
    () => {
      linea.from(".linea", { opacity: 0, y: 20, duration: 0.2, stagger: 0.04 }, 0.04).to({}, { duration: 0.6 });
    },
    { scope: ref },
  );

  // Dispara partículas líquidas verdes desde un punto (al soltarse o al hacer clic en "Sí").
  const lanzarGotas = useCallback((x: number, y: number, cantidad: number, velocidad: number) => {
    const gotas = simRef.current.gotas;
    for (let i = 0; i < cantidad; i++) {
      const a = (Math.PI * 2 * i) / cantidad + (Math.random() - 0.5) * 0.5;
      const v = velocidad * (0.45 + Math.random() * 0.9);
      gotas.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 40,
        r: 2.5 + Math.random() * 5.5,
        vida: 0,
        maxVida: 0.5 + Math.random() * 0.55,
      });
    }
  }, []);

  // Motor del líquido verde estilo Venom: tentáculos orgánicos que salen del
  // botón "Sí", envuelven al cursor y se estiran cuando intentás alejarte.
  const asegurarAnimacion = useCallback(() => {
    const sim = simRef.current;
    if (sim.raf) return;
    sim.ultimoFrame = performance.now();

    const dibujar = (ahora: number) => {
      const dt = Math.min(0.05, (ahora - sim.ultimoFrame) / 1000);
      sim.ultimoFrame = ahora;
      sim.t += dt;

      const root = ref.current;
      const canvas = canvasRef.current;
      const btn = btnSiRef.current;
      if (!root || !canvas) {
        sim.raf = 0;
        return;
      }

      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        sim.raf = 0;
        return;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Centro y radio del botón "Sí" relativo al contenedor
      let bx = w / 2;
      let by = h / 2;
      let bw = 112;
      let bh = 48;
      if (btn) {
        const br = btn.getBoundingClientRect();
        bx = br.left - rect.left + br.width / 2;
        by = br.top - rect.top + br.height / 2;
        bw = br.width;
        bh = br.height;
      }

      const dx = sim.mouseX - bx;
      const dy = sim.mouseY - by;
      const dist = Math.hypot(dx, dy);

      // Histéresis: se engancha al acercarse/entrar al botón "Sí" (~175px) y
      // aguanta estirándose pegajoso hasta ~245px antes de soltarse.
      const radioEnganche = Math.max(bw * 0.9, 130);
      const radioSoltar = 245;
      const antesEnganchado = sim.enganchado;

      if (btn && sim.mouseActivo && (dist < radioEnganche || (sim.enganchado && dist < radioSoltar))) {
        sim.enganchado = true;
      } else {
        if (antesEnganchado) {
          lanzarGotas(sim.blobX, sim.blobY, 10, 150);
        }
        sim.enganchado = false;
      }

      if (antesEnganchado !== sim.enganchado) {
        setAtrapado(sim.enganchado);
      }

      const objetivoFuerza = sim.enganchado ? Math.max(0.25, 1 - Math.max(0, dist - 70) / (radioSoltar - 40)) : 0;
      sim.fuerza += (objetivoFuerza - sim.fuerza) * Math.min(1, dt * (sim.enganchado ? 11 : 8));

      // Punto de la masa líquida: persigue al cursor con leve arrastre viscoso
      const targetX = sim.enganchado ? sim.mouseX : bx;
      const targetY = sim.enganchado ? sim.mouseY : by;
      if (sim.blobX === 0 && sim.blobY === 0) {
        sim.blobX = bx;
        sim.blobY = by;
      }
      sim.blobX += (targetX - sim.blobX) * Math.min(1, dt * 16);
      sim.blobY += (targetY - sim.blobY) * Math.min(1, dt * 16);

      // Tirón magnético suave del botón "Sí" hacia el cursor atrapado
      if (btn) {
        if (sim.enganchado && sim.fuerza > 0.05) {
          const pull = Math.min(26, dist * 0.22) * sim.fuerza;
          const ang = Math.atan2(dy, dx);
          const ox = Math.cos(ang) * pull;
          const oy = Math.sin(ang) * pull;
          btn.style.transform = `translate3d(${ox.toFixed(1)}px, ${oy.toFixed(1)}px, 0) scale(${(1 + 0.06 * sim.fuerza).toFixed(3)})`;
        } else {
          btn.style.transform = "";
        }
      }

      // Dibujar tentáculos y simbionte verde alrededor del cursor
      if (btn && sim.fuerza > 0.02) {
        const t = sim.t;
        const f = sim.fuerza;
        const radioBlob = (16 + 10 * f) * (0.94 + 0.06 * Math.sin(t * 7));

        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // 1. Tentáculos pegajosos desde el perímetro del botón hasta el cursor
        for (const ten of TENTACULOS) {
          const sx = bx + Math.cos(ten.anguloBase) * (bw * 0.44);
          const sy = by + Math.sin(ten.anguloBase) * (bh * 0.44);
          const angPunta = ten.anguloPunta + Math.sin(t * 2.1 + ten.fase) * 0.4;
          const ex = sim.blobX + Math.cos(angPunta) * (radioBlob * 0.78);
          const ey = sim.blobY + Math.sin(angPunta) * (radioBlob * 0.78);

          const vx = ex - sx;
          const vy = ey - sy;
          const len = Math.max(1, Math.hypot(vx, vy));
          const nx = -vy / len;
          const ny = vx / len;

          const onda1 = Math.sin(t * ten.frecuencia + ten.fase) * ten.amplitud * f;
          const onda2 = Math.cos(t * (ten.frecuencia * 0.85) + ten.fase * 1.4) * ten.amplitud * 0.75 * f;

          const c1x = sx + vx * 0.33 + nx * onda1;
          const c1y = sy + vy * 0.33 + ny * onda1;
          const c2x = sx + vx * 0.68 + nx * onda2;
          const c2y = sy + vy * 0.68 + ny * onda2;

          // Capa oscura exterior estilo Venom (verde tóxico oscuro)
          ctx.shadowColor = "rgba(151, 206, 76, 0.55)";
          ctx.shadowBlur = 12 * f;
          ctx.strokeStyle = `rgba(20, 58, 18, ${(0.92 * f).toFixed(2)})`;
          ctx.lineWidth = (ten.grosor + 3.5) * f;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
          ctx.stroke();

          // Cuerpo verde portal
          ctx.shadowBlur = 6 * f;
          ctx.strokeStyle = `rgba(151, 206, 76, ${(0.88 * f).toFixed(2)})`;
          ctx.lineWidth = ten.grosor * 0.72 * f;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
          ctx.stroke();

          // Brillo húmedo especular
          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(224, 255, 168, ${(0.55 * f).toFixed(2)})`;
          ctx.lineWidth = Math.max(1, ten.grosor * 0.22 * f);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.bezierCurveTo(c1x - 1.5, c1y - 1.5, c2x - 1.5, c2y - 1.5, ex, ey);
          ctx.stroke();
        }

        // 2. Masa líquida orgánica que envuelve y atrapa al cursor
        ctx.beginPath();
        const pasos = 28;
        for (let i = 0; i <= pasos; i++) {
          const a = (i / pasos) * Math.PI * 2;
          const deform =
            1 +
            0.16 * Math.sin(3 * a + t * 5.2) +
            0.11 * Math.cos(5 * a - t * 3.8) +
            0.07 * Math.sin(7 * a + t * 7.1);
          const r = radioBlob * deform;
          const px = sim.blobX + Math.cos(a) * r;
          const py = sim.blobY + Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        const grad = ctx.createRadialGradient(
          sim.blobX - radioBlob * 0.25,
          sim.blobY - radioBlob * 0.25,
          2,
          sim.blobX,
          sim.blobY,
          radioBlob * 1.3,
        );
        grad.addColorStop(0, `rgba(198, 243, 106, ${(0.95 * f).toFixed(2)})`);
        grad.addColorStop(0.45, `rgba(118, 194, 48, ${(0.92 * f).toFixed(2)})`);
        grad.addColorStop(0.85, `rgba(26, 74, 22, ${(0.95 * f).toFixed(2)})`);
        grad.addColorStop(1, `rgba(12, 34, 14, ${(0.85 * f).toFixed(2)})`);

        ctx.shadowColor = "rgba(151, 206, 76, 0.8)";
        ctx.shadowBlur = 18 * f;
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(198, 243, 106, ${(0.75 * f).toFixed(2)})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Reflejo líquido brillante encima del cursor
        ctx.beginPath();
        ctx.ellipse(
          sim.blobX - radioBlob * 0.32,
          sim.blobY - radioBlob * 0.32,
          radioBlob * 0.26,
          radioBlob * 0.14,
          -0.6,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(244, 255, 214, ${(0.7 * f).toFixed(2)})`;
        ctx.fill();

        // Gotitas orbitando el simbionte
        for (let i = 0; i < 5; i++) {
          const oa = t * (2.4 + i * 0.4) + i * 1.3;
          const or = radioBlob * (1.25 + 0.3 * Math.sin(t * 4 + i));
          ctx.beginPath();
          ctx.arc(sim.blobX + Math.cos(oa) * or, sim.blobY + Math.sin(oa) * or, 2.2 * f, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(198, 243, 106, ${(0.8 * f).toFixed(2)})`;
          ctx.fill();
        }

        ctx.restore();
      }

      // 3. Gotas sueltas (salpicadura al soltar o al clickear "Sí")
      for (let i = sim.gotas.length - 1; i >= 0; i--) {
        const g = sim.gotas[i];
        g.vida += dt;
        if (g.vida >= g.maxVida) {
          sim.gotas.splice(i, 1);
          continue;
        }
        g.vy += 280 * dt;
        g.vx *= 0.97;
        g.x += g.vx * dt;
        g.y += g.vy * dt;
        const alpha = 1 - g.vida / g.maxVida;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r * (0.4 + 0.6 * alpha), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(151, 206, 76, ${alpha.toFixed(2)})`;
        ctx.fill();
      }

      if (sim.fuerza > 0.015 || sim.enganchado || sim.gotas.length > 0) {
        sim.raf = requestAnimationFrame(dibujar);
      } else {
        sim.raf = 0;
        ctx.clearRect(0, 0, w, h);
      }
    };

    sim.raf = requestAnimationFrame(dibujar);
  }, [lanzarGotas]);

  useEffect(() => {
    const sim = simRef.current;
    return () => {
      if (sim.raf) cancelAnimationFrame(sim.raf);
      sim.raf = 0;
    };
  }, []);

  const moverMouse = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || aceptado) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = ref.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const sim = simRef.current;
    sim.mouseX = e.clientX - rect.left;
    sim.mouseY = e.clientY - rect.top;
    sim.mouseActivo = true;

    const btn = btnSiRef.current;
    if (btn) {
      const br = btn.getBoundingClientRect();
      const bx = br.left - rect.left + br.width / 2;
      const by = br.top - rect.top + br.height / 2;
      const dist = Math.hypot(sim.mouseX - bx, sim.mouseY - by);
      if (dist < 250 || sim.enganchado || sim.fuerza > 0.015) {
        asegurarAnimacion();
      }
    }
  };

  const salirMouse = () => {
    const sim = simRef.current;
    sim.mouseActivo = false;
    if (sim.enganchado) {
      sim.enganchado = false;
      setAtrapado(false);
    }
  };

  // El botón "No" huye a un punto aleatorio seguro dentro de toda la pantalla.
  const escaparNo = (punteroX?: number, punteroY?: number) => {
    const root = ref.current;
    const btn = btnNoRef.current;
    if (!root || !btn) return;

    const rect = root.getBoundingClientRect();
    const bw = btn.offsetWidth || 92;
    const bh = btn.offsetHeight || 44;

    const margenX = 24;
    const minX = margenX;
    const maxX = Math.max(minX, rect.width - bw - margenX);
    const minY = 76; // debajo de los botones fijos superiores
    const maxY = Math.max(minY, rect.height - bh - (rect.width < 640 ? 185 : 96));

    const px = punteroX !== undefined ? punteroX - rect.left : rect.width / 2;
    const py = punteroY !== undefined ? punteroY - rect.top : rect.height / 2;

    let elegido = { x: minX, y: minY };
    let mejorDist = -1;
    for (let i = 0; i < 16; i++) {
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);
      // evitar caer justo sobre el científico (abajo a la izquierda en escritorio)
      if (rect.width >= 640 && x < 230 && y > rect.height - 230) continue;
      const d = Math.hypot(x + bw / 2 - px, y + bh / 2 - py);
      if (d > mejorDist) {
        mejorDist = d;
        elegido = { x: Math.round(x), y: Math.round(y) };
        if (d > Math.min(rect.width, rect.height) * 0.42) break;
      }
    }

    if (!posNo) {
      // Primer escape: arranca desde su posición real y sale volando en el próximo cuadro
      const br = btn.getBoundingClientRect();
      setPosNo({ x: Math.round(br.left - rect.left), y: Math.round(br.top - rect.top) });
      requestAnimationFrame(() => setPosNo(elegido));
    } else {
      setPosNo(elegido);
    }
    const n = intentosNoRef.current++;
    if (n === 0 || n === 2 || n === 5) {
      director.decir(FRASES_NO[Math.min(n === 0 ? 0 : n === 2 ? 1 : 2, FRASES_NO.length - 1)], "sorprendido", 4500);
    } else if (n === 8) {
      director.decir(FRASES_NO[3], "eureka", 4500);
    }
  };

  const elegirSi = () => {
    const root = ref.current;
    const btn = btnSiRef.current;
    if (root && btn) {
      const rect = root.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      lanzarGotas(br.left - rect.left + br.width / 2, br.top - rect.top + br.height / 2, 28, 260);
      simRef.current.enganchado = false;
      simRef.current.fuerza = 0;
      btn.style.transform = "";
      asegurarAnimacion();
    }
    setAtrapado(false);
    setAceptado(true);
    setPosNo(null);
    director.decir("¡Sabía que ibas a decir que sí! Te abro el mail para que me escribas.", "eureka", 6000);
    window.location.href = `mailto:${email}`;
  };

  return (
    // Abajo queda lugar para el científico y su globo.
    <div
      ref={ref}
      onPointerMove={moverMouse}
      onPointerLeave={salirMouse}
      className={`relative flex h-full w-full flex-col items-center justify-center px-4 text-center sm:pb-[4svh] ${
        atrapado ? "cursor-none" : ""
      }`}
    >
      {/* Capa de líquido verde estilo Venom (solo dibuja cuando el cursor se acerca al "Sí") */}
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-20 size-full" />

      <h2 className="linea brillo-portal font-display max-w-4xl text-[10vw] leading-[0.92] font-extrabold uppercase sm:text-[min(5.8vw,10svh)]">
        ¿Querés trabajar conmigo?
      </h2>

      {/* Botones Sí / No */}
      <div className="linea relative z-10 mt-8 flex min-h-14 items-center justify-center gap-4">
        {aceptado ? (
          <a
            href={`mailto:${email}`}
            className="rounded-full border border-lab-portal bg-lab-portal/15 px-6 py-2.5 font-mano text-xl text-lab-portal transition-colors hover:bg-lab-portal hover:text-lab-fondo sm:text-2xl"
          >
            ¡Atrapado! Abrir mail ↗
          </a>
        ) : (
          <>
            <button
              ref={btnSiRef}
              type="button"
              onClick={elegirSi}
              className={`relative z-10 rounded-full border-2 border-lab-portal bg-lab-portal px-8 py-2.5 font-display text-lg font-extrabold tracking-wide text-lab-fondo uppercase shadow-[0_0_28px_-4px_rgba(151,206,76,0.75)] transition-[box-shadow,background-color] duration-200 hover:shadow-[0_0_44px_2px_rgba(151,206,76,0.95)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lab-portal sm:px-10 sm:py-3 sm:text-xl ${
                atrapado ? "cursor-none" : "cursor-pointer"
              }`}
            >
              Sí
            </button>

            {/* Si el "No" ya huyó, dejamos su hueco para que el "Sí" no pegue un salto */}
            {posNo ? (
              <span aria-hidden className="inline-block w-24 sm:w-28" />
            ) : (
              <button
                ref={btnNoRef}
                type="button"
                onPointerEnter={(e) => escaparNo(e.clientX, e.clientY)}
                onPointerDown={(e) => {
                  e.preventDefault();
                  escaparNo(e.clientX, e.clientY);
                }}
                onClick={(e) => escaparNo(e.clientX, e.clientY)}
                className="cursor-pointer rounded-full border border-lab-borde bg-lab-panel px-8 py-2.5 font-display text-lg font-extrabold tracking-wide text-lab-tenue uppercase transition-colors hover:border-rose-400/60 hover:text-rose-200 sm:px-10 sm:py-3 sm:text-xl"
              >
                No
              </button>
            )}
          </>
        )}
      </div>

      {/* Botón "No" huyendo por toda la pantalla */}
      {posNo && !aceptado && (
        <button
          ref={btnNoRef}
          type="button"
          onPointerEnter={(e) => escaparNo(e.clientX, e.clientY)}
          onPointerDown={(e) => {
            e.preventDefault();
            escaparNo(e.clientX, e.clientY);
          }}
          onClick={(e) => escaparNo(e.clientX, e.clientY)}
          style={{ transform: `translate3d(${posNo.x}px, ${posNo.y}px, 0)` }}
          className="absolute top-0 left-0 z-30 cursor-pointer rounded-full border border-lab-borde bg-lab-panel px-8 py-2.5 font-display text-lg font-extrabold tracking-wide text-lab-tenue uppercase shadow-[0_12px_28px_-10px_rgba(0,0,0,0.85)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-rose-400/60 hover:text-rose-200 sm:px-10 sm:py-3 sm:text-xl"
        >
          No
        </button>
      )}

      <ul className="linea mt-8 flex flex-wrap justify-center gap-2.5 font-mono text-sm">
        {cv && (
          <li>
            <a
              href={cv}
              download
              className="inline-block rounded-full border border-lab-portal bg-lab-portal px-4 py-2 text-lab-fondo transition-colors hover:bg-transparent hover:text-lab-portal"
            >
              descargar CV ↓
            </a>
          </li>
        )}
        {redes.map((e) => (
          <li key={e.url}>
            <a
              href={e.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border border-lab-borde bg-lab-panel px-4 py-2 transition-colors hover:border-lab-portal hover:text-lab-portal"
            >
              {e.etiqueta} ↗
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
