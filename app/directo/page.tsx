import type { Metadata } from "next";
import Link from "next/link";
import { ContactoFijo } from "@/components/laboratorio/ContactoFijo";
import { FichaDirecta } from "@/components/laboratorio/FichaDirecta";
import { perfil } from "@/lib/perfil";
import { proyectos } from "@/proyectos";

// El modo directo: lo mismo que el laboratorio, pero como una página normal que
// se lee de una, sin recorrido. Para un reclutador con apuro o alguien que
// entra desde un link en un mail. Reusa el contacto fijo y las fichas (desde
// meta.ts), nada del recorrido ni de Rive/GSAP.
export const metadata: Metadata = {
  title: "Modo directo",
  description: `${perfil.nombreCompleto} — ${perfil.titulo}. Todos los proyectos con su ficha técnica y el contacto, sin recorrido.`,
};

const enlace = (etiqueta: string) => perfil.enlaces.find((e) => e.etiqueta === etiqueta)?.url ?? "#";

export default function Directo() {
  return (
    <>
      <ContactoFijo email={perfil.email} linkedin={enlace("LinkedIn")} github={enlace("GitHub")} cv={perfil.cv} />
      <main className="mx-auto w-full max-w-2xl px-4 pb-20 pt-24 sm:pt-28">
        <header className="text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-lab-tenue">modo directo · sin recorrido</p>
          <p className="font-mano mt-3 text-2xl text-lab-portal">el laboratorio de</p>
          <h1 className="brillo-portal font-display text-6xl font-extrabold tracking-tight uppercase sm:text-7xl">
            {perfil.nombre}
          </h1>
          <p className="mt-3 text-lg text-lab-tenue">{perfil.titulo}</p>
          <p className="mx-auto mt-4 max-w-md text-base text-lab-tenue">{perfil.presentacion}</p>
          <p className="mt-6 font-mono text-xs text-lab-tenue">
            ¿preferís el recorrido?{" "}
            <Link href="/" className="text-lab-portal underline underline-offset-4">
              entrar al laboratorio ↗
            </Link>
          </p>
        </header>

        <div className="mt-12 space-y-8">
          {proyectos.map((proyecto, i) => (
            <FichaDirecta key={proyecto.slug} proyecto={proyecto} numero={i + 1} />
          ))}
        </div>

        <footer className="mt-16 text-center">
          <p className="font-mano text-2xl text-lab-portal">hablemos</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-3 font-mono text-sm">
            {perfil.cv && (
              <li>
                <a
                  href={perfil.cv}
                  download
                  className="rounded-full border border-lab-portal bg-lab-portal px-4 py-2 text-lab-fondo transition-colors hover:bg-transparent hover:text-lab-portal"
                >
                  descargar CV ↓
                </a>
              </li>
            )}
            {perfil.enlaces.map((e) => (
              <li key={e.url}>
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-lab-borde px-4 py-2 transition-colors hover:border-lab-portal hover:text-lab-portal"
                >
                  {e.etiqueta} ↗
                </a>
              </li>
            ))}
          </ul>
          {perfil.repositorio && (
            <p className="mt-6 font-mano text-lg text-lab-tenue">
              este laboratorio también es código:{" "}
              <a href={perfil.repositorio} target="_blank" rel="noopener noreferrer" className="garabato text-lab-portal">
                ver el repo ↗
              </a>
            </p>
          )}
        </footer>
      </main>
    </>
  );
}
