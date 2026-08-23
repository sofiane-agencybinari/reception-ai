import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";

import { ProductPreview } from "@/components/marketing/product-preview";

export function MarketingHero() {
  return (
    <section className="relative min-h-[min(92vh,920px)] overflow-hidden pb-16 pt-10 lg:pb-24 lg:pt-14">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="animate-fade-up relative z-10">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.35em] text-astor-sand/80">
            Voice AI · Restauration
          </p>

          <h1 className="font-display mt-5 text-[clamp(2.75rem,8vw,5.75rem)] font-extrabold leading-[0.92] tracking-tight">
            <span className="block text-white">ASTOR</span>
            <span className="mt-2 block text-gradient">ne rate plus</span>
            <span className="block text-white">vos appels.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
            L&apos;agent vocal qui prend les commandes, les envoie en cuisine et suit vos ventes —
            24h/24.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-astor-accent px-8 py-4 text-sm font-semibold text-white shadow-[0_0_40px_-8px_rgba(61,155,143,0.7)] transition hover:bg-astor-accent-soft"
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
          </div>
        </div>

        <div
          className="animate-fade-up relative z-10 lg:justify-self-end"
          style={{ animationDelay: "0.12s" }}
        >
          <ProductPreview />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
