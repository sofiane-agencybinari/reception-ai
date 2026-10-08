"use client";

import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { GlowCard } from "@/components/ui/glow-card";

const ease = [0.23, 1, 0.32, 1] as const;

export function MarketingCta() {
  const reduce = useReducedMotion();

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 pb-28 pt-8">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease }}
      >
        <GlowCard glow="accent" className="overflow-hidden rounded-[2rem]" padding={false}>
          <div className="relative px-8 py-16 text-center sm:px-16 sm:py-20">
            <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-astor-accent/20 blur-[90px]" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-astor-warm/12 blur-[90px]" />

            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-astor-accent">
                S’abonner en ligne
              </p>
              <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl">
                Prêt à ne plus rater
                <br />
                un appel ?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-zinc-600">
                Installation en moins de 24 h. On configure LIGNE sur votre menu — sans
                engagement.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#essai"
                  className="marketing-btn group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Demander mon installation
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </a>
                <Link
                  href="/demo-pizza"
                  className="marketing-btn inline-flex items-center gap-2 rounded-full border border-zinc-200 px-8 py-4 text-sm font-semibold text-zinc-700 transition hover:border-astor-accent/35 hover:text-zinc-900"
                >
                  <Headphones className="h-4 w-4" />
                  Essayer la démo
                </Link>
              </div>
            </div>
          </div>
        </GlowCard>
      </motion.div>
    </section>
  );
}
