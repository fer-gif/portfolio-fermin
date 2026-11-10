"use client";

import { useRef } from "react";
import { useEscena, useGSAP } from "@/components/recorrido";
import { tecnologia } from "@/lib/tecnologias";
import { ChipStack, EtiquetaLogo } from "./LogoStack";
import { RetratoCientifico } from "./RetratoCientifico";

export interface SobreMi {
  saludo: string;
  parrafos: string[];
  fueraDelLab: string;
}

// La segunda pantalla, "quién soy": unas pocas líneas y el retrato de Fermín
// en versión científico, pegado como una foto sobre la pared del laboratorio.
// El retrato va a la derecha: el científico, abajo a la izquierda, lo señala.
export function EscenaPresentacion({ sobreMi, lenguajes }: { sobreMi: SobreMi; lenguajes: string[] }) {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const logos = lenguajes.map(tecnologia);

  useGSAP(
    () => {
      // Entra con el relevo: la foto cae girando a su lugar y el texto sube
      // línea por línea. Todo listo antes del punto donde aterriza un salto.
      linea
        .fromTo(".retrato", { opacity: 0, y: -30, rotation: 9 }, { opacity: 1, y: 0, rotation: 2.5, duration: 0.26, ease: "back.out(1.4)" }, 0)
        .from(".bio > *", { opacity: 0, y: 18, duration: 0.16, stagger: 0.02, ease: "power2.out" }, 0.04)
        .to({}, { duration: 0.7 });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="flex h-full items-center justify-center px-5 sm:px-10 sm:pb-[7svh]">
      <div className="grid w-full max-w-5xl items-center gap-4 sm:grid-cols-[1fr_auto] sm:gap-[6vw]">
        <figure className="retrato mx-auto w-[min(40vw,24svh)] sm:order-last sm:w-[min(28vw,50svh)]">
          <div className="relative rounded-[12px] bg-[#eef3ea] p-2 pb-0 shadow-[0_22px_40px_-18px_rgba(0,0,0,0.85)] sm:p-3 sm:pb-0">
            {/* la cinta que la sostiene contra la pared */}
            <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 rounded-[3px] bg-lab-amarillo/70 sm:w-24" />
            <div className="overflow-hidden rounded-[7px]">
              <RetratoCientifico className="block h-auto w-full" />
            </div>
            <figcaption className="py-1 text-center font-mano text-base leading-tight text-[#1f3a42] sm:py-2 sm:text-xl">
              yo, versión laboratorio
            </figcaption>
          </div>
        </figure>

        <div className="bio text-center sm:text-left">
          <p className="font-mano text-xl text-lab-portal sm:text-2xl">quién soy</p>
          <h2 className="font-display text-[8.5vw] leading-[0.95] font-extrabold sm:text-[min(4.6vw,8svh)]">{sobreMi.saludo}</h2>
          {sobreMi.parrafos.map((p) => (
            <p key={p} className="mx-auto mt-2.5 max-w-md text-[15px] leading-snug text-lab-texto/85 sm:mx-0 sm:mt-4 sm:max-w-lg sm:text-lg">
              {p}
            </p>
          ))}
          <div className="mt-4 sm:mt-6">
            <p className="font-mono text-[10px] tracking-wider text-lab-tenue uppercase">programo en</p>
            {/* en celular, solo los logos; en pantalla ancha, con el nombre */}
            <ul className="mt-2 flex justify-center gap-1.5 sm:hidden" aria-label={lenguajes.join(", ")}>
              {logos.map((t) => (
                <li key={t.etiqueta}>
                  <EtiquetaLogo tec={t} className="size-7" />
                </li>
              ))}
            </ul>
            <ul className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
              {logos.map((t) => (
                <ChipStack key={t.etiqueta} tec={t} />
              ))}
            </ul>
          </div>
          <p className="mt-3 font-mano text-lg leading-tight text-lab-tenue sm:mt-5 sm:text-xl">{sobreMi.fueraDelLab}</p>
        </div>
      </div>
    </div>
  );
}
