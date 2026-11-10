"use client";

import { useEffect, useRef, useState } from "react";
import { useEscena, useEscenaActual, useGSAP } from "@/components/recorrido";
import { desbloquear } from "./logros";

interface Enlace {
  etiqueta: string;
  url: string;
}

// La última pantalla, debajo de los experimentos: cómo escribirme. El mail
// bien grande (y para copiar), LinkedIn, GitHub y el CV.
export function EscenaContacto({
  frase,
  email,
  enlaces,
  cv,
  repositorio,
}: {
  frase: string;
  email: string;
  enlaces: Enlace[];
  /** Ruta al CV en PDF; si no hay, no se muestra el botón. */
  cv?: string | null;
  /** Repo de este mismo sitio. */
  repositorio?: string;
}) {
  const { linea } = useEscena();
  const escena = useEscenaActual();
  const ref = useRef<HTMLDivElement>(null);
  const [copiado, setCopiado] = useState(false);
  const redes = enlaces.filter((e) => !e.url.startsWith("mailto:"));

  // Llegar hasta acá también cuenta como experimento.
  useEffect(() => {
    if (escena === "contacto") desbloquear("salida");
  }, [escena]);

  useGSAP(
    () => {
      linea.from(".linea", { opacity: 0, y: 20, duration: 0.2, stagger: 0.04 }, 0.04).to({}, { duration: 0.6 });
    },
    { scope: ref },
  );

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    // Abajo queda lugar para el científico y su globo.
    <div ref={ref} className="flex h-full flex-col items-center justify-center px-4 text-center sm:pb-[4svh]">
      <p className="linea font-mano text-xl text-lab-portal sm:text-2xl">contacto</p>
      <h2 className="linea brillo-portal font-display text-[13vw] leading-[0.9] font-extrabold uppercase sm:text-[min(8vw,13svh)]">
        ¿Hablamos?
      </h2>
      <p className="linea mx-auto mt-3 max-w-md text-[15px] text-lab-tenue sm:text-lg">{frase}</p>

      <div className="linea mt-6 flex flex-wrap items-center justify-center gap-2">
        <a
          href={`mailto:${email}`}
          className="garabato font-mono text-[4.2vw] text-lab-texto transition-colors hover:text-lab-portal sm:text-2xl"
        >
          {email}
        </a>
        <button
          type="button"
          onClick={copiar}
          className="rounded-full border border-lab-borde px-3 py-1 font-mono text-[11px] text-lab-tenue transition-colors hover:border-lab-portal hover:text-lab-portal"
        >
          {copiado ? "copiado ✓" : "copiar"}
        </button>
      </div>

      <ul className="linea mt-6 flex flex-wrap justify-center gap-2.5 font-mono text-sm">
        {cv && (
          <li>
            <a
              href={cv}
              download
              className="inline-block rounded-full border border-lab-portal bg-lab-portal px-4 py-2 text-lab-fondo transition-colors hover:bg-transparent hover:text-lab-portal"
            >
              descargar CV ↓
            </a>
          </li>
        )}
        {redes.map((e) => (
          <li key={e.url}>
            <a
              href={e.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border border-lab-borde bg-lab-panel px-4 py-2 transition-colors hover:border-lab-portal hover:text-lab-portal"
            >
              {e.etiqueta} ↗
            </a>
          </li>
        ))}
      </ul>

      {repositorio && (
        <p className="linea mt-6 font-mano text-lg text-lab-tenue">
          este portafolio también es código:{" "}
          <a href={repositorio} target="_blank" rel="noopener noreferrer" className="garabato text-lab-portal">
            ver el repo ↗
          </a>
        </p>
      )}
    </div>
  );
}
