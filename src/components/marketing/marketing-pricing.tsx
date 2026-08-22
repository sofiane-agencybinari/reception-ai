import { Check } from "lucide-react";

import { PRICING_PLANS } from "@/components/marketing/marketing-data";

export function MarketingPricing() {
  return (
    <section id="tarifs" className="border-t border-white/5 bg-astor-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-astor-accent">
            Tarification
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Un prix simple et transparent</h2>
          <p className="mt-4 text-zinc-400">
            Trois offres claires, pensees pour votre volume d&apos;appels. Essai gratuit 2 semaines
            sur toutes les formules.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border p-8 transition ${
                plan.popular
                  ? "border-astor-accent/40 bg-gradient-to-b from-astor-accent/10 to-transparent shadow-xl shadow-astor-accent/10"
                  : "border-white/6 bg-white/[0.02] hover:border-white/12"
              }`}
            >
              {plan.popular ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-astor-accent px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Le plus choisi
                </span>
              ) : null}
              <p className="text-lg font-bold text-white">{plan.name}</p>
              <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-zinc-400">EUR / mois</span>
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                + {plan.perMinute.toFixed(2).replace(".", ",")} EUR / minute d&apos;appel
              </p>
              <ul className="mt-8 flex-1 space-y-3">
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
                    ? "bg-astor-accent text-white hover:bg-astor-accent-soft"
                    : "border border-white/12 text-zinc-200 hover:border-astor-accent/30 hover:text-white"
                }`}
              >
                {plan.popular ? "Demarrer avec Pro" : `Choisir ${plan.name}`}
              </a>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-zinc-600">
          Pas de commission par commande. Setup et formation inclus au demarrage. Resiliation mensuelle.
        </p>
      </div>
    </section>
  );
}
