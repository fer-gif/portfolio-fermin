"use client";

import { useRef } from "react";
import { useEscena, useGSAP } from "@/components/recorrido";
import { tecnologia } from "@/lib/tecnologias";
import { ChipStack, EtiquetaLogo } from "./LogoStack";
import { RetratoConOjos } from "./RetratoConOjos";

export interface SobreMi {
  saludo: string;
  parrafos: string[];
  fueraDelLab: string;
}

// La primera pantalla del laboratorio: presentación con el título profesional,
// unas pocas líneas, lenguajes/bases de datos y el retrato de Fermín versión
// científico con los ojos siguiendo al mouse.
export function EscenaPresentacion({
  nombre,
  titulo,
  sobreMi,
  lenguajes,
}: {
  nombre: string;
  titulo: string;
  sobreMi: SobreMi;
  lenguajes: string[];
}) {
  const { linea } = useEscena();
  const ref = useRef<HTMLDivElement>(null);
  const logos = lenguajes.map(tecnologia);

  useGSAP(
    () => {
      // Al ser la primera pantalla, entra ya visible detrás de la puerta; al
      // bajar se apaga la pista y el conjunto se aleja apenas antes del relevo.
      linea
        .to(".pista", { opacity: 0, duration: 0.3 })
        .to(".presentacion", { scale: 0.96, y: -14, duration: 1, ease: "power1.in" }, 0);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative flex h-full flex-col items-center justify-center px-5 sm:px-10 sm:pb-[7svh]">
      <div className="presentacion grid w-full max-w-5xl items-center gap-4 sm:grid-cols-[1fr_auto] sm:gap-[6vw]">
        <figure className="retrato mx-auto w-[min(40vw,24svh)] rotate-[2.5deg] sm:order-last sm:w-[min(28vw,50svh)]">
          <div className="relative rounded-[12px] bg-[#eef3ea] p-2 pb-0 shadow-[0_22px_40px_-18px_rgba(0,0,0,0.85)] sm:p-3 sm:pb-0">
            {/* la cinta que la sostiene contra la pared */}
            <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 rounded-[3px] bg-lab-amarillo/70 sm:w-24" />
            <div className="overflow-hidden rounded-[7px]">
              <RetratoConOjos
                alt={`${nombre} dibujado como científico: pelo castaño despeinado, barba de pocos días, guardapolvo y los brazos cruzados`}
              />
            </div>
            <figcaption className="py-1 text-center font-mano text-base leading-tight text-[#1f3a42] sm:py-2 sm:text-xl">
              {nombre} en el laboratorio
            </figcaption>
          </div>
        </figure>

        <div className="bio text-center sm:text-left">
          <p className="font-mano text-xl text-lab-portal sm:text-2xl">{titulo}</p>
          <h1 className="font-display text-[8.5vw] leading-[0.95] font-extrabold sm:text-[min(4.6vw,8svh)]">{sobreMi.saludo}</h1>
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

      <p className="pista mt-4 font-mano text-lg text-lab-tenue sm:absolute sm:bottom-[4svh] sm:mt-0 sm:text-xl">
        bajá <span className="flecha-pista inline-block">↓</span>
      </p>
    </div>
  );
}
