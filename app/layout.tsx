import type { Metadata } from "next";
import { Caveat, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Tres voces: Inter para leer (moderna, legible, estándar de facto en UIs),
// Geist Mono para los datos (código, stacks, monospace), Space Grotesk para
// los títulos grandes (geométrica con carácter técnico), y Caveat (manuscrita)
// para lo que dice el científico y las notas al margen.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], weight: ["500", "700"] });

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
      className={`${inter.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
