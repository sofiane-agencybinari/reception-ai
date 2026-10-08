"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Apparition douce : fondu + léger flou + glissement, une seule fois à l'entrée. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** En-tête de section sobre : repère, titre court, phrase d'explication. */
export function SectionHead({
  index,
  label,
  title,
  text,
  tone = "light",
  align = "left",
}: {
  index: string;
  label: string;
  title: ReactNode;
  text?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
}) {
  const muted = tone === "dark" ? "text-[#f2efe8]/50" : "text-[#8a8175]";
  const body = tone === "dark" ? "text-[#f2efe8]/65" : "text-[#5c574f]";
  return (
    <div className={align === "center" ? "mx-auto max-w-xl text-center" : "max-w-xl"}>
      <Reveal>
        <p className={`font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.22em] ${muted}`}>
          <span className="tabular-nums">{index}</span>
          <span className="mx-2 opacity-50">—</span>
          {label}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="lx-title mt-5 text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.12]">{title}</h2>
      </Reveal>
      {text ? (
        <Reveal delay={0.16}>
          <p className={`mt-4 text-[15px] leading-relaxed ${body}`}>{text}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
