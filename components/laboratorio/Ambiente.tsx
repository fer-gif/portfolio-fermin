// Capa "ambiente": cosas que se mueven aunque nadie scrollee.
// Solo CSS, para que el sitio nunca parezca una página quieta.
export function Ambiente() {
  return (
    // Va por encima de las escenas (son opacas), así que es sutil a propósito.
    <div aria-hidden className="pointer-events-none fixed inset-0 z-10 opacity-40">
      <span className="luz absolute top-6 right-6 size-2 rounded-full bg-lab-portal" />
      <span className="luz absolute top-6 right-12 size-2 rounded-full bg-amber-400 [animation-delay:0.7s]" />
      <span className="luz absolute top-6 right-18 size-2 rounded-full bg-rose-500 [animation-delay:1.3s]" />
      <span className="burbuja absolute bottom-0 left-[20%] size-3 rounded-full border border-lab-portal/60" />
      <span className="burbuja absolute bottom-0 left-[70%] size-2 rounded-full border border-lab-portal/60 [animation-delay:2s]" />
      <span className="burbuja absolute bottom-0 left-[85%] size-4 rounded-full border border-lab-portal/60 [animation-delay:4s]" />
    </div>
  );
}
