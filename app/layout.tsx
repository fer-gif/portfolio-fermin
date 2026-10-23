import type { Metadata } from "next";
import { Caveat, Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

// Cuatro voces: Geist para leer, Geist Mono para los datos, Outfit para los
// títulos grandes y Caveat (manuscrita) para lo que dice el científico y las
// notas al margen.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: ["500", "700", "800"] });
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
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
