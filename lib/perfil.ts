// Datos personales que se muestran en el laboratorio.
// PENDIENTE: revisar la presentación en 2 frases.
export const perfil = {
  nombre: "Fermín",
  nombreCompleto: "Fermín Hernando",
  titulo: "Programador y Data Analyst",
  presentacion:
    "Armo sistemas y analizo datos. Este laboratorio es donde mis proyectos se pueden tocar.",
  /**
   * La segunda pantalla, "quién soy": un saludo y dos frases.
   * PENDIENTE: que Fermín la revise y la cambie con sus palabras.
   */
  sobreMi: {
    saludo: "Hola, soy Fermín Hernando.",
    parrafos: [
      "Programo sistemas a medida y analizo datos para responder preguntas concretas.",
      "Me gusta que lo que hago se pueda tocar: por eso cada proyecto de acá es un experimento.",
    ],
    fueraDelLab: "fuera del laboratorio: surf, jiu-jitsu, rugby y cocina",
  },
  /** La frase de la pantalla de contacto. PENDIENTE: que Fermín la revise. */
  contacto: "Si algo de lo que viste te sirve, o querés armar algo juntos, escribime.",
  email: "ferminhernando00@gmail.com",
  enlaces: [
    { etiqueta: "LinkedIn", url: "https://www.linkedin.com/in/fermin-hernando-0530631b5" },
    { etiqueta: "GitHub", url: "https://github.com/fer-gif" },
    { etiqueta: "Email", url: "mailto:ferminhernando00@gmail.com" },
  ],
  /** Repo de este mismo sitio. */
  repositorio: "https://github.com/fer-gif/portfolio-fermin",
  /** Ruta del CV dentro de public/. */
  cv: "/cv-fermin-hernando.pdf",
  /**
   * Con qué trabajo, agrupado. Sale de los stacks de los proyectos; cada nombre
   * busca su logo en lib/tecnologias.ts.
   * PENDIENTE: que Fermín confirme la lista (sumar o sacar lo que haga falta).
   */
  herramientas: [
    { grupo: "lenguajes", items: ["Python", "JavaScript", "TypeScript", "PHP", "HTML", "CSS"] },
    { grupo: "datos", items: ["Pandas", "GeoPandas", "Matplotlib", "scikit-learn", "Jupyter", "MySQL", "Chart.js"] },
    { grupo: "desarrollo", items: ["Laravel", "Vue", "Tailwind", "Vite", "Three.js", "Playwright"] },
    { grupo: "y además", items: ["Git", "GitHub", "Vercel"] },
  ],
};
