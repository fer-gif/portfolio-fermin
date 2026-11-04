import { tecnologia } from "@/lib/tecnologias";
import { EtiquetaLogo } from "./LogoStack";

// Todo con lo que trabajo, agrupado y con el logo original de cada uno.
// Va en la salida del laboratorio y en el modo directo.
export function CajaDeHerramientas({
  herramientas,
  className = "",
}: {
  herramientas: { grupo: string; items: string[] }[];
  className?: string;
}) {
  return (
    <div className={`space-y-2.5 text-left ${className}`}>
      {herramientas.map(({ grupo, items }) => (
        <div key={grupo} className="grid gap-1.5 sm:grid-cols-[6.5rem_1fr] sm:items-start sm:gap-3">
          <p className="font-mano text-lg leading-7 text-lab-portal">{grupo}</p>
          <ul className="flex flex-wrap gap-1.5">
            {items.map((nombre) => {
              const tec = tecnologia(nombre);
              return (
                <li
                  key={nombre}
                  className="flex items-center gap-1.5 rounded-lg border border-lab-borde bg-lab-panel py-1 pr-2.5 pl-1 font-mono text-[11px] leading-none whitespace-nowrap text-lab-texto"
                >
                  <EtiquetaLogo tec={tec} />
                  {nombre}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
