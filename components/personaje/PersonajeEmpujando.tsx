// El científico en plena pose de empuje: inclinado, brazos rectos, zancada,
// gotas de sudor. Es un dibujo aparte del de Cientifico.tsx porque la pose cambia
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
      <path d="M96 54 L106 56 L96 86 Z" fill="#6fc3c1" />

      {/* brazos rectos hacia la puerta */}
      <path d="M110 62 L154 52" stroke="#e9eef2" strokeWidth="12" strokeLinecap="round" />
      <path d="M106 74 L154 70" stroke="#e9eef2" strokeWidth="12" strokeLinecap="round" />
      {/* manos apoyadas */}
      <rect x="151" y="45" width="9" height="13" rx="3" fill="#f1c9a5" />
      <rect x="151" y="63" width="9" height="13" rx="3" fill="#f1c9a5" />

      {/* cabeza, mirando la puerta */}
      <g>
        {/* pelo despeinado: el volumen atrás, el flequillo adelante */}
        <path
          className="pelo"
          d="M82.5 36.3 L78.6 33 L82.9 31.9 L75.8 24.8 L85.3 26 L76.7 13.8 L90.3 20.3 L84.5 1.8 L97.6 16.2 L100.4 -0.3 L106.2 14.4 L116.5 -4.5 L115 15.2 L130.9 2.5 L123 18.4 L140.8 12.7 L129.1 23.7 L143.5 24.8 L132.6 30.1 L139.6 34.7 L133.5 35.9 Z"
          fill="#3f2719"
        />
        <ellipse cx="85" cy="37" rx="3.6" ry="5.4" fill="#dfae8a" />
        <ellipse cx="108" cy="36" rx="24" ry="25" fill="#f1c9a5" />
        {/* barba de pocos días */}
        <ellipse cx="117" cy="56" rx="9" ry="3" fill="#553524" opacity="0.22" />
        <path
          d="M82.5 29.6 L81 18.6 L85 11 L93.7 6.3 L104.9 4.6 L116.2 5.5 L126.4 8.9 L133.5 15.6 L134.5 24.6 L130.9 20.3 L128.9 24.1 L124.8 18.6 L118.7 22 L115.1 16.9 L108.5 20.7 L104.4 16.1 L98.3 19.9 L94.7 15.2 L88.6 19.5 L86.1 23.3 L84.5 27.1 Z"
          fill="#573826"
        />
        {/* cejas fruncidas */}
        <path d="M94 29 L101 30 L107 32" stroke="#2e1b12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M115 31 L122 29 L129 27" stroke="#2e1b12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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
