"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { HeroProductStage } from "@/components/marketing/hero-product-stage";

const ease = [0.22, 1, 0.36, 1] as const;

export function MarketingHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      {/* Soft veil */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-40 bg-background"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: reduce ? 0.1 : 0.9, delay: reduce ? 0 : 0.08, ease }}
      />

      <motion.div
        className="pointer-events-none absolute left-[20%] top-[30%] z-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(61,155,143,0.22),transparent_70%)] blur-3xl"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.25, ease }}
      />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-6xl items-center gap-12 px-6 pb-20 pt-28 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:pb-16 lg:pt-24">
        <div className="relative z-20 max-w-xl">
          <motion.p
            className="text-[11px] font-semibold uppercase tracking-[0.28em] text-astor-accent-bright/90"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease }}
          >
            IA vocale pour restaurants
          </motion.p>

          <h1 className="font-display mt-5 text-[clamp(2.1rem,4.8vw,3.5rem)] font-bold leading-[1.12] tracking-tight text-white">
            <MaskedLine delay={0.55}>Ne perdez plus</MaskedLine>
            <MaskedLine delay={0.72}>
              <span className="text-gradient">aucune commande</span>
            </MaskedLine>
            <MaskedLine delay={0.88}>au téléphone.</MaskedLine>
          </h1>

          <motion.p
            className="mt-5 max-w-md text-[15px] leading-relaxed text-zinc-400 sm:text-base"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.65, ease }}
          >
            ASTOR décroche, prend la commande, l&apos;envoie en cuisine et suit vos ventes —
            24h/24, sans file d&apos;attente.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.65, ease }}
          >
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-astor-accent px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_-10px_rgba(61,155,143,0.65)] transition hover:bg-astor-accent-soft"
            >
              <span className="pointer-events-none absolute inset-0 overflow-hidden">
                <span className="absolute inset-0 w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </span>
              <span className="relative flex items-center gap-2">
                Essai gratuit 14 jours
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </a>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-zinc-300 transition hover:border-astor-accent/35 hover:text-white"
            >
              <Headphones className="h-4 w-4 text-astor-accent-bright" />
              Ecouter la demo
            </Link>
          </motion.div>

          <motion.ul
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            {["Sans engagement", "Setup en 24h", "Heberge en France"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-astor-accent" />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          className="relative z-10 mx-auto w-full max-w-lg lg:max-w-none"
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.7, duration: reduce ? 0.2 : 1, ease }}
        >
          <HeroProductStage />
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.7 }}
      >
        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-600">Decouvrir</p>
        <motion.span
          className="h-7 w-px origin-top bg-gradient-to-b from-astor-accent/80 to-transparent"
          animate={reduce ? {} : { scaleY: [0.5, 1, 0.5], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function MaskedLine({
  children,
  delay,
}: {
  children: ReactNode;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: "105%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ delay, duration: 0.75, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}
