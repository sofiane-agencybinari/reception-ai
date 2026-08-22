import { ChefHat, Flame, Sandwich, Timer } from "lucide-react";

const FEATURES = [
  {
    icon: Sandwich,
    title: "Sandwichs maison",
    text: "Kebab, grillades et sandwichs généreux préparés à la commande.",
  },
  {
    icon: Flame,
    title: "Assiettes & formules",
    text: "Formules complètes et assiettes copieuses pour un repas sur place ou à emporter.",
  },
  {
    icon: Timer,
    title: "Commande rapide",
    text: "Passez commande par téléphone en quelques minutes, sans attente au comptoir.",
  },
  {
    icon: ChefHat,
    title: "Fait sur place",
    text: "Produits frais, préparés par notre équipe au 63 avenue de Palavas.",
  },
] as const;

export function ElBahjaFeatures() {
  return (
    <section className="border-t border-white/5 bg-astor-surface py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-astor-accent">
            Nos spécialités
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Du kebab aux formules,
            <br />
            <span className="text-zinc-500">tout est fait maison.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition hover:border-astor-accent/20 hover:bg-white/[0.04]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-astor-accent/10 text-astor-accent-soft transition group-hover:bg-astor-accent/20">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
