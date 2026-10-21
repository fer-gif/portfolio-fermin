import Link from "next/link";

// Parte de la carcasa fija de todo proyecto: la salida siempre está en el mismo lugar.
export function VolverAlLaboratorio() {
  return (
    <Link
      href="/"
      className="fixed top-4 left-4 z-50 rounded-full border border-lab-borde bg-lab-panel/90 px-4 py-2 font-mono text-xs text-lab-tenue backdrop-blur transition-colors hover:border-lab-portal hover:text-lab-portal"
    >
      ← laboratorio
    </Link>
  );
}
