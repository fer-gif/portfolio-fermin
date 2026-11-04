import { frascosDelStack, type Tecnologia } from "@/lib/tecnologias";

// El logo de una tecnología va sobre una etiqueta clara, como la de un frasco
// de laboratorio: así cada marca se ve con sus colores originales (GitHub y
// Vercel son negros, Pandas y MySQL azul oscuro) aunque el fondo sea oscuro.
export function EtiquetaLogo({ tec, className = "size-5" }: { tec: Tecnologia; className?: string }) {
  if (tec.tipo === "datos") {
    return (
      <span aria-hidden className={`grid shrink-0 place-items-center rounded-[5px] bg-lab-borde text-lab-celeste ${className}`}>
        {/* tabla de datos */}
        <svg viewBox="0 0 16 16" className="size-[70%]" fill="none" stroke="currentColor" strokeWidth="1.6">
          <ellipse cx="8" cy="3.5" rx="5.5" ry="2" />
          <path d="M2.5 3.5v9c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-9M2.5 8c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2" />
        </svg>
      </span>
    );
  }
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center rounded-[5px] bg-[#f4f8f1] p-[3px] shadow-[inset_0_-1px_0_rgba(0,0,0,0.12)] ${className}`}>
      {tec.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/logos/${tec.logo}.svg`} alt="" width={16} height={16} loading="lazy" decoding="async" className="size-full object-contain" />
      ) : (
        // sin logo oficial disponible: un tubo de ensayo
        <svg viewBox="0 0 16 16" className="size-full text-[#2c5a1c]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M6 1.5h4M6.8 1.5v8.2a1.2 1.2 0 0 1-.2.7L3.4 14.4h9.2L9.4 10.4a1.2 1.2 0 0 1-.2-.7V1.5" />
          <path d="M5 11.8h6" />
        </svg>
      )}
    </span>
  );
}

// Un chip de stack: etiqueta con el logo y el nombre.
export function ChipStack({ tec, className = "" }: { tec: Tecnologia; className?: string }) {
  return (
    <li
      className={`flex items-center gap-2 rounded-lg border border-lab-borde bg-lab-panel py-1 pr-2.5 pl-1 font-mono text-xs leading-none whitespace-nowrap text-lab-texto ${
        tec.tipo === "datos" ? "border-dashed text-lab-tenue" : ""
      } ${className}`}
    >
      <EtiquetaLogo tec={tec} />
      {tec.etiqueta}
    </li>
  );
}

// El stack completo de un proyecto, horizontal y con wrap.
export function LogoStack({ stack, className = "" }: { stack: string[]; className?: string }) {
  const frascos = frascosDelStack(stack);
  if (!frascos.length) return null;
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {frascos.map((tec) => (
        <ChipStack key={tec.etiqueta} tec={tec} />
      ))}
    </ul>
  );
}
