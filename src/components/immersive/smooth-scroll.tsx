"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { gsap, prefersReducedMotion, ScrollTrigger } from "./gsap";

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

/** Scroll fluide (Lenis) synchronisé avec le ticker GSAP + ancres internes animées. */
export function SmoothScroll({ locked = false }: { locked?: boolean }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisInstance;
    document.documentElement.style.overflow = locked ? "hidden" : "";
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
  }, [locked]);

  return null;
}
