"use client";

import { useRef } from "react";
import { gsap, useEscena, useGSAP } from "@/components/recorrido";
import { SOCIOS, millones } from "../data/comercio";

const COLORES = ["bg-lab-portal", "bg-emerald-800", "bg-emerald-900", "bg-lab-borde", "bg-lab-borde", "bg-lab-panel"];

function Cinta({ titulo, datos }: { titulo: string; datos: typeof SOCIOS.exportaciones }) {
  return (
    <div className="cinta">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">{titulo}</h3>
        <span className="font-mono text-xs text-lab-tenue">
          {millones(datos.total)} · {datos.variacion > 0 ? "+" : ""}
          {datos.variacion.toLocaleString("es-AR")}%
        </span>
      </div>
      <div className="flex h-9 w-full gap-0.5 overflow-hidden rounded-md">
        {datos.partes.map((p, i) => (
          <div
            key={p.nombre}
            className={`segmento relative ${p.nombre === "Brasil" ? "bg-lab-portal" : COLORES[Math.min(i + 1, COLORES.length - 1)]} ${
              p.nombre === "Brasil" ? "" : "opacity-80"
            }`}
            style={{ width: `${p.pct}%` }}
            title={`${p.nombre} ${p.pct}%`}
          >
            {p.pct >= 9 && (
              <span className={`absolute inset-0 flex items-center justify-center font-mono text-[10px] ${p.nombre === "Brasil" ? "font-bold text-lab-fondo" : "text-lab-texto/80"}`}>
                {p.nombre} {p.pct.toLocaleString("es-AR")}%
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-1.5 font-mono text-[10px] text-lab-tenue">
        {datos.partes.filter((p) => p.pct < 9 && p.nombre !== "Resto").map((p) => `${p.nombre} ${p.pct}%`).join(" · ")}
      </p>
    </div>
  );
}

// Quién le compra y quién le vende a Argentina. Brasil, en verde, en los dos lados.
export function Socios() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".cinta", { opacity: 0, y: 16 });
      gsap.set(".segmento", { scaleX: 0, transformOrigin: "left center" });
      linea
        .to(".cinta", { opacity: 1, y: 0, duration: 0.5, stagger: 0.6 })
        .to(".segmento", { scaleX: 1, duration: 0.6, stagger: 0.07, ease: "power2.out" }, "<+=0.2")
        .to(".remate", { opacity: 1, duration: 0.5 }, "+=0.3")
        .to({}, { duration: 1 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="w-full max-w-3xl space-y-8">
        <p className="font-mono text-xs text-lab-tenue sm:text-sm">Socios comerciales de Argentina · 1S 2026</p>
        <Cinta titulo="¿A quién le vende Argentina?" datos={SOCIOS.exportaciones} />
        <Cinta titulo="¿A quién le compra?" datos={SOCIOS.importaciones} />
        <p className="remate text-center text-sm opacity-0 sm:text-base">
          Brasil es el primer cliente y el segundo proveedor. Y el que compra autos, no soja.
        </p>
      </div>
    </div>
  );
}
