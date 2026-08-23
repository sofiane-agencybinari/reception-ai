"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import {
  HeroCallCore,
  HeroOrbitTickets,
  HeroPulseRings,
} from "@/components/marketing/hero-live-stage";

const ease = [0.22, 1, 0.36, 1] as const;

export function MarketingHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <motion.div
        className="pointer-events-none absolute inset-0 z-40 bg-background"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: reduce ? 0.15 : 1.05, delay: reduce ? 0 : 0.12, ease }}
      />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-[42%] z-0 h-[min(70vw,520px)] w-[min(70vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(61,155,143,0.35),transparent_68%)] blur-3xl"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduce ? 0.25 : 1.35, delay: 0.3, ease }}
      />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-6 pb-24 pt-28 lg:grid-cols-[1fr_1.05fr] lg:gap-4 lg:pb-16 lg:pt-24">
        <div className="relative z-20">
          <motion.p
            className="font-display text-[11px] font-semibold uppercase tracking-[0.35em] text-astor-sand/80"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
          >
            Voice AI · Restauration
          </motion.p>

          <h1 className="font-display mt-5 text-[clamp(2.9rem,9vw,6rem)] font-extrabold leading-[0.9] tracking-tight">
            <MaskedLine delay={0.65}>ASTOR</MaskedLine>
            <MaskedLine delay={0.88} className="text-gradient">
              prend l&apos;appel.
            </MaskedLine>
            <MaskedLine delay={1.08}>Vous gardez</MaskedLine>
            <MaskedLine delay={1.22}>la cuisine.</MaskedLine>
          </h1>

          <motion.p
            className="mt-7 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7, ease }}
          >
            L&apos;agent vocal qui décroche, commande, envoie en cuisine et suit vos ventes —
            en direct, 24h/24.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55, duration: 0.7, ease }}
          >
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-astor-accent px-8 py-4 text-sm font-semibold text-white shadow-[0_0_50px_-8px_rgba(61,155,143,0.75)] transition hover:bg-astor-accent-soft"
            >
              <span className="pointer-events-none absolute inset-0 overflow-hidden">
                <span className="absolute inset-0 w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </span>
              <span className="relative flex items-center gap-2">
                Essai gratuit 14 jours
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </a>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-7 py-4 text-sm font-medium text-zinc-200 backdrop-blur-sm transition hover:border-astor-accent/40 hover:text-white"
            >
              <Headphones className="h-4 w-4 text-astor-accent-bright" />
              Ecouter la demo
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="relative z-10 mx-auto flex min-h-[400px] w-full max-w-xl items-center justify-center sm:min-h-[480px] lg:min-h-[560px]"
          initial={{ opacity: 0, scale: 0.9, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.8, duration: reduce ? 0.25 : 1.15, ease }}
        >
          <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,rgba(61,155,143,0.12),transparent_65%)]" />
          <HeroPulseRings />
          <HeroOrbitTickets />
          <HeroCallCore />

          <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-white/[0.04]" />
          <motion.div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]"
            initial={false}
          >
            <motion.div
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
              animate={reduce ? {} : { x: ["-120%", "320%"] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 0.8 }}
      >
        <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">Decouvrir</p>
        <motion.span
          className="h-8 w-px origin-top bg-gradient-to-b from-astor-accent to-transparent"
          animate={reduce ? {} : { scaleY: [0.45, 1, 0.45], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
}

function MaskedLine({
  children,
  delay,
  className = "text-white",
}: {
  children: ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-1">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "115%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ delay, duration: 0.85, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}
