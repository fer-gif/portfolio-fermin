import type { Pose } from "./guion";

// Versión 0 del científico: un dibujo simple para construir todo el recorrido
// sin esperar al personaje definitivo (Rive). Las poses y la "vida" (respirar,
// parpadear, burbujas) viven en personaje.css y se disparan con la clase pose-*.
export function PersonajeSVG({ pose, className = "" }: { pose: Pose; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 150"
      className={`personaje-svg pose-${pose} ${className}`}
      aria-hidden
    >
      <g className="cuerpo">
        {/* piernas */}
        <rect x="42" y="118" width="14" height="28" rx="4" fill="#2b3640" />
        <rect x="64" y="118" width="14" height="28" rx="4" fill="#2b3640" />
        <rect x="40" y="140" width="18" height="8" rx="3" fill="#15191d" />
        <rect x="62" y="140" width="18" height="8" rx="3" fill="#15191d" />

        {/* bata */}
        <path d="M36 72 L84 72 L90 124 L30 124 Z" fill="#e9eef2" />
        <path d="M54 72 L66 72 L62 104 L58 104 Z" fill="#7ee35b" />
        <path d="M36 72 L54 72 L52 110 Z" fill="#d5dde3" />
        <path d="M84 72 L66 72 L68 110 Z" fill="#d5dde3" />

        {/* brazo con el frasco (izquierda del visitante) */}
        <g className="brazo-frasco">
          <rect x="26" y="74" width="12" height="38" rx="6" fill="#e9eef2" />
          <circle cx="32" cy="114" r="5.5" fill="#f1c9a5" />
          <g className="frasco">
            <path d="M28 96 h8 v8 l8 16 h-24 l8 -16 z" fill="#cfe9ff" opacity="0.85" />
            <path d="M24 110 l-4 10 h24 l-4 -10 z" fill="#7ee35b" opacity="0.9" />
            <circle className="burbuja-frasco" cx="30" cy="118" r="1.4" fill="#e6ffe0" />
            <circle className="burbuja-frasco" cx="35" cy="119" r="1" fill="#e6ffe0" />
          </g>
        </g>

        {/* brazo que señala (derecha del visitante) */}
        <g className="brazo-senala">
          <rect x="82" y="74" width="12" height="38" rx="6" fill="#e9eef2" />
          <circle cx="88" cy="114" r="5.5" fill="#f1c9a5" />
          <rect x="87" y="112" width="3" height="9" rx="1.5" fill="#f1c9a5" />
        </g>

        {/* cabeza */}
        <g className="cabeza">
          <path
            className="pelo"
            d="M30 44 L22 14 L38 30 L42 4 L54 28 L62 0 L70 28 L82 6 L82 30 L98 14 L90 44 Z"
            fill="#bbd1ea"
          />
          <ellipse cx="60" cy="50" rx="25" ry="27" fill="#f1c9a5" />
          <ellipse cx="60" cy="70" rx="14" ry="6" fill="#b8b1a7" opacity="0.35" />

          {/* anteojos en la frente */}
          <rect x="38" y="27" width="44" height="5" rx="2" fill="#3a4a3f" />
          <circle cx="49" cy="29" r="6.5" fill="#7ee35b" stroke="#3a4a3f" strokeWidth="2" />
          <circle cx="71" cy="29" r="6.5" fill="#7ee35b" stroke="#3a4a3f" strokeWidth="2" />

          {/* cejas */}
          <path className="ceja" d="M42 40 q7 -5 14 0" stroke="#3a4a3f" strokeWidth="2.2" fill="none" />
          <path className="ceja" d="M64 40 q7 -5 14 0" stroke="#3a4a3f" strokeWidth="2.2" fill="none" />

          {/* ojos */}
          <g className="ojos">
            <circle cx="50" cy="50" r="6.5" fill="#fff" />
            <circle cx="70" cy="50" r="6.5" fill="#fff" />
            <circle cx="51.5" cy="51" r="2.6" fill="#1a1a1a" />
            <circle cx="71.5" cy="51" r="2.6" fill="#1a1a1a" />
            <rect className="parpado" x="43" y="43.5" width="14" height="13" fill="#f1c9a5" />
            <rect className="parpado" x="63" y="43.5" width="14" height="13" fill="#f1c9a5" />
          </g>

          {/* boca: sonrisa y "o", se alternan según la pose */}
          <path className="boca-sonrisa" d="M51 63 q9 7 18 0" stroke="#7a4a3a" strokeWidth="2.2" fill="none" />
          <ellipse className="boca-o" cx="60" cy="65" rx="4" ry="5" fill="#7a4a3a" />
        </g>
      </g>
    </svg>
  );
}
