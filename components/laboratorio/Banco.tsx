// El banco de laboratorio sobre el que se apoya cada experimento: mesada,
// patas, una gradilla con tubos burbujeando, un monitor con un gráfico, libros.
export function Banco({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 800 240"
      preserveAspectRatio="xMidYMax meet"
      className={`pointer-events-none ${className}`}
    >
      {/* patas y estante bajo */}
      <rect x="44" y="150" width="26" height="90" fill="#15201a" />
      <rect x="730" y="150" width="26" height="90" fill="#15201a" />
      <rect x="44" y="206" width="712" height="8" fill="#15201a" />
      {/* mesada */}
      <rect x="0" y="134" width="800" height="18" rx="4" fill="#1b2620" />
      <rect x="0" y="130" width="800" height="6" rx="3" fill="#2b3a31" />

      {/* gradilla con tubos de ensayo */}
      <rect x="60" y="100" width="150" height="30" rx="4" fill="#1b2620" />
      <rect x="60" y="112" width="150" height="6" fill="#15201a" />
      {[
        { x: 76, color: "#7ee35b", alto: 34 },
        { x: 104, color: "#5bc8e3", alto: 26 },
        { x: 132, color: "#e3a75b", alto: 40 },
        { x: 160, color: "#7ee35b", alto: 22 },
        { x: 188, color: "#e35b8f", alto: 30 },
      ].map((t, i) => (
        <g key={i}>
          <rect x={t.x - 7} y="46" width="14" height="80" rx="7" fill="#cfe9ff" opacity="0.16" />
          <rect x={t.x - 7} y={126 - t.alto} width="14" height={t.alto} rx="7" fill={t.color} opacity="0.55" />
          <circle className="burbuja-tubo" cx={t.x} cy="120" r="1.6" fill="#e6ffe0" style={{ animationDelay: `${i * 0.5}s` }} />
          <circle className="burbuja-tubo" cx={t.x + 3} cy="122" r="1.1" fill="#e6ffe0" style={{ animationDelay: `${i * 0.5 + 1.3}s` }} />
        </g>
      ))}

      {/* frasco cónico */}
      <path d="M236 70 h18 v18 l16 40 h-50 l16 -40 z" fill="#cfe9ff" opacity="0.16" />
      <path d="M228 108 l-8 20 h50 l-8 -20 z" fill="#7ee35b" opacity="0.5" />

      {/* libros */}
      <rect x="520" y="110" width="14" height="22" fill="#2b3a31" />
      <rect x="536" y="104" width="12" height="28" fill="#3a4a3f" />
      <rect x="550" y="114" width="16" height="18" fill="#243129" />

      {/* monitor con gráfico */}
      <rect x="640" y="124" width="60" height="8" rx="2" fill="#15201a" />
      <rect x="664" y="104" width="12" height="22" fill="#15201a" />
      <rect x="596" y="36" width="150" height="76" rx="6" fill="#1a2420" />
      <g className="pantalla">
        <rect x="604" y="44" width="134" height="60" rx="3" fill="#0f1a14" />
        {[14, 30, 22, 44, 36, 52].map((h, i) => (
          <rect key={i} x={614 + i * 20} y={98 - h} width="12" height={h} fill="#7ee35b" opacity={0.35 + i * 0.1} />
        ))}
      </g>
    </svg>
  );
}
