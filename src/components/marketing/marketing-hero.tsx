import Link from "next/link";
import { ArrowRight, Check, Headphones, Sparkles } from "lucide-react";

import { HERO_STATS } from "@/components/marketing/marketing-data";
import { ProductPreview } from "@/components/marketing/product-preview";
import { GlowCard } from "@/components/ui/glow-card";

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-12 lg:pb-28 lg:pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-astor-accent-bright" />
            IA vocale pour la restauration rapide
          </div>

          <h1 className="mt-8 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Ne perdez plus
            <br />
            <span className="text-gradient">aucune commande</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">
            ASTOR decroche, comprend le client, envoie la commande en cuisine et trace chaque
            vente — 24h/24, sans attente, sans erreur.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-astor-accent px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-astor-accent/25 transition hover:bg-astor-accent-soft"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <span className="relative flex items-center gap-2">
                Demarrer l&apos;essai gratuit
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </a>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-7 py-4 text-sm font-medium text-zinc-200 transition hover:border-astor-accent/35 hover:text-white"
            >
              <Headphones className="h-4 w-4" />
              Essayer la demo vocale
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">
            {["Sans engagement", "Setup en 24h", "Heberge en France", "Essai 2 semaines"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="animate-fade-up lg:pl-4" style={{ animationDelay: "0.12s" }}>
          <ProductPreview />
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-3 px-6 sm:grid-cols-4 sm:gap-4">
        {HERO_STATS.map(({ value, label }) => (
          <GlowCard key={label} glow="none" padding={false} className="rounded-xl">
            <div className="px-4 py-5 text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">{value}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                {label}
              </p>
            </div>
          </GlowCard>
        ))}
      </div>
    </section>
  );
}
