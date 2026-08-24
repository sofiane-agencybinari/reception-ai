import Link from "next/link";
import { Headphones, UtensilsCrossed } from "lucide-react";

import { ElevenLabsWidget } from "@/components/elevenlabs-widget";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

const ELBAHJA_AGENT_ID =
  process.env.NEXT_PUBLIC_ELBAHJA_AGENT_ID ?? "agent_6001m0jmjg8ye0rsrsqfwac6323e";

const MENU_PREVIEW = [
  { cat: "Sandwichs", items: "Seul 5€ · Formule soda 6,50€ — merguez, kefta, bœuf, poulet…" },
  { cat: "Assiettes", items: "10€ / 12€ / 14€ — foie, côtelettes, entrecôte, caille…" },
  { cat: "À côté", items: "Frites, salades, sodas, desserts 2,50€" },
] as const;

const TRY_LINES = [
  "Bonjour, c'est pour à emporter.",
  "Une formule sandwich merguez sauce algérienne, et une moyenne frite.",
  "Au nom de Karim, pour dans vingt minutes.",
] as const;

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="marketing-grid pointer-events-none fixed inset-0 opacity-30" />
      <MarketingHeader />
      <main className="relative z-10 mx-auto max-w-2xl px-6 py-16">
        <Link href="/" className="text-sm text-zinc-500 transition hover:text-white">
          ← Retour au site
        </Link>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-astor-accent/20 bg-astor-accent/10 px-4 py-1.5 text-xs font-medium text-teal-100">
          <Headphones className="h-3.5 w-3.5" />
          Prototype d&apos;essai · El Bahja
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight">
          Parlez avec <span className="text-gradient">ASTOR</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Démo réaliste : menu grillades, prise de commande structurée (emporter / sandwich ou
          assiette / sauces / extras), voix professionnelle.
        </p>

        <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-astor-accent">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            Carte type El Bahja
          </p>
          <ul className="mt-4 space-y-3">
            {MENU_PREVIEW.map((row) => (
              <li key={row.cat} className="text-sm">
                <span className="font-medium text-white">{row.cat}</span>
                <span className="mt-0.5 block text-zinc-500">{row.items}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/el-bahja"
            className="mt-4 inline-flex text-sm font-medium text-astor-accent-soft transition hover:text-astor-accent-bright"
          >
            Voir la carte complète →
          </Link>
        </div>

        <p className="mt-8 text-sm font-medium text-zinc-300">Essayez par exemple :</p>
        <ul className="mt-3 space-y-2 text-sm text-zinc-500">
          {TRY_LINES.map((line) => (
            <li key={line}>&quot;{line}&quot;</li>
          ))}
        </ul>

        <div className="glass-card mt-10 rounded-2xl p-6">
          <ElevenLabsWidget agentId={ELBAHJA_AGENT_ID} />
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          L&apos;agent demande emporter/sur place, construit la commande étape par étape, puis
          enregistre via webhook.
        </p>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Convaincu ?{" "}
          <a
            href="mailto:contact@agencybinari.com?subject=Demo%20ASTOR"
            className="font-medium text-astor-accent-soft hover:text-astor-accent-bright"
          >
            Demandez votre essai gratuit →
          </a>
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
