import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChefHat,
  Headphones,
  MessageSquare,
  Phone,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { ProductPreview } from "@/components/marketing/product-preview";

const FEATURES = [
  {
    icon: Phone,
    title: "Appels simultanes",
    text: "Plusieurs clients appellent en meme temps ? L'IA gere chaque ligne sans file d'attente.",
  },
  {
    icon: ChefHat,
    title: "Transmission cuisine",
    text: "Chaque commande arrive structuree sur l'ecran cuisine. Zero ressaisie, zero post-it.",
  },
  {
    icon: MessageSquare,
    title: "SMS de confirmation",
    text: "Le client recoit un numero de commande et l'heure de retrait automatiquement.",
  },
  {
    icon: BarChart3,
    title: "Compta produits vendus",
    text: "Top ventes, CA journalier, panier moyen — tout est trace pour piloter votre activite.",
  },
  {
    icon: Users,
    title: "Base clients",
    text: "Historique des commandes, preferences et export CSV pour vos campagnes.",
  },
  {
    icon: Zap,
    title: "Installation rapide",
    text: "Agent configure, menu importe, ecran cuisine pret. Operationnel en moins de 24h.",
  },
] as const;

const PLANS = [
  "Agent vocal IA 24h/24",
  "Ecran cuisine temps reel",
  "Dashboard & statistiques",
  "SMS confirmation client",
  "Suivi clients & export",
  "Support pilote inclus",
] as const;

const FAQ = [
  {
    q: "ASTOR remplace-t-il mon employe au telephone ?",
    a: "ASTOR prend les commandes standards pendant le rush. Votre equipe reste disponible pour les cas complexes via transfert d'appel.",
  },
  {
    q: "Faut-il changer de numero de telephone ?",
    a: "Non. On branche l'IA sur votre ligne existante ou un numero dedie selon votre configuration.",
  },
  {
    q: "Quels types de restaurants ?",
    a: "Fast-food, snack, pizzeria, traiteur — tout etablissement avec des commandes a emporter par telephone.",
  },
  {
    q: "Comment se passe l'essai gratuit ?",
    a: "2 semaines de pilote avec installation, formation equipe et ajustements inclus. Sans engagement.",
  },
] as const;

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100">
      <div className="marketing-grid pointer-events-none fixed inset-0 opacity-40" />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <MarketingHeader />

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:pt-24">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-200">
              <Sparkles className="h-3.5 w-3.5" />
              IA vocale pour restauration rapide
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              L&apos;IA qui prend vos{" "}
              <span className="text-gradient">commandes par telephone</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">
              ASTOR decroche, comprend le client, envoie la commande en cuisine et vous donne
              la compta de vos ventes. Disponible 24h/24, sans attente, sans erreur.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-amber-400"
              >
                Demarrer l&apos;essai gratuit
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-sm font-medium text-zinc-200 transition hover:border-amber-500/30 hover:text-white"
              >
                <Headphones className="h-4 w-4" />
                Tester la demo vocale
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-zinc-500">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" /> Sans engagement
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" /> Setup en 24h
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" /> Heberge en France
              </span>
            </div>
          </div>
          <div className="animate-fade-up lg:pl-8" style={{ animationDelay: "0.15s" }}>
            <ProductPreview />
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-white/5 bg-white/[0.02] py-12">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
            {[
              ["0", "appel manque"],
              ["100%", "des commandes tracees"],
              ["-2h", "de saisie / jour"],
              ["24/7", "disponible"],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-white md:text-4xl">{val}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="comment" className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
              Comment ca marche
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">De l&apos;appel a la cuisine en 3 etapes</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Le client appelle",
                text: "L'IA decroche instantanement, presente votre menu et prend la commande en langage naturel.",
              },
              {
                step: "02",
                title: "La cuisine recoit",
                text: "Le bon de commande apparait sur l'ecran cuisine avec statuts, notes et heure de retrait.",
              },
              {
                step: "03",
                title: "Vous pilotez",
                text: "Dashboard, compta produits, historique clients et exports — tout est centralise.",
              },
            ].map((item) => (
              <article key={item.step} className="glass-card rounded-2xl p-6">
                <p className="font-mono text-sm text-amber-500">{item.step}</p>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="fonctionnalites" className="border-t border-white/5 bg-[#050608] py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
                Fonctionnalites
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Plus qu&apos;un repondeur.
                <br />
                <span className="text-zinc-500">Un vrai outil de gestion.</span>
              </h2>
              <p className="mt-4 text-zinc-400">
                On fait ce que les autres font sur la voix — et on va plus loin sur le pilotage
                de votre restaurant.
              </p>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition hover:border-amber-500/20 hover:bg-white/[0.04]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 transition group-hover:bg-amber-500/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Differentiator */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="glass-card overflow-hidden rounded-3xl">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 sm:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
                  Votre avantage
                </p>
                <h2 className="mt-3 text-3xl font-bold">
                  Vous savez exactement ce que vous vendez
                </h2>
                <p className="mt-4 text-zinc-400">
                  Chaque commande telephonique alimente votre dashboard : produits les plus
                  vendus, chiffre d&apos;affaires, panier moyen, heures de rush. Fini le flou
                  sur ce qui rentre vraiment.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    "Top produits vendus par jour / semaine",
                    "Chiffre d'affaires telephonique en temps reel",
                    "Export CSV pour votre comptable",
                    "Historique client et preferences",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                      <Check className="h-4 w-4 shrink-0 text-amber-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-white/5 bg-black/40 p-8 sm:p-12 lg:border-l lg:border-t-0">
                <div className="space-y-4">
                  <StatBar label="Burger Classique" value={42} />
                  <StatBar label="Frites" value={38} />
                  <StatBar label="Menu Duo" value={24} />
                  <StatBar label="Boisson" value={31} />
                </div>
                <div className="mt-8 flex items-end justify-between border-t border-white/5 pt-6">
                  <div>
                    <p className="text-xs text-zinc-500">CA aujourd&apos;hui</p>
                    <p className="text-3xl font-bold text-white">1 247 EUR</p>
                  </div>
                  <p className="text-sm text-emerald-400">+18% vs hier</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="tarifs" className="border-t border-white/5 py-24">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">Tarifs</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Un prix simple et transparent</h2>
            <p className="mx-auto mt-4 max-w-lg text-zinc-400">
              Pas de commission par commande. Un abonnement fixe, tout inclus.
            </p>
            <div className="mx-auto mt-12 max-w-md">
              <div className="glass-card animate-pulse-ring rounded-3xl p-8 text-left">
                <p className="text-sm font-medium text-amber-400">Offre lancement</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">99</span>
                  <span className="text-xl text-zinc-400">EUR / mois</span>
                </div>
                <p className="mt-2 text-sm text-zinc-500">+ essai gratuit 2 semaines</p>
                <ul className="mt-8 space-y-3">
                  {PLANS.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                      <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="mt-8 flex w-full items-center justify-center rounded-full bg-amber-500 py-3.5 text-sm font-semibold text-black transition hover:bg-amber-400"
                >
                  Reserver mon essai gratuit
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold">Questions frequentes</h2>
          <div className="mt-12 space-y-4">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] open:bg-white/[0.04]"
              >
                <summary className="cursor-pointer list-none px-6 py-4 font-medium text-white [&::-webkit-details-marker]:hidden">
                  {item.q}
                </summary>
                <p className="border-t border-white/5 px-6 py-4 text-sm leading-relaxed text-zinc-400">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 px-8 py-16 text-center sm:px-16">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wOCI+PHBhdGggIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-black sm:text-4xl">
                Pret a ne plus perdre une commande ?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-black/70">
                Rejoignez les restaurants qui automatisent leur prise de commande.
                Installation en 24h, essai gratuit 2 semaines.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="mailto:contact@agencybinari.com?subject=Essai%20gratuit%20ASTOR"
                  className="inline-flex rounded-full bg-black px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-900"
                >
                  Demander une demo
                </a>
                <Link
                  href="/demo"
                  className="inline-flex rounded-full border-2 border-black/20 px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-black/10"
                >
                  Essayer la demo vocale
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono text-zinc-500">{value}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
