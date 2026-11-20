import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Escudos de los clubes (API de Fútbol de Necochea)
      new URL(
        "https://estclirfknhzlqxhiafn.supabase.co/storage/v1/object/public/club-logos/**",
      ),
      new URL("https://widget-futbol-muove.vercel.app/escudos_necochea/**"),
      // Imágenes de las notas de Data eNe (dimensión Diarios)
      new URL("https://dataene.com.ar/uploads/**"),
    ],
  },
};

export default nextConfig;
