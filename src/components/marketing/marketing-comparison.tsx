import { ArrowRight, Check, X } from "lucide-react";

import { COMPARISON, INTEGRATIONS } from "@/components/marketing/marketing-data";

export function MarketingComparison() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-astor-warm">
            Avant / Apres
          </p>
          <h2 className="mt-3 text-3xl font-bold">Ce que change ASTOR au quotidien</h2>
          <p className="mt-4 text-zinc-400">
            Comparez votre prise de commande manuelle avec une solution IA complete — voix,
            cuisine, SMS et pilotage.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/6">
            <div className="grid grid-cols-3 border-b border-white/6 bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <div className="px-4 py-3" />
              <div className="px-4 py-3 text-center">Avant</div>
              <div className="px-4 py-3 text-center text-astor-accent-soft">Avec ASTOR</div>
            </div>
            {COMPARISON.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-3 border-b border-white/4 last:border-0"
              >
                <div className="px-4 py-3.5 text-sm text-zinc-300">{row.label}</div>
                <div className="flex items-center justify-center gap-1.5 px-4 py-3.5 text-xs text-zinc-500">
                  <X className="h-3.5 w-3.5 shrink-0 text-red-400/70" />
                  {row.before}
                </div>
                <div className="flex items-center justify-center gap-1.5 px-4 py-3.5 text-xs text-emerald-400/90">
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  {row.after}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card rounded-3xl p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Integrations
            </p>
            <h3 className="mt-2 text-xl font-bold text-white">Connecte a votre stack</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Telephonie, voix IA, caisse et exports — ASTOR s&apos;integre a vos outils existants.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {INTEGRATIONS.map((name) => (
                <span
                  key={name}
                  className="rounded-lg border border-white/8 bg-black/30 px-3 py-2 text-xs font-medium text-zinc-300"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-astor-accent/20 bg-gradient-to-br from-astor-accent/10 to-transparent p-8">
            <p className="text-3xl font-bold text-white">+18%</p>
            <p className="mt-1 text-sm text-zinc-400">Panier moyen avec upsell intelligent</p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              L&apos;IA suggere boissons et accompagnements au bon moment — sans script agressif.
            </p>
            <a
              href="#tarifs"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-astor-accent-soft hover:text-astor-accent-bright"
            >
              Voir les offres
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <blockquote className="rounded-2xl border border-white/6 bg-white/[0.02] p-6">
            <p className="text-sm italic leading-relaxed text-zinc-400">
              &laquo; Depuis ASTOR, on ne rate plus les appels du midi. La cuisine recoit tout
              proprement et on voit enfin ce qu&apos;on vend au telephone. &raquo;
            </p>
            <footer className="mt-4 text-xs text-zinc-600">
              — Restaurateur pilote, Montpellier
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
