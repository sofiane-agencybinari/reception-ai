const QUOTES = [
  {
    text: "Depuis ASTOR, on ne rate plus le rush du midi. La cuisine recoit tout proprement.",
    author: "Karim",
    role: "Gerant · snack Montpellier",
  },
  {
    text: "L'upsell naturel a fait monter le panier. Et l'equipe n'est plus colle au telephone.",
    author: "Sofia",
    role: "Responsable · pizzeria",
  },
  {
    text: "Installation en une journee. Le dashboard nous montre enfin ce qu'on vend au tel.",
    author: "Yanis",
    role: "Franchise · burger",
  },
] as const;

export function MarketingSocialProof() {
  return (
    <section className="border-y border-white/[0.05] bg-astor-surface/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-astor-accent">
              Temoignages
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Des restos qui respirent
              <br className="hidden sm:block" /> pendant le rush
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
            Pilotes en France — fast-food, kebab, pizza, burger. Meme probleme : trop d&apos;appels,
            trop peu de mains.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {QUOTES.map((q) => (
            <blockquote
              key={q.author}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition hover:border-astor-accent/25"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-astor-accent/10 blur-2xl transition group-hover:bg-astor-accent/20" />
              <p className="font-display text-4xl leading-none text-astor-accent/40">&ldquo;</p>
              <p className="relative mt-2 text-sm leading-relaxed text-zinc-300">{q.text}</p>
              <footer className="relative mt-6 border-t border-white/[0.06] pt-4">
                <p className="text-sm font-semibold text-white">{q.author}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{q.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
