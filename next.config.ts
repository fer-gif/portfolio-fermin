import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  // Todo el portfolio vive en una sola página: los links viejos por proyecto
  // llevan a la mesa correspondiente.
  async redirects() {
    return [{ source: "/proyectos/:slug", destination: "/#mesa-:slug", permanent: true }];
  },
};

export default nextConfig;
