// El banco de laboratorio sobre el que se apoya cada experimento: mesada,
// patas, una gradilla con tubos burbujeando, un frasco, pan recién hecho sobre
// una tabla (laboratorio = cocina), libros y un monitor con un gráfico.
const PATA = "#14282f";
const MADERA = "#1f3a42";
const MADERA_CLARA = "#2b4a52";

export function Banco({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 800 240"
      preserveAspectRatio="xMidYMax meet"
      className={`pointer-events-none ${className}`}
    >
      {/* patas y estante bajo */}
      <rect x="44" y="150" width="26" height="90" fill={PATA} />
      <rect x="730" y="150" width="26" height="90" fill={PATA} />
      <rect x="44" y="206" width="712" height="8" fill={PATA} />
      {/* mesada */}
      <rect x="0" y="134" width="800" height="18" rx="4" fill={MADERA} />
      <rect x="0" y="130" width="800" height="6" rx="3" fill={MADERA_CLARA} />

      {/* gradilla con tubos de ensayo */}
      <rect x="60" y="100" width="150" height="30" rx="4" fill={MADERA} />
      <rect x="60" y="112" width="150" height="6" fill={PATA} />
      {[
        { x: 76, color: "#97ce4c", alto: 34 },
        { x: 104, color: "#9ad9ea", alto: 26 },
        { x: 132, color: "#f2e05a", alto: 40 },
        { x: 160, color: "#97ce4c", alto: 22 },
        { x: 188, color: "#ef6ad4", alto: 30 },
      ].map((t, i) => (
        <g key={i}>
          <rect x={t.x - 7} y="46" width="14" height="80" rx="7" fill="#cfe9ff" opacity="0.16" />
          <rect x={t.x - 7} y={126 - t.alto} width="14" height={t.alto} rx="7" fill={t.color} opacity="0.6" />
          <circle className="burbuja-tubo" cx={t.x} cy="120" r="1.6" fill="#e6ffe0" style={{ animationDelay: `${i * 0.5}s` }} />
          <circle className="burbuja-tubo" cx={t.x + 3} cy="122" r="1.1" fill="#e6ffe0" style={{ animationDelay: `${i * 0.5 + 1.3}s` }} />
        </g>
      ))}

      {/* frasco cónico */}
      <path d="M236 70 h18 v18 l16 40 h-50 l16 -40 z" fill="#cfe9ff" opacity="0.16" />
      <path d="M228 108 l-8 20 h50 l-8 -20 z" fill="#97ce4c" opacity="0.55" />

      {/* la tabla con el pan: una hogaza con sus cortes, una baguette y el frasco de masa madre */}
      <rect x="300" y="124" width="136" height="9" rx="3" fill="#7a4e2e" />
      <rect x="436" y="126" width="22" height="5" rx="2.5" fill="#7a4e2e" />
      <ellipse cx="344" cy="110" rx="32" ry="17" fill="#c8925a" />
      <ellipse cx="344" cy="104" rx="26" ry="10" fill="#d9a86d" opacity="0.7" />
      <path d="M326 108 q18 -12 36 0 M332 114 q12 -8 24 0" stroke="#7a4e2e" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <g transform="rotate(-9 404 114)">
        <rect x="378" y="106" width="52" height="15" rx="7.5" fill="#d9a86d" />
        <path d="M388 108 l5 10 M400 107 l5 10 M412 107 l5 10" stroke="#8a5a3a" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <rect x="470" y="94" width="28" height="38" rx="4" fill="#cfe9ff" opacity="0.18" />
      <rect x="470" y="112" width="28" height="20" rx="4" fill="#e8d8b8" opacity="0.6" />
      <rect x="468" y="90" width="32" height="7" rx="2" fill={MADERA_CLARA} />
      <circle cx="476" cy="104" r="1.5" fill="#fff" opacity="0.5" />
      <circle cx="488" cy="100" r="1" fill="#fff" opacity="0.5" />

      {/* libros */}
      <rect x="520" y="110" width="14" height="22" fill={MADERA_CLARA} />
      <rect x="536" y="104" width="12" height="28" fill="#3a5a63" />
      <rect x="550" y="114" width="16" height="18" fill={MADERA} />

      {/* monitor con gráfico */}
      <rect x="640" y="124" width="60" height="8" rx="2" fill={PATA} />
      <rect x="664" y="104" width="12" height="22" fill={PATA} />
      <rect x="596" y="36" width="150" height="76" rx="6" fill="#1a2f36" />
      <g className="pantalla">
        <rect x="604" y="44" width="134" height="60" rx="3" fill="#0b1b20" />
        {[14, 30, 22, 44, 36, 52].map((h, i) => (
          <rect key={i} x={614 + i * 20} y={98 - h} width="12" height={h} fill="#97ce4c" opacity={0.35 + i * 0.1} />
        ))}
      </g>
    </svg>
  );
}
