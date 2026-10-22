// Lo que cuelga de la pared del laboratorio: un estante con frascos y una
// lámpara con su cono de luz. Va detrás del contenido de cada escena, igual
// en todas, para que el laboratorio se vea quieto mientras cambian las mesas.
export function Escenografia() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    >
      <defs>
        <linearGradient id="cono-luz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ee35b" stopOpacity="0.13" />
          <stop offset="1" stopColor="#7ee35b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* lámpara colgante */}
      <g className="lampara">
        <line x1="1180" y1="0" x2="1180" y2="118" stroke="#243129" strokeWidth="3" />
        <polygon points="1110,170 1250,170 1500,900 860,900" fill="url(#cono-luz)" />
        <polygon points="1140,118 1220,118 1252,172 1108,172" fill="#1b2620" />
        <rect x="1116" y="166" width="128" height="6" rx="3" fill="#7ee35b" opacity="0.55" />
      </g>

      {/* estante con frascos (solo pantalla grande: en celular se ve entre el contenido) */}
      <g className="hidden sm:block">
        <rect x="90" y="236" width="300" height="10" rx="3" fill="#1b2620" />
        <path d="M100 246 l14 20 M380 246 l-14 20" stroke="#1b2620" strokeWidth="4" strokeLinecap="round" />
        {/* frascos: vidrio translúcido con líquido */}
        <rect x="112" y="186" width="34" height="50" rx="6" fill="#cfe9ff" opacity="0.14" />
        <rect x="112" y="206" width="34" height="30" rx="6" fill="#7ee35b" opacity="0.35" />
        <rect x="116" y="180" width="26" height="8" rx="2" fill="#243129" />
        <rect x="160" y="196" width="26" height="40" rx="5" fill="#cfe9ff" opacity="0.14" />
        <rect x="160" y="214" width="26" height="22" rx="5" fill="#e3a75b" opacity="0.35" />
        <rect x="163" y="190" width="20" height="8" rx="2" fill="#243129" />
        <rect x="202" y="176" width="40" height="60" rx="7" fill="#cfe9ff" opacity="0.14" />
        <rect x="202" y="204" width="40" height="32" rx="7" fill="#5bc8e3" opacity="0.3" />
        <rect x="208" y="170" width="28" height="8" rx="2" fill="#243129" />
        <rect x="262" y="200" width="22" height="36" rx="4" fill="#cfe9ff" opacity="0.14" />
        <rect x="262" y="218" width="22" height="18" rx="4" fill="#7ee35b" opacity="0.3" />
        <rect x="300" y="192" width="30" height="44" rx="6" fill="#cfe9ff" opacity="0.14" />
        <rect x="300" y="210" width="30" height="26" rx="6" fill="#e35b8f" opacity="0.28" />
        <rect x="304" y="186" width="22" height="8" rx="2" fill="#243129" />
      </g>
    </svg>
  );
}
