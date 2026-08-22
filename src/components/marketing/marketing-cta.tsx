import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";

import { GlowCard } from "@/components/ui/glow-card";

export function MarketingCta() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 pb-28">
      <GlowCard glow="accent" className="overflow-hidden rounded-[2rem]">
        <div className="relative px-8 py-16 text-center sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-astor-accent/15 blur-[80px]" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-astor-warm/10 blur-[80px]" />

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Pret a automatiser vos commandes ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Prise de commande plus rapide, plus fluide et plus simple. Integration en moins de
              24h, essai gratuit 2 semaines.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:contact@agencybinari.com?subject=Essai%20gratuit%20ASTOR"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:bg-stone-100"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-astor-accent/20 to-transparent" />
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
                Parler a un expert
              </Link>
            </div>
          </div>
        </div>
      </GlowCard>
    </section>
  );
}
