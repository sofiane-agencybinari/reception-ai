"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { HeroProductStage } from "@/components/marketing/hero-product-stage";

const ease = [0.16, 1, 0.3, 1] as const;

export function MarketingHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      {/* Cinematic black → reveal */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-40 bg-[#020303]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: reduce ? 0.1 : 1.15, delay: 0.05, ease }}
      />

      {/* Layered light */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <motion.div
          className="absolute left-1/2 top-0 h-[55vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(61,155,143,0.18),transparent_60%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3 }}
        />
        <motion.div
          className="absolute -left-20 top-1/3 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(61,155,143,0.2),transparent_70%)] blur-3xl"
          animate={reduce ? {} : { x: [0, 24, 0], y: [0, -16, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-10 bottom-1/4 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(212,184,150,0.12),transparent_70%)] blur-3xl"
          animate={reduce ? {} : { x: [0, -18, 0], y: [0, 14, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Horizon line */}
        <div className="absolute inset-x-0 bottom-[18%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div
          className="absolute inset-x-0 bottom-0 h-[35%] opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "linear-gradient(to top, black, transparent)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center gap-14 px-6 pb-24 pt-28 lg:flex-row lg:items-center lg:gap-16 lg:pb-20 lg:pt-24">
        {/* Copy */}
        <div className="relative z-20 w-full max-w-lg shrink-0 lg:max-w-md xl:max-w-lg">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 backdrop-blur-md"
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-medium tracking-wide text-zinc-300">
              Agent vocal · live maintenant
            </span>
          </motion.div>

          <h1 className="font-display mt-6 text-[clamp(2.15rem,4.2vw,3.25rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white">
            <MaskedLine delay={0.55}>Le téléphone qui</MaskedLine>
            <MaskedLine delay={0.7}>
              <span className="bg-gradient-to-r from-astor-accent-bright via-white to-astor-sand bg-clip-text text-transparent">
                ne rate jamais
              </span>
            </MaskedLine>
            <MaskedLine delay={0.85}>une commande.</MaskedLine>
          </h1>

          <motion.p
            className="mt-5 max-w-sm text-[15px] leading-[1.65] text-zinc-400"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.65, ease }}
          >
            ASTOR répond, prend la commande et l&apos;affiche en cuisine — pendant que votre
            équipe reste concentrée sur le service.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.65, ease }}
          >
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-astor-accent px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_12px_40px_-8px_rgba(61,155,143,0.55)] transition hover:bg-astor-accent-soft"
            >
              <span className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.span
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={reduce ? {} : { x: ["-100%", "300%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.2, ease: "linear" }}
                />
              </span>
              <span className="relative flex items-center gap-2">
                Demarrer l&apos;essai
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </a>
            <Link
              href="/demo"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-6 py-3.5 text-sm font-medium text-zinc-300 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-astor-accent/20 text-astor-accent-bright transition group-hover:bg-astor-accent/30">
                <Play className="h-3 w-3 fill-current" />
              </span>
              Ecouter 30 secondes
            </Link>
          </motion.div>

          <motion.div
            className="mt-10 flex items-center gap-6 border-t border-white/[0.06] pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.45, duration: 0.7 }}
          >
            {[
              { v: "98%", l: "Precision" },
              { v: "<2s", l: "Reponse" },
              { v: "24/7", l: "Ouvert" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-lg font-bold tracking-tight text-white">{s.v}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  {s.l}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Stage */}
        <motion.div
          className="relative z-10 w-full flex-1"
          initial={{ opacity: 0, y: 36, rotateX: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{ delay: 0.55, duration: reduce ? 0.25 : 1.15, ease }}
          style={{ perspective: 1200 }}
        >
          <HeroProductStage />
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.7 }}
      >
        <motion.span
          className="h-8 w-px origin-top bg-gradient-to-b from-astor-accent to-transparent"
          animate={reduce ? {} : { scaleY: [0.4, 1, 0.4], opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}

function MaskedLine({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden py-[0.06em]">
      <motion.span
        className="block"
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ delay, duration: 0.8, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}
