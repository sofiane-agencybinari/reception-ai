"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  // iPhone : la barre d'adresse qui apparaît/disparaît ne doit pas décaler les sections épinglées.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const EASE_OUT = "expo.out";
export const EASE_IN_OUT = "power4.inOut";

/**
 * Le site garde la même expérience animée sur tous les appareils, y compris quand
 * « Réduire les animations » est activé sur l'iPhone (sinon la page devient une suite d'écrans figés).
 */
export function prefersReducedMotion() {
  return false;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
