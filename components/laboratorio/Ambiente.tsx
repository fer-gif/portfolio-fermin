// Capa "ambiente": grano fino sobre todo, motas de polvo que flotan en la luz
// y las luces de estado del laboratorio. Vive aunque nadie scrollee.
const MOTAS = [
  { left: "12%", delay: "0s", dur: "16s", size: 2, color: "bg-lab-portal" },
  { left: "27%", delay: "4s", dur: "19s", size: 3, color: "bg-lab-celeste" },
  { left: "48%", delay: "9s", dur: "14s", size: 2, color: "bg-lab-portal" },
  { left: "63%", delay: "2s", dur: "21s", size: 2, color: "bg-lab-amarillo" },
  { left: "77%", delay: "7s", dur: "17s", size: 3, color: "bg-lab-portal" },
  { left: "90%", delay: "12s", dur: "15s", size: 2, color: "bg-lab-rosa" },
];

export function Ambiente() {
  return (
    // Va por encima de las escenas (son opacas), así que es sutil a propósito.
    <div aria-hidden className="pointer-events-none fixed inset-0 z-10">
      <div className="grano absolute inset-0 opacity-[0.07] mix-blend-soft-light" />
      {MOTAS.map((m, i) => (
        <span
          key={i}
          className={`mota absolute bottom-0 rounded-full ${m.color} opacity-0`}
          style={{ left: m.left, width: m.size, height: m.size, animationDelay: m.delay, animationDuration: m.dur }}
        />
      ))}
      <span className="luz absolute top-6 right-6 size-2 rounded-full bg-lab-portal opacity-60" />
      <span className="luz absolute top-6 right-12 size-2 rounded-full bg-lab-amarillo opacity-60 [animation-delay:0.7s]" />
      <span className="luz absolute top-6 right-18 size-2 rounded-full bg-lab-rosa opacity-60 [animation-delay:1.3s]" />
    </div>
  );
}
