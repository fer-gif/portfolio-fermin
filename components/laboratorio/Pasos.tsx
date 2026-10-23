// Los pasos de una historia con datos: un riel con números a mano, el paso
// actual encendido, los ya contados apagados. En celular solo se ve el actual.
export function Pasos({ pasos, actual }: { pasos: string[]; actual: number }) {
  return (
    <ol className="relative space-y-2 sm:ml-3 sm:border-l sm:border-lab-borde sm:pl-5">
      {pasos.map((texto, i) => {
        const activo = i === actual;
        const pasado = i < actual;
        return (
          <li
            key={i}
            className={`relative rounded-xl px-4 py-3 text-sm leading-snug transition-all duration-500 ${
              activo
                ? "bg-lab-panel text-lab-texto shadow-[0_0_0_1px_var(--color-lab-portal),0_14px_34px_-20px_var(--color-lab-portal)]"
                : pasado
                  ? "hidden text-lab-tenue/70 sm:block"
                  : "hidden text-lab-tenue/40 sm:block"
            }`}
          >
            <span
              className={`absolute top-2.5 -left-[2.1rem] hidden size-6 items-center justify-center rounded-full border font-mano text-base leading-none transition-colors sm:flex ${
                activo
                  ? "border-lab-portal bg-lab-portal text-lab-fondo"
                  : pasado
                    ? "border-lab-portal/60 bg-lab-fondo text-lab-portal"
                    : "border-lab-borde bg-lab-fondo text-lab-tenue"
              }`}
            >
              {i + 1}
            </span>
            <span className="mr-2 font-mano text-lg leading-none text-lab-portal sm:hidden">{i + 1}.</span>
            {texto}
          </li>
        );
      })}
    </ol>
  );
}
