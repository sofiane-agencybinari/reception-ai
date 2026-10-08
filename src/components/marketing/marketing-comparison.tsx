import { ArrowRight, Check, X } from "lucide-react";

import { COMPARISON, INTEGRATIONS } from "@/components/marketing/marketing-data";

export function MarketingComparison() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-astor-warm">
            Avant / Après
          </p>
          <h2 className="mt-3 text-3xl font-bold">Ce que change LIGNE au quotidien</h2>
          <p className="mt-4 text-zinc-600">
            Comparez la prise de commande manuelle avec LIGNE : téléphone, cuisine et
            confirmation client — sans post-it ni appel manqué.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200">
            <div className="grid grid-cols-3 border-b border-zinc-200 bg-white text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <div className="px-4 py-3" />
              <div className="px-4 py-3 text-center">Avant</div>
              <div className="px-4 py-3 text-center text-astor-accent-soft">Avec LIGNE</div>
            </div>
            {COMPARISON.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-3 border-b border-zinc-200 last:border-0"
              >
                <div className="px-4 py-3.5 text-sm text-zinc-700">{row.label}</div>
                <div className="flex items-center justify-center gap-1.5 px-4 py-3.5 text-xs text-zinc-500">
                  <X className="h-3.5 w-3.5 shrink-0 text-red-400/70" />
                  {row.before}
                </div>
                <div className="flex items-center justify-center gap-1.5 px-4 py-3.5 text-xs text-emerald-600/90">
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
              Compatibilité
            </p>
            <h3 className="mt-2 text-xl font-bold text-zinc-900">Branché sur vos outils</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Téléphonie, voix, caisse et exports — LIGNE s&apos;intègre à ce que vous
              utilisez déjà.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {INTEGRATIONS.map((name) => (
                <span
                  key={name}
                  className="rounded-lg border border-zinc-200 bg-black/30 px-3 py-2 text-xs font-medium text-zinc-700"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-astor-accent/20 bg-gradient-to-br from-astor-accent/10 to-transparent p-8">
            <p className="text-3xl font-bold text-zinc-900">+18%</p>
            <p className="mt-1 text-sm text-zinc-600">
              Panier moyen quand une boisson ou un dessert est proposé au bon moment
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              LIGNE suggère sans script agressif — le client décide, le ticket monte.
            </p>
            <a
              href="#tarifs"
              className="marketing-btn mt-6 inline-flex items-center gap-2 text-sm font-medium text-astor-accent-soft hover:text-astor-accent"
            >
              Voir les offres
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
