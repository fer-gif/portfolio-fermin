// El científico en plena pose de empuje: inclinado, brazos rectos, zancada,
// gotas de sudor. Es un dibujo aparte del PersonajeSVG porque la pose cambia
// toda la silueta (piernas, torso), no solo los brazos.
export function PersonajeEmpujando({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 170 150" className={`personaje-empujando ${className}`} aria-hidden>
      {/* polvo que levantan los pies */}
      <g stroke="#8fa396" strokeWidth="2" strokeLinecap="round" opacity="0.6">
        <path d="M8 142 h10" />
        <path d="M4 147 h8" />
        <path d="M62 147 h9" />
      </g>

      {/* pierna de atrás, estirada */}
      <path d="M66 104 L26 138" stroke="#2b3640" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M14 144 L36 136 Q40 141 36 146 L16 148 Z" fill="#15191d" />

      {/* pierna de adelante, flexionada */}
      <path d="M86 108 L106 124 L98 142" stroke="#2b3640" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M88 146 L112 140 Q116 144 112 148 L90 150 Z" fill="#15191d" />

      {/* guardapolvo, inclinado hacia adelante */}
      <path d="M78 50 L116 58 L98 114 L56 106 Z" fill="#e9eef2" />
      <path d="M78 50 L96 54 L82 108 Z" fill="#d5dde3" />
      <path d="M96 54 L106 56 L96 86 Z" fill="#97ce4c" />

      {/* brazos rectos hacia la puerta */}
      <path d="M110 62 L154 52" stroke="#e9eef2" strokeWidth="12" strokeLinecap="round" />
      <path d="M106 74 L154 70" stroke="#e9eef2" strokeWidth="12" strokeLinecap="round" />
      {/* manos apoyadas */}
      <rect x="151" y="45" width="9" height="13" rx="3" fill="#f1c9a5" />
      <rect x="151" y="63" width="9" height="13" rx="3" fill="#f1c9a5" />

      {/* cabeza, mirando la puerta */}
      <g>
        <path
          className="pelo"
          d="M84 40 L56 14 L82 26 L74 0 L94 20 L104 -4 L110 20 L126 2 L122 26 L142 12 L132 36 L150 34 L130 46 Z"
          fill="#bbd1ea"
        />
        <ellipse cx="108" cy="36" rx="24" ry="25" fill="#f1c9a5" />
        {/* anteojos en la frente */}
        <rect x="86" y="14" width="42" height="5" rx="2" fill="#3a4a3f" transform="rotate(8 107 16)" />
        <circle cx="98" cy="17" r="6" fill="#97ce4c" stroke="#3a4a3f" strokeWidth="2" />
        <circle cx="118" cy="20" r="6" fill="#97ce4c" stroke="#3a4a3f" strokeWidth="2" />
        {/* uniceja fruncida */}
        <path d="M94 27 L108 31 L120 30 L130 26" stroke="#3a4a3f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* nariz */}
        <path d="M114 36 L121 46 L112 46 Z" fill="#dfae8a" />
        {/* ojos mirando a la derecha */}
        <circle cx="106" cy="37" r="5.5" fill="#fff" />
        <circle cx="122" cy="38" r="5.5" fill="#fff" />
        <circle cx="108" cy="38" r="2.4" fill="#1a1a1a" />
        <circle cx="124" cy="39" r="2.4" fill="#1a1a1a" />
        {/* dientes apretados */}
        <rect x="112" y="48" width="14" height="6" rx="2" fill="#fff" stroke="#7a4a3a" strokeWidth="1.5" />
        <path d="M117 48 v6 M121 48 v6" stroke="#7a4a3a" strokeWidth="1" />
      </g>

      {/* gotas de sudor */}
      <g fill="#8fd9ff">
        <path d="M82 30 q-4 6 0 8 q4 -2 0 -8z" />
        <path d="M138 28 q-4 6 0 8 q4 -2 0 -8z" />
        <path d="M134 44 q-3 5 0 6 q3 -1 0 -6z" />
      </g>
    </svg>
  );
}
