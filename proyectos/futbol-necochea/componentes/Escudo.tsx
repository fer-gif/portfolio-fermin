import Image from "next/image";

export function Escudo({ src, club, tamano = 20 }: { src: string; club: string; tamano?: number }) {
  return (
    <Image
      src={src}
      alt={`Escudo de ${club}`}
      width={tamano}
      height={tamano}
      className="shrink-0 object-contain"
    />
  );
}
