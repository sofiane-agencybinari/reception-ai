import { ArrowDown, Phone, UtensilsCrossed } from "lucide-react";

import { EL_BAHJA } from "@/lib/el-bahja";

export function ElBahjaHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-astor-accent/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-[280px] w-[360px] rounded-full bg-teal-900/25 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 text-center sm:pt-20">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-astor-accent/20 bg-astor-accent/10 px-4 py-1.5 text-xs font-medium text-teal-100">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            {EL_BAHJA.tagline}
          </div>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Commandez sans{" "}
            <span className="text-gradient">attendre</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            {EL_BAHJA.name} à Montpellier — sandwichs, assiettes et formules kebab & grillades.
            Passez commande par téléphone, retrait sur place ou à emporter.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`tel:${EL_BAHJA.phone}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-astor-accent px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-astor-accent-soft sm:w-auto"
            >
              <Phone className="h-4 w-4" />
              {EL_BAHJA.phoneDisplay}
            </a>
            <a
              href="#carte"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-8 py-3.5 text-sm font-medium text-zinc-200 transition hover:border-astor-accent/30 hover:text-white sm:w-auto"
            >
              Voir la carte
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
