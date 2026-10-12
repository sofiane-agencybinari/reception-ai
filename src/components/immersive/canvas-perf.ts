"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Fluidité des scènes 3D : une scène hors écran ne calcule plus aucune image,
 * et la résolution est plafonnée (surtout sur téléphone, où l'écran Retina coûte cher).
 */
export function useCanvasActive(ref: RefObject<HTMLElement | null>, margin = "25%") {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: `${margin} 0px` });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return active;
}

/** Résolution maximale des scènes 3D : 1,25 sur téléphone, 1,5 sur ordinateur. */
export function useMaxDpr(): [number, number] {
  const [max, setMax] = useState(1.5);
  useEffect(() => {
    setMax(window.matchMedia("(max-width: 1023px)").matches ? 1.25 : 1.5);
  }, []);
  return [1, max];
}
