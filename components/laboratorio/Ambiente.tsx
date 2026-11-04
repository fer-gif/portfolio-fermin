// Capa "ambiente": motas de polvo que flotan en la luz y las luces de estado
// del laboratorio. Vive aunque nadie scrollee. (El grano está en el fondo: por
// encima de todo y mezclado con el contenido costaba recomponer la pantalla
// entera en cada cuadro.)
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
    <div aria-hidden className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {MOTAS.map((m, i) => (
        <span
          key={i}
          className="mota absolute bottom-0 h-full opacity-0"
          style={{ left: m.left, width: m.size, animationDelay: m.delay, animationDuration: m.dur }}
        >
          <span className={`absolute bottom-0 left-0 rounded-full ${m.color}`} style={{ width: m.size, height: m.size }} />
        </span>
      ))}
      <span className="luz absolute top-6 right-6 size-2 rounded-full bg-lab-portal opacity-60" />
      <span className="luz absolute top-6 right-12 size-2 rounded-full bg-lab-amarillo opacity-60 [animation-delay:0.7s]" />
      <span className="luz absolute top-6 right-18 size-2 rounded-full bg-lab-rosa opacity-60 [animation-delay:1.3s]" />
    </div>
  );
}
