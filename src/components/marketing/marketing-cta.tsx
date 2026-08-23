"use client";

import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";
import { motion } from "motion/react";

import { GlowCard } from "@/components/ui/glow-card";

export function MarketingCta() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 pb-28 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <GlowCard glow="accent" className="overflow-hidden rounded-[2rem]" padding={false}>
          <div className="relative px-8 py-16 text-center sm:px-16 sm:py-20">
            <motion.div
              className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-astor-accent/25 blur-[90px]"
              animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.08, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-astor-warm/20 blur-[90px]"
              animate={{ opacity: [0.4, 0.7, 0.4], scale: [1.05, 1, 1.05] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-astor-accent-bright">
                Démarrer maintenant
              </p>
              <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Prêt à automatiser
                <br />
                vos commandes ?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-zinc-400">
                Intégration en moins de 24h. Essai gratuit 2 semaines. On configure l&apos;agent
                sur votre menu.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="mailto:contact@agencybinari.com?subject=Essai%20gratuit%20ASTOR"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:bg-stone-100"
                >
                  <motion.span
                    className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-astor-accent/25 to-transparent"
                    animate={{ x: ["-100%", "300%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5, ease: "linear" }}
                  />
                  <span className="relative flex items-center gap-2">
                    Demander mon installation
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </a>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 text-sm font-semibold text-zinc-200 transition hover:border-astor-accent/35 hover:text-white"
                >
                  <Headphones className="h-4 w-4" />
                  Tester la voix
                </Link>
              </div>
            </div>
          </div>
        </GlowCard>
      </motion.div>
    </section>
  );
}
