"use client";

import { motion, useReducedMotion } from "motion/react";

import { EASE } from "./reveal";

/**
 * Texte révélé lettre par lettre, chaque lettre sortant d'un flou (façon Lusion / oryzo).
 * `show` pilote l'entrée et la sortie ; les espaces sont conservés.
 */
export function CharReveal({
  text,
  show,
  className,
  stagger = 0.035,
  fromHidden = false,
}: {
  text: string;
  show: boolean;
  className?: string;
  stagger?: number;
  /** Joue l'entrée dès le montage (utile quand le composant est remonté via `key`). */
  fromHidden?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={className} aria-label={text}>
      {/* Mots insécables : les lignes ne se coupent jamais au milieu d'un mot */}
      {text.split(/(\s+)/).map((word, wi, words) => {
        const offset = words.slice(0, wi).join("").length;
        if (/^\s+$/.test(word)) return <span key={wi}>{word}</span>;
        return (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split("").map((ch, ci) => {
              const i = offset + ci;
              return (
                <motion.span
                  key={ci}
                  aria-hidden
                  className="inline-block"
                  initial={fromHidden && !reduce ? { opacity: 0, y: 18, filter: "blur(14px)" } : false}
                  animate={
                    show || reduce
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: 18, filter: "blur(14px)" }
                  }
                  transition={{ duration: 0.8, delay: show ? i * stagger : 0, ease: EASE }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
