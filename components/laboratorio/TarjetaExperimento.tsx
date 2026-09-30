import Link from "next/link";
import type { Proyecto } from "@/proyectos";

const etiquetaCategoria: Record<Proyecto["categoria"], string> = {
  principal: "Caso principal",
  analisis: "Caso de análisis",
  software: "Caso de software",
  corto: "Caso corto",
  "por-definir": "Experimento",
};

export function TarjetaExperimento({ proyecto }: { proyecto: Proyecto }) {
  return (
    <Link
      href={`/proyectos/${proyecto.slug}`}
      className="group block rounded-xl border border-lab-borde bg-lab-panel p-6 transition-colors hover:border-lab-portal"
    >
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-lab-tenue">
        <span>{etiquetaCategoria[proyecto.categoria]}</span>
        <span>
          {proyecto.estado === "en-proceso" ? "En proceso" : proyecto.autoria}
        </span>
      </div>
      <h2 className="mt-3 text-xl font-semibold group-hover:text-lab-portal">
        {proyecto.titulo}
      </h2>
      <p className="mt-2 text-sm text-lab-tenue">{proyecto.resumen}</p>
    </Link>
  );
}
