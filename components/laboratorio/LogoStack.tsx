// Mapa de nombre de tecnología → nombre del icono en Devicon.
// Solo se incluyen los que tienen versión "original" verificada.
// Los que no tienen icono en Devicon quedan como texto con punto de color.
const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const DEVICON: Record<string, string> = {
  // FutbolShop
  "Laravel 12": "laravel",
  Laravel: "laravel",
  PHP: "php",
  "PHP 8.3": "php",
  Vue: "vuejs",
  "Vue 3": "vuejs",
  TypeScript: "typescript",
  Tailwind: "tailwindcss",
  "Tailwind 4": "tailwindcss",
  Vite: "vite",
  MySQL: "mysql",
  PHPUnit: "php", // PHPUnit no tiene icono propio; usa PHP
  Playwright: "playwright",
  // Sismos / YPF
  Python: "python",
  Pandas: "pandas",
  Matplotlib: "matplotlib",
  "GeoPandas · Shapely": "python", // GeoPandas no tiene; usa Python
  GeoPandas: "python",
  // Fútbol Necochea / Argentina–Brasil / Zona Fría
  JavaScript: "javascript",
  HTML: "html5",
  "HTML · CSS": "html5",
  CSS: "css3",
  "Chart.js": "chartjs",
  "Vercel": "vercel",
  "API REST · Vercel": "vercel",
  // general
  GitHub: "github",
  Git: "git",
  NodeJS: "nodejs",
  "Node.js": "nodejs",
};

function deviconUrl(name: string) {
  return `${CDN}/${name}/${name}-original.svg`;
}

const COLORES = ["bg-lab-portal", "bg-lab-celeste", "bg-lab-amarillo", "bg-lab-rosa"];

// Un chip de stack: logo de Devicon si existe, punto de color si no.
export function ChipStack({ tech, index }: { tech: string; index: number }) {
  const icono = DEVICON[tech];
  return (
    <li className="flex items-center gap-1.5 rounded-lg border border-lab-borde bg-lab-panel px-2.5 py-1 font-mono text-xs leading-none whitespace-nowrap text-lab-texto">
      {icono ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={deviconUrl(icono)}
          alt={tech}
          width={14}
          height={14}
          className="size-3.5 shrink-0 object-contain"
          loading="lazy"
        />
      ) : (
        <span className={`size-2 shrink-0 rounded-full ${COLORES[index % COLORES.length]}`} />
      )}
      {tech}
    </li>
  );
}

// Lista de chips de stack, horizontal y con wrap.
export function LogoStack({ stack }: { stack: string[] }) {
  // "Laravel 12 · PHP 8.3" → ["Laravel 12", "PHP 8.3"]
  const chips = stack.flatMap((s) => s.split(" · ")).slice(0, 12);
  if (!chips.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {chips.map((tech, i) => (
        <ChipStack key={tech} tech={tech} index={i} />
      ))}
    </ul>
  );
}
