import Link from "next/link";
import { ArrowRight, Check, Headphones, Sparkles } from "lucide-react";

import { ProductPreview } from "@/components/marketing/product-preview";
import { HERO_STATS } from "@/components/marketing/marketing-data";

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-20 lg:pb-24 lg:pt-28">
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-astor-warm/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-astor-accent/12 blur-[120px]" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-astor-warm/25 bg-astor-warm/10 px-4 py-1.5 text-xs font-medium text-amber-100/90">
            <Sparkles className="h-3.5 w-3.5 text-astor-warm" />
            IA vocale pour la restauration rapide
          </div>
          <h1 className="mt-8 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
            Ne perdez plus
            <br />
            <span className="text-gradient">aucune commande</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            ASTOR decroche, comprend le client, envoie la commande en cuisine et trace
            chaque vente. Disponible 24h/24, sans attente, sans erreur.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-astor-accent px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-astor-accent/25 transition hover:bg-astor-accent-soft"
            >
              Demarrer l&apos;essai gratuit
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-8 py-4 text-sm font-medium text-zinc-200 transition hover:border-astor-accent/30 hover:text-white"
            >
              <Headphones className="h-4 w-4" />
              Essayer la demo vocale
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
            {["Sans engagement", "Setup en 24h", "Heberge en France", "Essai 2 semaines"].map(
              (item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="mt-16 lg:mt-20">
          <ProductPreview />
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {HERO_STATS.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-5 text-center transition hover:border-astor-accent/20"
            >
              <p className="text-2xl font-bold text-white sm:text-3xl">{value}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
