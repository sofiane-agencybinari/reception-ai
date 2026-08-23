import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";

import { GlowCard } from "@/components/ui/glow-card";

export function MarketingCta() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 pb-28 pt-8">
      <GlowCard glow="accent" className="overflow-hidden rounded-[2rem]">
        <div className="relative px-8 py-16 text-center sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-astor-accent/20 blur-[90px]" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-astor-warm/15 blur-[90px]" />

          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-astor-accent-bright">
              Demarrer maintenant
            </p>
            <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Pret a automatiser
              <br />
              vos commandes ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Integration en moins de 24h. Essai gratuit 2 semaines. On configure l&apos;agent sur
              votre menu.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:contact@agencybinari.com?subject=Essai%20gratuit%20ASTOR"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:bg-stone-100"
              >
                <span className="pointer-events-none absolute inset-0 overflow-hidden">
                  <span className="absolute inset-0 w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-astor-accent/20 to-transparent" />
                </span>
                <span className="relative flex items-center gap-2">
                  Demander mon installation
                  <ArrowRight className="h-4 w-4" />
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
    </section>
  );
}
