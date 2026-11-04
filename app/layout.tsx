import type { Metadata } from "next";
import { Bricolage_Grotesque, Martian_Mono, Patrick_Hand } from "next/font/google";
import "./globals.css";

// Tres voces, ninguna de plantilla:
// - Bricolage Grotesque para títulos y texto: una grotesca con trazos de
//   imprenta (tinta en las uniones) y carácter, que en los títulos va angosta
//   y pesada, como un cartel pegado en la pared del laboratorio;
// - Martian Mono para los datos (stacks, etiquetas, botones): una monoespaciada
//   ancha, de instrumento de laboratorio;
// - Patrick Hand para lo que dice el científico y las notas al margen: letra
//   de historieta prolija, que se lee bien aunque la frase sea larga.
// Bricolage y Martian son variables: un archivo cubre todos los pesos y anchos.
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], axes: ["opsz", "wdth"] });
const martian = Martian_Mono({ variable: "--font-martian", subsets: ["latin"], axes: ["wdth"] });
const patrick = Patrick_Hand({ variable: "--font-patrick", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: {
    default: "Laboratorio | Programador y Data Analyst",
    template: "%s | Laboratorio",
  },
  description: "Portfolio interactivo: cada proyecto vive y se puede usar acá.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${bricolage.variable} ${martian.variable} ${patrick.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
