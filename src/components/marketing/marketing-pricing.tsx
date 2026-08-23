import { Check } from "lucide-react";

import { PRICING_PLANS } from "@/components/marketing/marketing-data";
import { GlowCard } from "@/components/ui/glow-card";
import { SectionHeader } from "@/components/ui/section-header";

export function MarketingPricing() {
  return (
    <section id="tarifs" className="relative border-t border-white/[0.05] py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(61,155,143,0.08),transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeader
          align="center"
          label="Tarifs"
          title="Simple. Transparent. Sans surprise."
          description="Trois offres selon votre volume d'appels. Essai gratuit 2 semaines — sans engagement."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {PRICING_PLANS.map((plan) => (
            <GlowCard
              key={plan.id}
              glow={plan.popular ? "accent" : "none"}
              className={`rounded-3xl ${plan.popular ? "lg:scale-[1.03] lg:shadow-[0_0_60px_-20px_rgba(61,155,143,0.45)]" : ""}`}
            >
              <div className="flex h-full flex-col">
                {plan.popular ? (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-astor-accent/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-astor-accent-bright">
                    Le plus choisi
                  </span>
                ) : (
                  <span className="mb-4 block h-6" />
                )}
                <p className="font-display text-xl font-bold text-white">{plan.name}</p>
                <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-5xl font-bold tracking-tight text-white">
                    {plan.price}
                  </span>
                  <span className="text-zinc-400">€ / mois</span>
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  + {plan.perMinute.toFixed(2).replace(".", ",")} € / minute
                </p>
                <ul className="mt-8 flex-1 space-y-3 border-t border-white/[0.06] pt-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-8 flex w-full items-center justify-center rounded-full py-3.5 text-sm font-semibold transition ${
                    plan.popular
                      ? "bg-astor-accent text-white shadow-lg shadow-astor-accent/25 hover:bg-astor-accent-soft"
                      : "border border-white/12 text-zinc-200 hover:border-astor-accent/30 hover:text-white"
                  }`}
                >
                  {plan.popular ? "Demarrer avec Pro" : `Choisir ${plan.name}`}
                </a>
              </div>
            </GlowCard>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-zinc-600">
          Pas de commission par commande. Setup et formation inclus. Resiliation mensuelle.
        </p>
      </div>
    </section>
  );
}
