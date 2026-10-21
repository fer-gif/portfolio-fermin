"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Único punto de registro de plugins: todo el recorrido importa gsap desde acá.
gsap.registerPlugin(ScrollTrigger, useGSAP);

// En celular, la barra del navegador aparece y desaparece y cambia el alto de
// la ventana: sin esto, cada cambio recalcula todo y las escenas saltan.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };
