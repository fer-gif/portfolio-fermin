import { proyectos } from "@/proyectos";
import { TarjetaExperimento } from "@/components/laboratorio/TarjetaExperimento";
import { Personaje } from "@/components/personaje/Personaje";

export default function Laboratorio() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-8">
      <header>
        <p className="font-mono text-sm text-lab-portal">~/laboratorio</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Programador y Data Analyst
        </h1>
      </header>

      <Personaje />

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        {proyectos.map((proyecto) => (
          <TarjetaExperimento key={proyecto.slug} proyecto={proyecto} />
        ))}
      </section>
    </main>
  );
}
