import type { Metadata } from "next";
import Link from "next/link";
import { Headphones, UtensilsCrossed } from "lucide-react";

import { ElevenLabsWidget } from "@/components/elevenlabs-widget";
import { DemoPromptCards } from "@/components/marketing/demo-prompt-cards";
import { DemoStickyCta } from "@/components/marketing/demo-sticky-cta";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

import { SITE_URL } from "@/lib/site";

const ELBAHJA_AGENT_ID =
  process.env.NEXT_PUBLIC_ELBAHJA_AGENT_ID ?? "agent_6001m0jmjg8ye0rsrsqfwac6323e";

export const metadata: Metadata = {
  title: "Démo vocale — Parlez avec LIGNE",
  description:
    "Testez le réceptionniste téléphonique IA LIGNE en direct : prise de commande vocale type restaurant (menu grillades El Bahja).",
  alternates: {
    canonical: "/demo",
  },
  openGraph: {
    title: "Démo vocale LIGNE — Agent IA restaurant",
    description:
      "Parlez avec LIGNE : démo réaliste de prise de commande téléphonique pour restaurant.",
    url: `${SITE_URL}/demo`,
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Démo vocale LIGNE — Agent IA restaurant",
    description: "Essayez le réceptionniste téléphonique IA en temps réel.",
  },
};

const MENU_PREVIEW = [
  { cat: "Sandwichs", items: "Seul 5€ · Formule 6,50€" },
  { cat: "Assiettes", items: "10€ à 14€" },
  { cat: "Extras", items: "Frites, sodas, desserts" },
] as const;

const TRY_PROMPTS = [
  {
    label: "Ouverture",
    text: "Bonjour, c'est pour à emporter.",
  },
  {
    label: "Commande",
    text: "Une formule sandwich merguez sauce algérienne, et une moyenne frite.",
  },
  {
    label: "Retrait",
    text: "Au nom de Karim, pour dans vingt minutes.",
  },
] as const;

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="marketing-grid pointer-events-none fixed inset-0 opacity-30" />
      <MarketingHeader />

      <main className="relative z-10 mx-auto max-w-2xl px-6 pb-28 pt-28 sm:pt-32">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
          <Link href="/" className="transition hover:text-white active:opacity-80">
            ← Retour au site
          </Link>
          <span className="text-zinc-700">·</span>
          <Link href="/demo-pizza" className="transition hover:text-white active:opacity-80">
            Démo pizzeria Bella Napoli →
          </Link>
        </div>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-astor-accent/20 bg-astor-accent/10 px-4 py-1.5 text-xs font-medium text-teal-100">
          <Headphones className="h-3.5 w-3.5" />
          Démo live · El Bahja
        </div>

        <h1 className="font-display mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Parlez 30 secondes — voyez{" "}
          <span className="text-gradient">LIGNE</span> prendre une commande
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          Simulez un client au téléphone : LIGNE décroche, guide la commande (emporter,
          sandwich ou assiette, sauces) et confirme le retrait — comme en service réel.
        </p>

        <div className="mt-10">
          <DemoPromptCards prompts={TRY_PROMPTS} />
        </div>

        <section
          id="demo-widget"
          className="gradient-border mt-10 overflow-hidden rounded-[1.35rem]"
        >
          <div className="glass-card rounded-[1.3rem] px-5 py-8 sm:px-8 sm:py-10">
            <div className="mb-6 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-astor-accent-bright">
                Centre de la démo
              </p>
              <h2 className="font-display mt-2 text-xl font-semibold text-white sm:text-2xl">
                Parlez maintenant
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
                Cliquez sur le micro, autorisez l&apos;accès, puis dites une des phrases
                ci-dessus.
              </p>
            </div>
            <ElevenLabsWidget agentId={ELBAHJA_AGENT_ID} showStatus />
          </div>
        </section>

        <p className="mt-5 text-center text-xs text-zinc-600">
          L&apos;agent structure la commande étape par étape, puis peut l&apos;enregistrer via
          webhook.
        </p>

        <aside className="mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 sm:p-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-astor-accent">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            Carte type El Bahja
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {MENU_PREVIEW.map((row) => (
              <li key={row.cat} className="text-sm">
                <span className="font-medium text-white">{row.cat}</span>
                <span className="text-zinc-500"> — {row.items}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/el-bahja"
            className="mt-3 inline-flex text-sm font-medium text-astor-accent-soft transition hover:text-astor-accent-bright"
          >
            Voir la carte complète →
          </Link>
        </aside>

        <p className="mt-12 text-center text-sm text-zinc-500">
          Prêt pour votre établissement ?{" "}
          <a
            href="/#tarifs"
            className="font-medium text-astor-accent-soft transition hover:text-astor-accent-bright"
          >
            Voir les tarifs et s’abonner →
          </a>
        </p>
      </main>

      <DemoStickyCta />
      <MarketingFooter />
    </div>
  );
}
