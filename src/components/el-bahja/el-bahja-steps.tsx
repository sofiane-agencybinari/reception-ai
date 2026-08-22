import { ClipboardList, MapPin, Phone } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Phone,
    title: "Appelez-nous",
    text: "Composez notre numéro et indiquez votre commande. Notre équipe vous guide dans le menu.",
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "Choisissez votre menu",
    text: "Sandwichs, assiettes, formules, boissons et sauces — composez votre repas sur mesure.",
  },
  {
    step: "03",
    icon: MapPin,
    title: "Retirez sur place",
    text: "Venez récupérer votre commande au restaurant ou profitez d'une pause sur place.",
  },
] as const;

export function ElBahjaSteps() {
  return (
    <section id="commander" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-astor-accent">
          Comment commander
        </p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          Votre commande en 3 étapes
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-zinc-400">
          Simple, rapide et sans application. Appelez, choisissez, récupérez.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {STEPS.map(({ step, icon: Icon, title, text }) => (
          <article
            key={step}
            className="group glass-card rounded-2xl p-6 transition hover:border-astor-accent/20"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm text-astor-accent">{step}</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-astor-accent/10 text-astor-accent-soft transition group-hover:bg-astor-accent/20">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
