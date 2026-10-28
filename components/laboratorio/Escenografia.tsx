// Lo que cuelga de la pared del laboratorio: un estante con frascos, una
// lámpara con su cono de luz, tres cuadros (surf, jiu-jitsu, rugby), un kimono
// colgado y una tabla de surf apoyada. Va fijo detrás de todas las escenas.
// Los objetos reaccionan cuando el visitante pasa por encima o los toca
// (`activo` / `tocado` vienen de la capa de objetos, que está por delante).
const PARED = "#1f3a42";
const SOMBRA = "#0f2026";
const MARCO = "#2b4a52";

export function Escenografia({ activo = null, tocado = null }: { activo?: string | null; tocado?: string | null }) {
  const objeto = (id: string) => `objeto ${activo === id ? "activo" : ""} ${tocado === id ? "tocado" : ""}`;

  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    >
      <defs>
        <linearGradient id="cono-luz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c6f36a" stopOpacity="0.14" />
          <stop offset="1" stopColor="#97ce4c" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* lámpara colgante */}
      <g className="lampara">
        <line x1="1180" y1="0" x2="1180" y2="118" stroke={MARCO} strokeWidth="3" />
        <polygon points="1110,170 1250,170 1500,900 860,900" fill="url(#cono-luz)" />
        <polygon points="1140,118 1220,118 1252,172 1108,172" fill={PARED} />
        <rect x="1116" y="166" width="128" height="6" rx="3" fill="#c6f36a" opacity="0.6" />
      </g>

      {/* estante con frascos, bien arriba para no chocar con el contenido
          (solo pantalla grande: en celular se vería entre el contenido) */}
      <g className="hidden sm:block" transform="translate(0 -60)">
        <g className={objeto("estante")}>
          <rect x="90" y="236" width="300" height="10" rx="3" fill={PARED} />
          <path d="M100 246 l14 20 M380 246 l-14 20" stroke={PARED} strokeWidth="4" strokeLinecap="round" />
          <rect x="112" y="186" width="34" height="50" rx="6" fill="#cfe9ff" opacity="0.14" />
          <rect x="112" y="206" width="34" height="30" rx="6" fill="#97ce4c" opacity="0.4" />
          <rect x="116" y="180" width="26" height="8" rx="2" fill={MARCO} />
          <rect x="160" y="196" width="26" height="40" rx="5" fill="#cfe9ff" opacity="0.14" />
          <rect x="160" y="214" width="26" height="22" rx="5" fill="#f2e05a" opacity="0.4" />
          <rect x="163" y="190" width="20" height="8" rx="2" fill={MARCO} />
          <rect x="202" y="176" width="40" height="60" rx="7" fill="#cfe9ff" opacity="0.14" />
          <rect x="202" y="204" width="40" height="32" rx="7" fill="#9ad9ea" opacity="0.35" />
          <rect x="208" y="170" width="28" height="8" rx="2" fill={MARCO} />
          <rect x="262" y="200" width="22" height="36" rx="4" fill="#cfe9ff" opacity="0.14" />
          <rect x="262" y="218" width="22" height="18" rx="4" fill="#97ce4c" opacity="0.35" />
          <rect x="300" y="192" width="30" height="44" rx="6" fill="#cfe9ff" opacity="0.14" />
          <rect x="300" y="210" width="30" height="26" rx="6" fill="#ef6ad4" opacity="0.35" />
          <rect x="304" y="186" width="22" height="8" rx="2" fill={MARCO} />
        </g>
      </g>

      {/* tres cuadros en la pared: la ola, el kimono con el cinturón, los palos de rugby */}
      <g className="hidden sm:block">
        {/* surf */}
        <g transform="translate(470 130) rotate(-1.5)">
          <g className={objeto("surf")}>
            <rect width="124" height="88" rx="4" fill={MARCO} />
            <rect x="7" y="7" width="110" height="74" rx="2" fill={SOMBRA} />
            <path d="M14 62 C 30 42, 46 38, 60 46 C 72 52, 82 36, 100 30 C 94 46, 86 54, 76 58 C 90 58, 102 60, 110 68 L110 72 L14 72 Z" fill="#9ad9ea" opacity="0.7" />
            <path d="M14 66 Q 60 58 110 66 L110 74 L14 74 Z" fill="#9ad9ea" opacity="0.3" />
            <path d="M44 58 l18 -5" stroke="#f2e05a" strokeWidth="3" strokeLinecap="round" />
            <circle cx="54" cy="47" r="2.6" fill="#f2e05a" />
            <path d="M54 50 v5 M54 52 l-3 3 M54 52 l3 2" stroke="#f2e05a" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </g>
        {/* jiu-jitsu */}
        <g transform="translate(612 106) rotate(1)">
          <g className={objeto("jiujitsu")}>
            <rect width="94" height="116" rx="4" fill={MARCO} />
            <rect x="7" y="7" width="80" height="102" rx="2" fill={SOMBRA} />
            <path d="M24 28 h46 v52 h-46 z" fill="#e8f1ec" opacity="0.8" />
            <path d="M24 28 l23 32 l23 -32" fill="none" stroke={SOMBRA} strokeWidth="3" />
            <rect x="18" y="64" width="58" height="9" fill="#141414" />
            <path d="M43 64 l5 9 l5 -9 M47 73 l-6 11 M49 73 l6 11" stroke="#141414" strokeWidth="5" strokeLinecap="round" />
            <rect x="64" y="64" width="10" height="9" fill="#ef6ad4" />
          </g>
        </g>
        {/* rugby */}
        <g transform="translate(734 142) rotate(-1)">
          <g className={objeto("rugby")}>
            <rect width="112" height="82" rx="4" fill={MARCO} />
            <rect x="7" y="7" width="98" height="68" rx="2" fill={SOMBRA} />
            <path d="M30 70 V 18 M80 70 V 18 M30 40 H 80" stroke="#e8f1ec" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <g transform="rotate(-25 60 56)">
              <ellipse cx="60" cy="56" rx="14" ry="8.5" fill="#c8925a" />
              <path d="M53 54 l14 -3 M56 57 v-4 M59.5 56.3 v-4 M63 55.5 v-4" stroke="#e8f1ec" strokeWidth="1.3" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </g>

      {/* el kimono colgado de un gancho, a la izquierda */}
      <g className="hidden sm:block" transform="translate(150 320)" opacity="0.9">
        <g className={objeto("kimono")}>
          <circle cx="60" cy="0" r="4" fill={MARCO} />
          <g className="kimono">
            <path d="M60 4 v10" stroke={MARCO} strokeWidth="3" />
            <path d="M60 14 l-44 26 h88 z" fill="none" stroke={MARCO} strokeWidth="3" strokeLinejoin="round" />
            <path d="M20 44 L2 112 L26 120 L32 98 V240 H88 V98 L94 120 L118 112 L100 44 H78 L60 72 L42 44 Z" fill="#e3ece7" opacity="0.55" />
            <path d="M42 44 L60 72 L78 44" fill="none" stroke={SOMBRA} strokeWidth="3" />
            <path d="M60 72 V240" stroke={SOMBRA} strokeWidth="2" opacity="0.4" />
            <rect x="30" y="158" width="60" height="9" fill="#141414" />
            <path d="M56 158 l4 9 l4 -9 M58 167 l-5 16 M62 167 l5 16" stroke="#141414" strokeWidth="5" strokeLinecap="round" />
            <rect x="78" y="158" width="10" height="9" fill="#ef6ad4" />
          </g>
        </g>
      </g>

      {/* la tabla de surf apoyada contra la pared, a la derecha */}
      <g className="hidden sm:block" transform="translate(1400 512) rotate(7)" opacity="0.8">
        <g className={objeto("tabla")}>
          <path d="M0 -290 C 40 -230, 46 -60, 36 120 C 30 220, 14 270, 0 290 C -14 270, -30 220, -36 120 C -46 -60, -40 -230, 0 -290 Z" fill="#9ad9ea" />
          <path d="M0 -270 C 20 -200, 22 -40, 14 120 C 10 200, 4 250, 0 270 Z" fill="#c6f36a" opacity="0.55" />
          <path d="M0 -250 V 250" stroke={MARCO} strokeWidth="2" opacity="0.5" />
          <path d="M-12 -40 q 12 -10 24 0" stroke="#ef6ad4" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M0 250 l 10 30 l -10 -4 z" fill={MARCO} />
          <path d="M-6 232 q -40 40 -22 68" stroke="#ef6ad4" strokeWidth="2.5" fill="none" />
        </g>
      </g>
    </svg>
  );
}
