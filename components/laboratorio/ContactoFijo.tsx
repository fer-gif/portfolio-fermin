"use client";

import { useState } from "react";

// El contacto, siempre a un clic, en la esquina superior izquierda.
// El email se copia al portapapeles; LinkedIn y GitHub abren en otra pestaña.
export function ContactoFijo({
  email,
  linkedin,
  github,
  cv,
}: {
  email: string;
  linkedin: string;
  github: string;
  cv?: string | null;
}) {
  const [copiado, setCopiado] = useState(false);

  const copiarEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  const estilo =
    "flex items-center gap-1.5 rounded-full border border-lab-borde bg-lab-panel/90 px-3 py-2 font-mono text-xs text-lab-tenue backdrop-blur transition-colors hover:border-lab-portal hover:text-lab-portal";

  return (
    <nav aria-label="Contacto" className="fixed top-4 left-4 z-50 flex items-center gap-2">
      <button type="button" onClick={copiarEmail} className={estilo} title={email}>
        <IconoMail />
        <span className="hidden sm:inline">{copiado ? "¡copiado!" : email}</span>
      </button>
      <a href={linkedin} target="_blank" rel="noopener noreferrer" className={estilo} title="LinkedIn">
        <span className="font-bold">in</span>
        <span className="hidden sm:inline">LinkedIn</span>
      </a>
      <a href={github} target="_blank" rel="noopener noreferrer" className={estilo} title="GitHub">
        <IconoGitHub />
        <span className="hidden sm:inline">GitHub</span>
      </a>
      {cv && (
        <a href={cv} download className={`${estilo} border-lab-portal text-lab-portal`} title="Descargar CV">
          <span>↓</span>
          <span className="hidden sm:inline">CV</span>
        </a>
      )}
    </nav>
  );
}

function IconoMail() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function IconoGitHub() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.5 9.5 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
    </svg>
  );
}
