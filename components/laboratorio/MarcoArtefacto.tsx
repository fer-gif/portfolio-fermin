import type { ReactNode } from "react";

// El "monitor" del laboratorio donde vive cada artefacto.
export function MarcoArtefacto({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="not-prose my-8 overflow-hidden rounded-xl border border-lab-borde bg-lab-panel">
      <header className="flex items-center gap-2 border-b border-lab-borde px-4 py-2 font-mono text-xs uppercase tracking-wider text-lab-portal">
        <span className="size-2 rounded-full bg-lab-portal" aria-hidden />
        {titulo}
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}
