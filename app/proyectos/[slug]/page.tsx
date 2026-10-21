import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerProyecto, proyectos } from "@/proyectos";

// Proyectos con experiencia propia (carcasa mínima + recorrido libre).
// Los demás usan el molde genérico con su caso.mdx mientras no tengan la suya.
const paginasPropias = {
  "futbol-necochea": () => import("@/proyectos/futbol-necochea/Pagina"),
  "zona-fria": () => import("@/proyectos/zona-fria/Pagina"),
} as const;

export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/proyectos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const proyecto = obtenerProyecto(slug);
  return proyecto
    ? { title: proyecto.titulo, description: proyecto.resumen }
    : {};
}

export default async function PaginaProyecto({
  params,
}: PageProps<"/proyectos/[slug]">) {
  const { slug } = await params;
  const proyecto = obtenerProyecto(slug);
  if (!proyecto) notFound();

  if (slug in paginasPropias) {
    const { default: Pagina } = await paginasPropias[slug as keyof typeof paginasPropias]();
    return <Pagina />;
  }

  const { default: Caso } = await import(`@/proyectos/${slug}/caso.mdx`);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-8">
      <Link href="/" className="font-mono text-sm text-lab-portal">
        ← volver al laboratorio
      </Link>

      <header className="mt-6">
        <h1 className="text-4xl font-bold tracking-tight">{proyecto.titulo}</h1>
        {proyecto.creditos && (
          <p className="mt-2 text-sm text-lab-tenue">{proyecto.creditos}</p>
        )}
      </header>

      <article className="prose prose-invert mt-10 max-w-none">
        <Caso />
      </article>

      {proyecto.enlaces.length > 0 && (
        <ul className="mt-10 flex flex-wrap gap-4 font-mono text-sm">
          {proyecto.enlaces.map((enlace) => (
            <li key={enlace.url}>
              <a
                href={enlace.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lab-portal underline underline-offset-4"
              >
                {enlace.etiqueta} ↗
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
