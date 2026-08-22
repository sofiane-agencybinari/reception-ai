import type { ReactNode } from "react";
import { PhoneCall, TrendingUp } from "lucide-react";

import { FEATURE_GROUPS } from "@/components/marketing/marketing-data";

export function MarketingFeaturesBento() {
  return (
    <section id="fonctionnalites" className="border-t border-white/5 bg-astor-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-astor-accent">
              Fonctionnalites
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Tout ce dont vous avez besoin</h2>
            <p className="mt-4 text-zinc-400">
              Voix, operations et pilotage — une plateforme complete pour ne plus perdre une
              commande au telephone.
            </p>
          </div>
          <div className="flex shrink-0 gap-6">
            <div className="text-right">
              <p className="text-2xl font-bold text-astor-warm">+18%</p>
              <p className="text-xs text-zinc-500">Panier moyen</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-right">
              <p className="text-2xl font-bold text-white">10</p>
              <p className="text-xs text-zinc-500">Appels simultanes</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <HighlightCard
            icon={PhoneCall}
            title="Multi-ligne sans attente"
            description="Pendant le rush, chaque client est pris en charge instantanement."
          >
            <div className="mt-5 grid grid-cols-2 gap-2">
              {["Appel 1", "Appel 2", "Appel 3", "Appel 4"].map((label, i) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border border-white/6 bg-black/25 px-3 py-2"
                >
                  <span className="text-xs text-zinc-400">{label}</span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Actif
                  </span>
                </div>
              ))}
            </div>
          </HighlightCard>

          <HighlightCard
            icon={TrendingUp}
            title="Upsell naturel"
            description="L'IA complete la commande sans script agressif."
          >
            <div className="mt-5 space-y-2 rounded-xl border border-white/6 bg-black/25 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Menu seul</span>
                <span className="font-mono text-zinc-500">9,50 €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-300">+ Boisson + dessert</span>
                <span className="font-mono text-astor-accent-soft">14,00 €</span>
              </div>
              <div className="border-t border-white/6 pt-2 text-xs text-emerald-400">
                Suggestion au bon moment
              </div>
            </div>
          </HighlightCard>
        </div>

        <div className="mt-16 space-y-14">
          {FEATURE_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="mb-6 flex items-baseline gap-4 border-b border-white/6 pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-astor-accent">
                  {group.label}
                </p>
                <h3 className="text-lg font-semibold text-white">{group.title}</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {group.features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <article
                      key={feature.title}
                      className="group rounded-xl border border-white/6 bg-white/[0.02] p-5 transition hover:border-astor-accent/25 hover:bg-white/[0.04]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-astor-accent/10 text-astor-accent-soft transition group-hover:bg-astor-accent/20">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className="mt-4 text-sm font-semibold text-white">{feature.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{feature.text}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HighlightCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof PhoneCall;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <article className="glass-card rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-astor-accent/15 text-astor-accent-soft">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>
      </div>
      {children}
    </article>
  );
}
