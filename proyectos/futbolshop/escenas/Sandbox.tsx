"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useEscena, useGSAP } from "@/components/recorrido";
import { desbloquear } from "@/components/laboratorio/logros";
import { CATALOGO, CATEGORIAS, MOTIVOS, type Motivo, type Movimiento, type Producto } from "../data/catalogo";
import { aplicarPorcentaje, formatearMoneda } from "../dinero";

type Existencia = "todos" | "con" | "sin";
type Operacion = "sumar" | "restar" | "fijar";
interface Ajuste {
  operacion: Operacion;
  cantidad: string;
}
interface Confirmacion {
  porcentaje: number;
  cantidad: number;
}

const stockDe = (p: Producto) => p.variantes.reduce((a, v) => a + v.stock, 0);
const precioDesde = (p: Producto) => Math.min(...p.variantes.map((v) => v.precio));

// Botón estilo panel: amarillo el principal, borde el secundario.
function Boton({
  children,
  principal = false,
  onClick,
  disabled,
  titulo,
}: {
  children: ReactNode;
  principal?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  titulo?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={titulo}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        principal
          ? "bg-yellow-400 text-slate-900 hover:bg-yellow-300"
          : "border border-slate-600 text-slate-200 hover:border-yellow-400 hover:text-yellow-300"
      }`}
    >
      {children}
    </button>
  );
}

// Un pop-up dentro del panel: título, cerrar, cuerpo que scrollea y pie.
function PopUp({ titulo, onCerrar, children, pie }: { titulo: string; onCerrar: () => void; children: ReactNode; pie?: ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-slate-950/70 p-3 sm:p-6" role="dialog" aria-modal aria-label={titulo}>
      <div className="flex max-h-full w-full max-w-xl flex-col overflow-hidden rounded-xl border border-slate-600 bg-[#141c2b] shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-700 px-4 py-2.5">
          <h4 className="text-sm font-semibold text-slate-100">{titulo}</h4>
          <button type="button" onClick={onCerrar} className="rounded px-2 text-slate-400 hover:text-yellow-300" aria-label="Cerrar">
            ×
          </button>
        </header>
        <div className="min-h-0 overflow-y-auto p-4 text-xs text-slate-200" data-desborda>
          {children}
        </div>
        {pie && <footer className="flex flex-wrap justify-end gap-2 border-t border-slate-700 px-4 py-2.5">{pie}</footer>}
      </div>
    </div>
  );
}

// La copia de juguete del inventario de Muove Stock: buscar mientras
// escribís, filtrar, acciones masivas con confirmación, pop-up de detalle y
// ajuste de stock con motivo. Todo vive en memoria; nada sale de acá.
export function Sandbox() {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const [productos, setProductos] = useState<Producto[]>(() => CATALOGO.map((p) => ({ ...p, variantes: p.variantes.map((v) => ({ ...v })) })));
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [existencia, setExistencia] = useState<Existencia>("todos");
  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [detalleId, setDetalleId] = useState<string | null>(null);
  const [ajustes, setAjustes] = useState<Record<string, Ajuste>>({});
  const [pidiendoMotivo, setPidiendoMotivo] = useState(false);
  const [motivo, setMotivo] = useState<Motivo>("Conteo");
  const [confirmacion, setConfirmacion] = useState<Confirmacion | null>(null);
  const [historial, setHistorial] = useState<Movimiento[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);
  // Ids para copias y movimientos: un contador, nada de relojes.
  const siguienteId = useRef(1);
  const nuevoId = () => siguienteId.current++;

  useGSAP(
    () => {
      linea.fromTo(".panel", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2 }).to({}, { duration: 2 });
    },
    { scope: ref },
  );

  // El mensaje verde se va solo.
  useEffect(() => {
    if (!aviso) return;
    const id = setTimeout(() => setAviso(null), 3200);
    return () => clearTimeout(id);
  }, [aviso]);

  // Escape cierra el pop-up de más arriba.
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (pidiendoMotivo) setPidiendoMotivo(false);
      else if (confirmacion) setConfirmacion(null);
      else if (detalleId) setDetalleId(null);
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [pidiendoMotivo, confirmacion, detalleId]);

  // Búsqueda por palabras: todas tienen que aparecer, en cualquier orden.
  const visibles = useMemo(() => {
    const palabras = busqueda.toLowerCase().split(/\s+/).filter(Boolean);
    return productos.filter((p) => {
      const texto = `${p.nombre} ${p.categoria} ${p.sku}`.toLowerCase();
      if (!palabras.every((w) => texto.includes(w))) return false;
      if (categoria !== "todas" && p.categoria !== categoria) return false;
      const stock = stockDe(p);
      if (existencia === "con" && stock === 0) return false;
      if (existencia === "sin" && stock > 0) return false;
      return true;
    });
  }, [productos, busqueda, categoria, existencia]);

  const detalle = productos.find((p) => p.id === detalleId) ?? null;
  const todosMarcados = visibles.length > 0 && visibles.every((p) => seleccion.includes(p.id));

  const alternar = (id: string) => setSeleccion((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const alternarTodos = () => setSeleccion(todosMarcados ? [] : visibles.map((p) => p.id));

  const aplicarPrecios = () => {
    if (!confirmacion) return;
    const { porcentaje } = confirmacion;
    setProductos((ps) =>
      ps.map((p) =>
        seleccion.includes(p.id) ? { ...p, variantes: p.variantes.map((v) => ({ ...v, precio: aplicarPorcentaje(v.precio, porcentaje) })) } : p,
      ),
    );
    setAviso(`Listo: ${seleccion.length} ${seleccion.length === 1 ? "producto actualizado" : "productos actualizados"}. Los precios se recalcularon en centavos enteros.`);
    desbloquear("inventario");
    setConfirmacion(null);
    setSeleccion([]);
  };

  const duplicar = () => {
    const copias = productos
      .filter((p) => seleccion.includes(p.id))
      .map((p) => {
        const n = nuevoId();
        return {
          ...p,
          id: `${p.id}-copia-${n}`,
          nombre: `${p.nombre} (copia)`,
          sku: `${p.sku}-C${n}`,
          variantes: p.variantes.map((v) => ({ ...v, id: `${v.id}-copia-${n}`, stock: 0 })),
        };
      });
    setProductos((ps) => [...ps, ...copias]);
    setAviso(`${copias.length === 1 ? "Producto duplicado" : `${copias.length} productos duplicados`}, con stock en 0 para que lo cargues.`);
    setSeleccion([]);
  };

  // Cuánto queda en una variante después del ajuste que se está escribiendo.
  const quedaDe = (stock: number, ajuste?: Ajuste) => {
    const cantidad = Number(ajuste?.cantidad);
    if (!ajuste || !ajuste.cantidad || Number.isNaN(cantidad)) return { queda: stock, exceso: 0 };
    if (ajuste.operacion === "fijar") return { queda: Math.max(0, cantidad), exceso: 0 };
    if (ajuste.operacion === "sumar") return { queda: stock + cantidad, exceso: 0 };
    return { queda: Math.max(0, stock - cantidad), exceso: Math.max(0, cantidad - stock) };
  };
  const hayAjustes = detalle ? detalle.variantes.some((v) => quedaDe(v.stock, ajustes[v.id]).queda !== v.stock) : false;

  const guardarAjuste = () => {
    if (!detalle) return;
    // Se calcula todo acá, con el estado actual, y recién después se guarda:
    // los actualizadores de estado tienen que ser puros.
    const movimientos: Movimiento[] = [];
    const variantes = detalle.variantes.map((v) => {
      const { queda } = quedaDe(v.stock, ajustes[v.id]);
      if (queda !== v.stock) movimientos.push({ id: nuevoId(), producto: detalle.nombre, variante: v.nombre, antes: v.stock, despues: queda, motivo });
      return { ...v, stock: queda };
    });
    setProductos((ps) => ps.map((p) => (p.id === detalle.id ? { ...p, variantes } : p)));
    setHistorial((h) => [...movimientos, ...h].slice(0, 30));
    setAjustes({});
    setPidiendoMotivo(false);
    setAviso(`Ajuste guardado: ${movimientos.length} ${movimientos.length === 1 ? "variante" : "variantes"}. Queda en el historial con tu nombre y el motivo.`);
    desbloquear("inventario");
  };

  const pildora = (valor: Existencia, etiqueta: string) => (
    <button
      type="button"
      onClick={() => setExistencia(valor)}
      className={`rounded-full px-3 py-1 text-xs transition-colors ${existencia === valor ? "bg-yellow-400 font-semibold text-slate-900" : "text-slate-300 hover:text-white"}`}
    >
      {etiqueta}
    </button>
  );

  return (
    <div ref={ref} className="grid h-full place-items-center px-4">
      <div className="panel relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-[#0f1623] text-slate-200 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
        {/* barra del sistema */}
        <header className="flex items-center justify-between gap-3 border-b border-slate-700 bg-[#0b111c] px-4 py-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold tracking-tight text-yellow-400">Muove Stock</span>
            <span className="hidden text-xs text-slate-400 sm:inline">Inventario › Productos</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:inline">Hola, visitante</span>
            <span className="rounded-full bg-yellow-400/15 px-2 py-0.5 font-mono text-[10px] text-yellow-300">copia de juguete</span>
          </div>
        </header>

        {/* filtros */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-700 px-4 py-2.5">
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscá mientras escribís: «remera L», «arquero», «FS-»"
            className="min-w-0 flex-1 rounded-full border border-slate-600 bg-[#141c2b] px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-yellow-400 focus:outline-none sm:min-w-64"
            aria-label="Buscar productos"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="rounded-full border border-slate-600 bg-[#141c2b] px-3 py-1.5 text-xs text-slate-100 focus:border-yellow-400 focus:outline-none"
            aria-label="Categoría"
          >
            <option value="todas">Todas las categorías</option>
            {CATEGORIAS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <div className="flex rounded-full border border-slate-600 p-0.5">
            {pildora("todos", "Todos")}
            {pildora("con", "Con stock")}
            {pildora("sin", "Sin stock")}
          </div>
        </div>

        {/* acciones masivas */}
        <div className={`flex flex-wrap items-center gap-2 border-b border-slate-700 px-4 py-2 text-xs transition-colors ${seleccion.length ? "bg-yellow-400/10" : ""}`}>
          {seleccion.length ? (
            <>
              <span className="font-medium text-yellow-300">
                {seleccion.length} {seleccion.length === 1 ? "seleccionado" : "seleccionados"}
              </span>
              <Boton principal onClick={() => setConfirmacion({ porcentaje: 10, cantidad: seleccion.length })}>
                Subir precios 10 %
              </Boton>
              <Boton onClick={() => setConfirmacion({ porcentaje: -10, cantidad: seleccion.length })}>Bajar precios 10 %</Boton>
              <Boton onClick={duplicar}>Duplicar</Boton>
              <button type="button" onClick={() => setSeleccion([])} className="ml-auto text-slate-400 underline-offset-2 hover:underline">
                Quitar selección
              </button>
            </>
          ) : (
            <span className="text-slate-500">Tildá productos para las acciones masivas · tocá un nombre para ver el detalle y ajustar stock</span>
          )}
        </div>

        {/* la lista */}
        <div className="min-h-0 overflow-auto" data-desborda>
          <table className="w-full min-w-[28rem] border-collapse text-xs sm:min-w-[34rem]">
            <thead className="sticky top-0 bg-[#141c2b] text-left text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="w-8 px-3 py-2">
                  <input type="checkbox" checked={todosMarcados} onChange={alternarTodos} aria-label="Seleccionar todos" className="accent-yellow-400" />
                </th>
                <th className="px-3 py-2">Nombre</th>
                <th className="hidden px-3 py-2 sm:table-cell">Categoría</th>
                <th className="px-3 py-2 text-right">Variantes</th>
                <th className="px-3 py-2 text-right">Stock</th>
                <th className="px-3 py-2 text-right">Precio desde</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((p) => {
                const stock = stockDe(p);
                return (
                  <tr key={p.id} className={`border-t border-slate-800 transition-colors hover:bg-[#141c2b] ${seleccion.includes(p.id) ? "bg-yellow-400/5" : ""}`}>
                    <td className="px-3 py-2">
                      <input type="checkbox" checked={seleccion.includes(p.id)} onChange={() => alternar(p.id)} aria-label={`Seleccionar ${p.nombre}`} className="accent-yellow-400" />
                    </td>
                    <td className="px-3 py-2">
                      <button type="button" onClick={() => setDetalleId(p.id)} className="text-left font-medium text-slate-100 underline-offset-2 hover:text-yellow-300 hover:underline">
                        {p.nombre}
                      </button>
                      <span className="ml-2 font-mono text-[10px] text-slate-500">{p.sku}</span>
                    </td>
                    <td className="hidden px-3 py-2 text-slate-400 sm:table-cell">{p.categoria}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{p.variantes.length}</td>
                    <td className={`px-3 py-2 text-right font-mono tabular-nums ${stock === 0 ? "text-rose-300" : ""}`}>{stock}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">{formatearMoneda(precioDesde(p))}</td>
                  </tr>
                );
              })}
              {visibles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-400">
                    No hay productos que coincidan con «{busqueda}»{categoria !== "todas" && ` en ${categoria}`}. Probá con menos palabras o cambiá el filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between border-t border-slate-700 px-4 py-1.5 font-mono text-[10px] text-slate-500">
          <span>
            mostrando {visibles.length} de {productos.length} productos
          </span>
          <span>FutbolShop · sistema a medida · Muove</span>
        </footer>

        {/* mensaje verde */}
        {aviso && (
          <div className="pointer-events-none absolute inset-x-4 bottom-10 z-30 rounded-lg border border-emerald-500/50 bg-emerald-950/95 px-4 py-2 text-xs text-emerald-100 shadow-lg sm:inset-x-auto sm:right-4 sm:max-w-sm" role="status">
            {aviso}
          </div>
        )}

        {/* detalle del producto + ajuste de stock */}
        {detalle && (
          <PopUp
            titulo={detalle.nombre}
            onCerrar={() => {
              setDetalleId(null);
              setAjustes({});
            }}
            pie={
              <>
                <Boton onClick={() => setDetalleId(null)}>Cerrar</Boton>
                <Boton principal disabled={!hayAjustes} onClick={() => setPidiendoMotivo(true)} titulo={hayAjustes ? undefined : "Escribí una cantidad en alguna variante"}>
                  Confirmar ajuste
                </Boton>
              </>
            }
          >
            <p className="text-slate-400">
              {detalle.categoria} · <span className="font-mono">{detalle.sku}</span>
            </p>
            <p className="mt-3 text-slate-300">
              Ajuste de stock: elegí qué pasó con cada variante y mirá cuánto queda antes de confirmar. Cada cambio se registra con tu nombre y un motivo.
            </p>
            <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[26rem] text-xs">
              <thead className="text-left text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-1.5">Variante</th>
                  <th className="hidden py-1.5 text-right sm:table-cell">Precio</th>
                  <th className="py-1.5 text-right">Stock ahora</th>
                  <th className="py-1.5 pl-3">Operación</th>
                  <th className="py-1.5 text-right">Cantidad</th>
                  <th className="py-1.5 text-right">Queda</th>
                </tr>
              </thead>
              <tbody>
                {detalle.variantes.map((v) => {
                  const ajuste = ajustes[v.id] ?? { operacion: "restar" as Operacion, cantidad: "" };
                  const { queda, exceso } = quedaDe(v.stock, ajuste);
                  const fijar = (parcial: Partial<Ajuste>) => setAjustes((a) => ({ ...a, [v.id]: { ...ajuste, ...parcial } }));
                  return (
                    <tr key={v.id} className="border-t border-slate-800">
                      <td className="py-1.5 font-medium">{v.nombre}</td>
                      <td className="hidden py-1.5 text-right font-mono tabular-nums text-slate-400 sm:table-cell">{formatearMoneda(v.precio)}</td>
                      <td className="py-1.5 text-right font-mono tabular-nums">{v.stock}</td>
                      <td className="py-1.5 pl-3">
                        <select
                          value={ajuste.operacion}
                          onChange={(e) => fijar({ operacion: e.target.value as Operacion })}
                          className="rounded border border-slate-600 bg-[#0f1623] px-1.5 py-1 text-xs focus:border-yellow-400 focus:outline-none"
                          aria-label={`Operación para ${v.nombre}`}
                        >
                          <option value="sumar">Sumar</option>
                          <option value="restar">Restar</option>
                          <option value="fijar">Fijar en</option>
                        </select>
                      </td>
                      <td className="py-1.5 text-right">
                        <input
                          type="number"
                          min={0}
                          inputMode="numeric"
                          value={ajuste.cantidad}
                          onChange={(e) => fijar({ cantidad: e.target.value })}
                          placeholder="0"
                          className="w-16 rounded border border-slate-600 bg-[#0f1623] px-1.5 py-1 text-right font-mono text-xs focus:border-yellow-400 focus:outline-none"
                          aria-label={`Cantidad para ${v.nombre}`}
                        />
                      </td>
                      <td className={`py-1.5 text-right font-mono tabular-nums ${queda !== v.stock ? "font-semibold text-yellow-300" : ""}`}>
                        {queda}
                        {exceso > 0 && (
                          <span className="block text-[10px] font-normal text-rose-300">
                            Quedan solo {v.stock}: no se pueden sacar {Number(ajuste.cantidad)}.
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
            {historial.some((m) => m.producto === detalle.nombre) && (
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Historial de stock</p>
                <ul className="mt-1 space-y-1 font-mono text-[11px] text-slate-300">
                  {historial
                    .filter((m) => m.producto === detalle.nombre)
                    .slice(0, 5)
                    .map((m) => (
                      <li key={m.id}>
                        {m.variante}: {m.antes} → {m.despues} · {m.motivo} · visitante · recién
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </PopUp>
        )}

        {/* motivo del ajuste */}
        {pidiendoMotivo && detalle && (
          <PopUp
            titulo="¿Qué pasó con el stock?"
            onCerrar={() => setPidiendoMotivo(false)}
            pie={
              <>
                <Boton onClick={() => setPidiendoMotivo(false)}>Volver</Boton>
                <Boton principal onClick={guardarAjuste}>
                  Guardar ajuste
                </Boton>
              </>
            }
          >
            <p className="text-slate-300">Un solo motivo para todo el ajuste. Queda en el historial, al lado de tu nombre.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {MOTIVOS.map((m) => (
                <label key={m} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 ${motivo === m ? "border-yellow-400 bg-yellow-400/10" : "border-slate-700"}`}>
                  <input type="radio" name="motivo" checked={motivo === m} onChange={() => setMotivo(m)} className="accent-yellow-400" />
                  {m}
                </label>
              ))}
            </div>
          </PopUp>
        )}

        {/* confirmación de precios */}
        {confirmacion && (
          <PopUp
            titulo={`${confirmacion.porcentaje > 0 ? "Subir" : "Bajar"} precios ${Math.abs(confirmacion.porcentaje)} %`}
            onCerrar={() => setConfirmacion(null)}
            pie={
              <>
                <Boton onClick={() => setConfirmacion(null)}>Cancelar</Boton>
                <Boton principal onClick={aplicarPrecios}>
                  Aplicar a {confirmacion.cantidad} {confirmacion.cantidad === 1 ? "producto" : "productos"}
                </Boton>
              </>
            }
          >
            <p>
              Se {confirmacion.porcentaje > 0 ? "sube" : "baja"} un {Math.abs(confirmacion.porcentaje)} % el precio de todas las variantes de los productos tildados.
            </p>
            <p className="mt-2 text-slate-400">
              Se calcula en centavos enteros y sin redondear a valores lindos, como pidió el cliente. Y no es reversible: subir 10 % y bajar 10 % no vuelve al original.
            </p>
          </PopUp>
        )}
      </div>
    </div>
  );
}
