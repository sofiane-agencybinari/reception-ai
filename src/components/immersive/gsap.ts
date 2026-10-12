"use client";

import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer, SplitText, useGSAP);
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

/**
 * Écran tactile : dans une section épinglée découpée en `count` étapes, chaque glissement du doigt
 * avance (ou recule) d'une seule étape, quelle que soit sa force — aucune étape n'est sautée.
 * En dehors de la section, le défilement reste normal. Renvoie une fonction de nettoyage.
 */
export function swipeStepByStep(st: ScrollTrigger, count: number) {
  if (typeof window === "undefined" || !window.matchMedia("(pointer: coarse)").matches) return () => {};

  let index = 0;
  let animating = false;
  const posOf = (i: number) => st.start + ((i + 0.5) / count) * (st.end - st.start);
  const currentIndex = () => Math.min(count - 1, Math.max(0, Math.floor(st.progress * count)));

  const scrollTo = (y: number, done?: () => void) => {
    animating = true;
    gsap.to(window, {
      scrollTo: { y, autoKill: false },
      duration: 0.75,
      ease: "power2.inOut",
      overwrite: true,
      onComplete: () => {
        animating = false;
        done?.();
      },
    });
  };

  const go = (dir: 1 | -1) => {
    if (animating) return;
    const next = index + dir;
    if (next < 0 || next >= count) {
      // Première ou dernière étape : on sort de la section et on rend la main au défilement normal.
      observer.disable();
      scrollTo(dir > 0 ? st.end + 2 : st.start - 2);
      return;
    }
    index = next;
    scrollTo(posOf(index));
  };

  const observer = Observer.create({
    target: window,
    type: "touch",
    tolerance: 10,
    preventDefault: true,
    onUp: () => go(1),
    onDown: () => go(-1),
  });
  observer.disable();

  // À l'entrée dans la section : on se cale sur l'étape en cours et on prend la main.
  const settle = () => {
    index = currentIndex();
    observer.enable();
    scrollTo(posOf(index));
  };
  const guard = ScrollTrigger.create({
    trigger: st.trigger,
    start: () => st.start,
    end: () => st.end,
    onEnter: settle,
    onEnterBack: settle,
    onLeave: () => observer.disable(),
    onLeaveBack: () => observer.disable(),
  });

  return () => {
    observer.kill();
    guard.kill();
  };
}

export { gsap, Observer, ScrollTrigger, SplitText, useGSAP };
