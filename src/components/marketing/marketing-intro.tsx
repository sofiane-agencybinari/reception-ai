"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.76, 0, 0.24, 1] as const;
const TICKER = "WELCOME · ASTOR · RÉCEPTION VOCALE · NE RATE JAMAIS · ";

type Props = {
  onEnter: () => void;
};

/** Silencio-style gate: tickers, giant type, then curtain split. */
export function MarketingIntro({ onEnter }: Props) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"boot" | "ready" | "exit">("boot");

  useEffect(() => {
    if (reduce) {
      onEnter();
      return;
    }
    const t = window.setTimeout(() => setPhase("ready"), 1400);
    return () => window.clearTimeout(t);
  }, [reduce, onEnter]);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  function enter() {
    if (phase === "exit") return;
    setPhase("exit");
    window.setTimeout(onEnter, 1150);
  }

  if (reduce) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      aria-modal="true"
      role="dialog"
      aria-label="Bienvenue sur ASTOR"
    >
      {/* Curtains mount on exit: flash cover, then split open */}
      {phase === "exit" ? (
        <>
          <motion.div
            className="absolute inset-y-0 left-0 z-50 w-1/2 bg-[#020303]"
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 1.05, ease, delay: 0.05 }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 z-50 w-1/2 bg-[#020303]"
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.05, ease, delay: 0.05 }}
          />
        </>
      ) : null}

      {/* Intro content — fades as curtains wipe */}
      <motion.div
        className="absolute inset-0 z-40 flex flex-col bg-[#030405]"
        animate={
          phase === "exit"
            ? { opacity: 0, scale: 1.04, filter: "blur(6px)" }
            : { opacity: 1, scale: 1, filter: "blur(0px)" }
        }
        transition={{ duration: 0.7, ease, delay: phase === "exit" ? 0.15 : 0 }}
      >
        <div className="relative overflow-hidden border-b border-white/[0.08] py-3">
          <motion.div
            className="flex whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            <span className="pr-8">{TICKER.repeat(6)}</span>
            <span className="pr-8">{TICKER.repeat(6)}</span>
          </motion.div>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center px-6">
          <motion.p
            className="mb-6 font-mono text-[10px] uppercase tracking-[0.35em] text-astor-accent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.55 }}
          >
            Digital reception · FR
          </motion.p>

          <h1 className="font-display text-center text-[clamp(4.5rem,18vw,11rem)] font-bold leading-[0.85] tracking-[-0.04em] text-white">
            {"ASTOR".split("").map((letter, i) => (
              <span key={letter} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "115%", rotate: 6 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ delay: 0.35 + i * 0.07, duration: 0.85, ease }}
                >
                  {letter}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-8 max-w-sm text-center text-sm leading-relaxed text-zinc-400 sm:text-base"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.95, duration: 0.65 }}
          >
            Le téléphone qui ne rate jamais une commande.
          </motion.p>

          <motion.button
            type="button"
            onClick={enter}
            disabled={phase === "exit"}
            className="group relative mt-12 inline-flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: phase === "ready" || phase === "exit" ? 1 : 0,
              y: phase === "ready" || phase === "exit" ? 0 : 10,
            }}
            transition={{ duration: 0.45 }}
          >
            <span className="relative overflow-hidden rounded-full border border-white/15 bg-white/[0.03] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition group-hover:border-astor-accent/50 group-hover:bg-astor-accent/10">
              <span className="relative z-10">Cliquez pour entrer</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
              />
            </span>
            <motion.span
              className="h-10 w-px bg-gradient-to-b from-astor-accent to-transparent"
              animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </motion.button>
        </div>

        <div className="relative overflow-hidden border-t border-white/[0.08] py-3">
          <motion.div
            className="flex whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-600"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            <span className="pr-8">{TICKER.repeat(6)}</span>
            <span className="pr-8">{TICKER.repeat(6)}</span>
          </motion.div>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(61,155,143,0.2),transparent_65%)] blur-3xl" />
      </motion.div>
    </div>
  );
}
