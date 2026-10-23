"use client";

import { useRef, useState } from "react";
import { useEscena, useGSAP } from "@/components/recorrido";
import { calcular, estimarConsumo, pesos } from "../calcular";
import { CONSUMO_BASE_JUNIN, DESCUENTOS, FACTORES } from "../data/tarifas";

type Modo = "estimador" | "manual";

function Pildoras<T extends number>({
  opciones,
  valor,
  onChange,
}: {
  opciones: { valor: T; etiqueta: string; detalle?: string }[];
  valor: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          onClick={() => onChange(o.valor)}
          title={o.detalle}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            valor === o.valor
              ? "border-lab-portal bg-lab-portal text-lab-fondo"
              : "border-lab-borde text-lab-tenue hover:border-lab-portal hover:text-lab-texto"
          }`}
        >
          {o.etiqueta}
        </button>
      ))}
    </div>
  );
}

// La calculadora: el visitante describe su casa (o pone los m³ a mano)
// y ve cuánto paga de gas en julio con y sin Zona Fría.
export function Calculadora() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const [modo, setModo] = useState<Modo>("estimador");
  const [vivienda, setVivienda] = useState(1);
  const [calefaccion, setCalefaccion] = useState(1);
  const [personas, setPersonas] = useState(1);
  const [manual, setManual] = useState(CONSUMO_BASE_JUNIN);
  const [descuento, setDescuento] = useState(0.3);

  const consumo = modo === "estimador" ? estimarConsumo(vivienda, calefaccion, personas) : manual;
  const r = calcular(consumo, descuento);

  useGSAP(
    () => {
      linea.fromTo(".panel", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2 }).to({}, { duration: 2 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="panel flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-lab-borde bg-lab-panel">
        <header className="flex items-center gap-2 border-b border-lab-borde px-4 py-2 font-mono text-xs uppercase tracking-wider text-lab-portal">
          <span className="size-2 rounded-full bg-lab-portal" aria-hidden />
          ¿Cuánto vas a pagar de gas?
        </header>

        <div className="grid min-h-0 gap-5 overflow-y-auto p-4 sm:grid-cols-[1fr_15rem] sm:p-5" data-desborda>
          <div className="space-y-4">
            <div className="flex gap-1 font-mono text-xs">
              {(["estimador", "manual"] as Modo[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModo(m)}
                  className={`rounded-md px-2.5 py-1 ${modo === m ? "bg-lab-borde text-lab-texto" : "text-lab-tenue"}`}
                >
                  {m === "estimador" ? "Describí tu casa" : "Sé mis m³"}
                </button>
              ))}
            </div>

            {modo === "estimador" ? (
              <>
                <label className="block text-xs">
                  <span className="mb-1.5 block font-mono text-lab-tenue">Vivienda</span>
                  <Pildoras opciones={FACTORES.vivienda} valor={vivienda} onChange={setVivienda} />
                </label>
                <label className="block text-xs">
                  <span className="mb-1.5 block font-mono text-lab-tenue">Calefacción</span>
                  <Pildoras opciones={FACTORES.calefaccion} valor={calefaccion} onChange={setCalefaccion} />
                </label>
                <label className="block text-xs">
                  <span className="mb-1.5 block font-mono text-lab-tenue">Integrantes</span>
                  <Pildoras opciones={FACTORES.personas} valor={personas} onChange={setPersonas} />
                </label>
              </>
            ) : (
              <label className="block text-xs">
                <span className="mb-1.5 flex justify-between font-mono text-lab-tenue">
                  Consumo en julio <span className="text-lab-texto">{manual} m³</span>
                </span>
                <input
                  type="range"
                  min={30}
                  max={800}
                  value={manual}
                  onChange={(e) => setManual(Number(e.target.value))}
                  className="w-full accent-lab-portal"
                />
              </label>
            )}

            <label className="block text-xs">
              <span className="mb-1.5 block font-mono text-lab-tenue">Descuento Zona Fría</span>
              <Pildoras opciones={DESCUENTOS} valor={descuento} onChange={setDescuento} />
            </label>
          </div>

          <div className="rounded-lg border border-lab-borde bg-lab-fondo p-4 text-sm">
            <p className="font-mono text-xs text-lab-tenue">
              {r.consumo.toLocaleString("es-AR")} m³/mes · categoría {r.categoria.id} · bloque subsidiado {r.categoria.umbral} m³
            </p>
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between">
                <dt className="text-lab-tenue">Con Zona Fría</dt>
                <dd className="font-mono tabular-nums">{pesos(r.conZonaFria)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-lab-tenue">Sin Zona Fría</dt>
                <dd className="font-mono tabular-nums">{pesos(r.sinZonaFria)}</dd>
              </div>
              <div className="flex justify-between border-t border-lab-borde pt-2 text-base font-semibold">
                <dt>Te cuesta</dt>
                <dd className="font-mono tabular-nums text-lab-portal">+{pesos(r.diferencia)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-lab-tenue">
              {modo === "estimador"
                ? Math.abs(r.desvio) <= 2
                  ? "Tu consumo está alineado al promedio de Junín (280 m³)."
                  : `Tu hogar consume un ${Math.abs(r.desvio)}% ${r.desvio > 0 ? "más" : "menos"} que el promedio de Junín.`
                : "Valor ingresado a mano."}
            </p>
            <p className="mt-2 text-[10px] text-lab-tenue/70">Incluye IVA 21% y tasa provincial 4%. Sin tasas municipales.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
