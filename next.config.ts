import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    remotePatterns: [
      // Escudos de los clubes (API de Fútbol de Necochea)
      new URL(
        "https://estclirfknhzlqxhiafn.supabase.co/storage/v1/object/public/club-logos/**",
      ),
      // Imágenes de las notas de Data eNe (dimensión Diarios)
      new URL("https://dataene.com.ar/uploads/**"),
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
