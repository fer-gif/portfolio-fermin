// El retrato de "quién soy": Fermín en versión científico, de medio cuerpo,
// mostrando un experimento. Mismo personaje que camina por el laboratorio
// (pelo en puntas, anteojos verdes en la frente, uniceja, guardapolvo y
// corbata verde), dibujado más grande y con contorno.
//
// Las burbujas del frasco solo suben mientras la escena está en pantalla
// (.burbuja-tubo se pausa por CSS fuera de .escena-activa).

const LINEA = { stroke: "#1e2326", strokeWidth: 2.6, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const FRASCO = "M56 128 h10 v16 l15 36 q3 10 -8 10 h-24 q-11 0 -8 -10 l15 -36 z";
const BOCA = "M96 142 Q120 166 146 140 Q124 150 96 142 Z";

export function RetratoCientifico({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="20 -14 236 300" className={className} role="img" aria-label="Fermín dibujado como un científico loco, con un frasco verde en la mano">
      <defs>
        <radialGradient id="retrato-aura">
          <stop offset="0" stopColor="#c6f36a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#97ce4c" stopOpacity="0" />
        </radialGradient>
        <clipPath id="retrato-ojo-i">
          <circle cx="106" cy="104" r="16" />
        </clipPath>
        <clipPath id="retrato-ojo-d">
          <circle cx="137" cy="104" r="17" />
        </clipPath>
        <clipPath id="retrato-boca">
          <path d={BOCA} />
        </clipPath>
        <clipPath id="retrato-frasco">
          <path d={FRASCO} />
        </clipPath>
      </defs>

      <rect x="20" y="-14" width="236" height="300" fill="#10252c" />
      <circle cx="138" cy="120" r="150" fill="url(#retrato-aura)" opacity="0.5" />

      <g {...LINEA}>
        {/* camisa y corbata */}
        <path d="M102 182 L136 182 L140 300 L98 300 Z" fill="#cfe3f5" />
        <path d="M114 192 L124 192 L128 252 L119 266 L110 252 Z" fill="#97ce4c" />
        <path d="M112 182 L126 182 L123 194 L115 194 Z" fill="#97ce4c" />
        {/* guardapolvo abierto */}
        <path d="M86 192 Q96 178 110 182 L113 198 L106 300 L64 300 Q70 236 86 192 Z" fill="#e9eef2" />
        <path d="M152 192 Q142 178 128 182 L125 198 L132 300 L174 300 Q168 236 152 192 Z" fill="#e9eef2" />
        <path d="M98 184 L111 182 L110 220 Z" fill="#d5dde3" />
        <path d="M140 184 L127 182 L128 220 Z" fill="#d5dde3" />
        {/* cuello levantado */}
        <path d="M94 188 L103 168 L110 182 Z" fill="#e9eef2" />
        <path d="M144 188 L135 168 L128 182 Z" fill="#e9eef2" />
        {/* bolsillo con biromes */}
        <rect x="140" y="219" width="5" height="19" rx="2" fill="#ef6ad4" />
        <rect x="147" y="215" width="5" height="23" rx="2" fill="#f2e05a" />
        <path d="M136 236 h22 v20 h-22 z" fill="#e9eef2" />
        {/* el brazo que cuelga */}
        <path d="M160 194 L146 202 L152 300 L182 300 Z" fill="#e9eef2" />
        {/* cuello */}
        <path d="M108 150 L130 152 L131 184 L107 184 Z" fill="#f1c9a5" />
        {/* pelo: una llama barrida hacia atrás y arriba */}
        <path
          d="M78 102 L50 98 L64 80 L40 62 L68 58 L52 28 L86 44 L84 6 L108 38 L124 -6 L134 36 L162 0 L158 42 L206 12 L184 56 L234 46 L196 74 L238 94 L190 98 L180 112 Z"
          fill="#bbd1ea"
        />
        {/* cabeza */}
        <path d="M74 80 Q72 30 120 28 Q168 30 166 80 L162 114 Q152 158 121 164 Q90 158 78 114 Z" fill="#f1c9a5" />
        {/* anteojos en la frente */}
        <rect x="78" y="50" width="84" height="8" rx="3" fill="#3a4a3f" />
        <circle cx="102" cy="54" r="11" fill="#97ce4c" />
        <circle cx="138" cy="54" r="11" fill="#97ce4c" />
        <path d="M96 50 q3 -4 7 -4 M132 50 q3 -4 7 -4" stroke="#f4ffd6" strokeWidth="2.4" fill="none" />
        {/* ojos: uno más abierto que el otro */}
        <circle cx="106" cy="104" r="16" fill="#ffffff" />
        <circle cx="137" cy="104" r="17" fill="#ffffff" />
        <rect x="88" y="86" width="36" height="9" fill="#f1c9a5" clipPath="url(#retrato-ojo-i)" stroke="none" />
        <rect x="118" y="85" width="38" height="4" fill="#f1c9a5" clipPath="url(#retrato-ojo-d)" stroke="none" />
        <path d="M91 95 L121 95 M121 89 L153 89" fill="none" />
        <circle cx="104" cy="107" r="3" fill="#1a1a1a" stroke="none" />
        <circle cx="134" cy="105" r="3" fill="#1a1a1a" stroke="none" />
        {/* uniceja, con una punta levantada */}
        <path d="M86 88 L108 92 L122 96 L138 86 L160 74" fill="none" strokeWidth="6" />
        {/* nariz */}
        <path d="M122 100 Q138 118 128 132 Q120 134 116 128" fill="#dfae8a" />
        {/* sonrisa con dientes */}
        <path d={BOCA} fill="#ffffff" />
        <path d="M106 140 v14 M116 142 v16 M126 142 v16 M136 140 v14" clipPath="url(#retrato-boca)" strokeWidth="1.6" />
        <path d="M96 142 Q120 166 146 140" fill="none" />
        <path d="M150 124 q6 8 1 18 M86 128 q-6 8 -1 16" fill="none" strokeWidth="2" />
        {/* el brazo levantado: brazo y antebrazo */}
        <path d="M86 194 L98 206 L80 262 L60 256 Z" fill="#e9eef2" />
        <path d="M60 256 L80 262 L76 204 L52 204 Z" fill="#e9eef2" />
      </g>

      {/* el frasco brilla */}
      <circle cx="61" cy="168" r="40" fill="url(#retrato-aura)" />
      <g {...LINEA}>
        <path d={FRASCO} fill="#cfe9ff" fillOpacity="0.9" />
        <path d="M40 160 h44 v40 h-44 z" fill="#97ce4c" clipPath="url(#retrato-frasco)" stroke="none" />
        <path d="M47 160 h28" fill="none" stroke="#c6f36a" strokeWidth="2" />
        <path d={FRASCO} fill="none" />
        <rect x="53" y="123" width="16" height="6" rx="2" fill="#cfe9ff" />
        <path d="M58 148 l-8 22" stroke="#ffffff" strokeWidth="2.2" fill="none" opacity="0.8" />
        {/* la mano lo sostiene desde abajo */}
        <path d="M48 188 h28 q5 0 5 5 v9 q0 5 -5 5 h-28 q-5 0 -5 -5 v-9 q0 -5 5 -5 z" fill="#f1c9a5" />
        <rect x="44" y="176" width="6" height="15" rx="3" fill="#f1c9a5" />
        <rect x="75" y="178" width="6" height="13" rx="3" fill="#f1c9a5" />
      </g>
      <g fill="#e6ffe0">
        <circle className="burbuja-tubo" cx="60" cy="116" r="3.4" />
        <circle className="burbuja-tubo" cx="65" cy="116" r="2.4" style={{ animationDelay: "-0.9s" }} />
        <circle className="burbuja-tubo" cx="58" cy="116" r="1.8" style={{ animationDelay: "-1.8s" }} />
      </g>
    </svg>
  );
}
