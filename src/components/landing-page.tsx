import Link from "next/link";
import { ArrowRight, ChefHat, Clock, Phone, Sparkles, TrendingUp } from "lucide-react";

const STEPS = [
  {
    title: "Le client appelle",
    text: "Votre agent IA decroche, presente le menu et prend la commande en francais.",
  },
  {
    title: "La cuisine recoit",
    text: "La commande apparait instantanement sur l'ecran cuisine, sans post-it ni erreur.",
  },
  {
    title: "Vous pilotez",
    text: "Dashboard, historique clients, SMS de confirmation et stats en temps reel.",
  },
] as const;

const FEATURES = [
  { icon: Phone, title: "Zero appel manque", text: "Disponible 24h/24, meme pendant le rush du midi." },
  { icon: ChefHat, title: "Ecran cuisine live", text: "Statuts new → ready, workflow clair pour l'equipe." },
  { icon: Clock, title: "Gain de temps", text: "Fini de repeter le menu et de noter les commandes a la main." },
  { icon: TrendingUp, title: "Pilotage simple", text: "Panier moyen, delais, annulations : tout est trace." },
] as const;

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-indigo-300/80">Reception AI</p>
          <p className="text-xl font-bold tracking-[0.15em]">ASTOR</p>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/demo" className="hidden rounded-full px-4 py-2 text-slate-300 transition hover:text-white sm:inline">
            Demo vocale
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-slate-700 px-4 py-2 text-slate-200 transition hover:border-indigo-400 hover:text-white"
          >
            Espace client
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <section className="animate-fade-up pt-10 pb-16 text-center sm:pt-16">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs text-indigo-200">
            <Sparkles className="h-3.5 w-3.5" />
            Receptionniste telephonique IA pour restaurants
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Ne ratez plus aucune commande telephone
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            ASTOR decroche, prend la commande, l&apos;envoie en cuisine et confirme au client.
            Vous gardez le controle depuis un dashboard simple.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-indigo-50"
            >
              Tester la demo vocale
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="mailto:contact@agencybinari.com?subject=Demo%20ASTOR%20Reception%20AI"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-indigo-400"
            >
              Demander une demo gratuite
            </a>
          </div>
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-4 text-center">
            {[
              ["0", "appel manque"],
              ["-2h", "par jour"],
              ["24/7", "disponible"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-center text-3xl font-bold">Comment ca marche</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
              >
                <p className="font-mono text-xs text-indigo-300">0{index + 1}</p>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-center text-3xl font-bold">Pourquoi les restos nous choisissent</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/80 to-slate-900 p-8 text-center sm:p-12">
            <p className="text-xs uppercase tracking-[0.25em] text-indigo-300">Offre de lancement</p>
            <h2 className="mt-4 text-3xl font-bold">A partir de 99 EUR / mois</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Installation, agent vocal configure, ecran cuisine et support pilote inclus.
              Essai gratuit 2 semaines pour le premier restaurant partenaire.
            </p>
            <a
              href="mailto:contact@agencybinari.com?subject=Essai%20gratuit%20ASTOR"
              className="mt-8 inline-flex rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Reserver mon essai gratuit
            </a>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>ASTOR Reception AI — Automatisation telephonique pour restaurants</p>
        <p className="mt-2">
          <Link href="/login" className="text-slate-400 hover:text-white">
            Acces espace client
          </Link>
        </p>
      </footer>
    </div>
  );
}
