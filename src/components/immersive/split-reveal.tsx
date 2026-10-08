"use client";

import { useRef, type ReactNode } from "react";

import { gsap, prefersReducedMotion, SplitText, useGSAP } from "./gsap";

type Props = {
  as?: "h1" | "h2" | "h3" | "p";
  children: ReactNode;
  className?: string;
  /** "lines" : lignes qui montent depuis un masque. "chars" : lettres en cascade. */
  mode?: "lines" | "chars";
  delay?: number;
  /** Démarre au scroll (défaut) ou dès que `play` passe à true. */
  play?: boolean;
  id?: string;
};

/** Titre révélé ligne par ligne (ou lettre par lettre) derrière un masque. */
export function SplitReveal({ as: Tag = "h2", children, className, mode = "lines", delay = 0, play, id }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      if (play === false) {
        gsap.set(el, { autoAlpha: 0 });
        return;
      }
      gsap.set(el, { autoAlpha: 1 });

      const split = SplitText.create(el, {
        type: mode === "chars" ? "lines,chars" : "lines",
        mask: "lines",
        linesClass: "im-line",
        autoSplit: true,
        onSplit(self) {
          const targets = mode === "chars" ? self.chars : self.lines;
          return gsap.from(targets, {
            yPercent: 110,
            rotate: mode === "chars" ? 0 : 2,
            duration: mode === "chars" ? 1.1 : 1.3,
            ease: "expo.out",
            stagger: mode === "chars" ? 0.025 : 0.09,
            delay,
            scrollTrigger: play === undefined ? { trigger: el, start: "top 85%", once: true } : undefined,
          });
        },
      });
      return () => split.revert();
    },
    { dependencies: [play], scope: ref },
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
