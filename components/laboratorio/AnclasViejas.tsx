"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Antes todo el portfolio era una sola página y cada proyecto era un ancla
// (/#mesa-ypf, /#ypf-mapa). Esos links, si andan dando vueltas, llevan ahora
// a la página del proyecto.
export function AnclasViejas({ slugs }: { slugs: string[] }) {
  const router = useRouter();
  useEffect(() => {
    const ancla = decodeURIComponent(window.location.hash.slice(1));
    if (!ancla) return;
    const slug = slugs.find((s) => ancla === `mesa-${s}` || ancla.startsWith(`${s}-`));
    if (!slug) return;
    router.replace(ancla.startsWith("mesa-") ? `/proyectos/${slug}` : `/proyectos/${slug}#${ancla}`);
  }, [router, slugs]);
  return null;
}
