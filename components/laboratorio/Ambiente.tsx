// Capa "ambiente": las luces de estado del laboratorio, que parpadean aunque
// nadie scrollee. Las burbujas viven ahora en los tubos del banco.
export function Ambiente() {
  return (
    // Va por encima de las escenas (son opacas), así que es sutil a propósito.
    <div aria-hidden className="pointer-events-none fixed inset-0 z-10 opacity-60">
      <span className="luz absolute top-6 right-6 size-2 rounded-full bg-lab-portal" />
      <span className="luz absolute top-6 right-12 size-2 rounded-full bg-amber-400 [animation-delay:0.7s]" />
      <span className="luz absolute top-6 right-18 size-2 rounded-full bg-rose-500 [animation-delay:1.3s]" />
    </div>
  );
}
