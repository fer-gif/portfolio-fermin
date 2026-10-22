"use client";

// La columna de pasos de una historia con datos (estilo The Pudding): el
// gráfico queda quieto y estos textos van pasando con el scroll. En pantalla
// grande se ven todos, con el actual resaltado; en celular, solo el actual.
export function Pasos({ pasos, actual }: { pasos: string[]; actual: number }) {
  return (
    <ol className="space-y-3">
      {pasos.map((texto, i) => {
        const activo = i === actual;
        return (
          <li
            key={i}
            className={`rounded-xl border px-4 py-3 text-sm leading-snug transition-all duration-500 sm:block ${
              activo
                ? "border-lab-portal bg-lab-panel text-lab-texto"
                : "hidden border-transparent text-lab-tenue/60 sm:block"
            }`}
          >
            <span className={`mr-2 font-mono text-xs ${activo ? "text-lab-portal" : ""}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            {texto}
          </li>
        );
      })}
    </ol>
  );
}
