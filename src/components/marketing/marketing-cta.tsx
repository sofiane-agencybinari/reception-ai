import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";

export function MarketingCta() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-astor-accent/20">
        <div className="absolute inset-0 bg-gradient-to-br from-astor-surface via-teal-950/40 to-background" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-astor-warm/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-astor-accent/15 blur-[80px]" />
        <div className="relative px-8 py-16 text-center sm:px-16 sm:py-20">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Pret a automatiser vos commandes ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Prise de commande plus rapide, plus fluide et plus simple a gerer au quotidien.
            Integration en moins de 24h.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:contact@agencybinari.com?subject=Essai%20gratuit%20ASTOR"
              className="inline-flex items-center gap-2 rounded-full bg-astor-accent px-8 py-4 text-sm font-semibold text-white transition hover:bg-astor-accent-soft"
            >
              Demander mon installation
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 text-sm font-semibold text-zinc-200 transition hover:border-astor-accent/30 hover:text-white"
            >
              <Headphones className="h-4 w-4" />
              Parler a un expert
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
