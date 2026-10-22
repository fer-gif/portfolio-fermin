// Datos personales que se muestran en el laboratorio.
// PENDIENTE: presentación en 2 frases, y el CV en PDF (public/cv-fermin-hernando.pdf).
export const perfil = {
  nombre: "Fermín",
  nombreCompleto: "Fermín Hernando",
  titulo: "Programador y Data Analyst",
  presentacion:
    "Armo sistemas y analizo datos. Este laboratorio es donde mis proyectos se pueden tocar.",
  email: "ferminhernando00@gmail.com",
  enlaces: [
    { etiqueta: "LinkedIn", url: "https://www.linkedin.com/in/fermin-hernando-0530631b5" },
    { etiqueta: "GitHub", url: "https://github.com/fer-gif" },
    { etiqueta: "Email", url: "mailto:ferminhernando00@gmail.com" },
  ],
  /** Repo de este mismo sitio. */
  repositorio: "https://github.com/fer-gif/portfolio-fermin",
  /**
   * Ruta del CV dentro de public/. Mientras sea null, el botón "CV" no aparece
   * ni arriba ni en la salida. Cuando esté el PDF: "/cv-fermin-hernando.pdf".
   */
  cv: null as string | null,
};
