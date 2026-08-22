import { FEATURES } from "@/components/marketing/marketing-data";

export function MarketingFeaturesBento() {
  return (
    <section id="fonctionnalites" className="border-t border-white/5 bg-astor-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-astor-accent">
            Fonctionnalites
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Tout ce dont vous avez besoin</h2>
          <p className="mt-4 text-zinc-400">
            Les memes services que les leaders du marche — plus analytics, SMS, CRM et multi-sites
            integres nativement.
          </p>
        </div>

        <div className="mt-14 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            const span =
              feature.size === "lg"
                ? "sm:col-span-2 lg:row-span-2"
                : feature.size === "md"
                  ? "sm:col-span-1"
                  : "";

            return (
              <article
                key={feature.title}
                className={`group relative overflow-hidden rounded-2xl border border-white/6 bg-white/[0.02] p-6 transition hover:border-astor-accent/25 hover:bg-white/[0.04] ${span}`}
              >
                {feature.highlight ? (
                  <span className="absolute right-4 top-4 rounded-full bg-astor-warm/15 px-2.5 py-0.5 text-xs font-semibold text-astor-warm">
                    {feature.highlight}
                  </span>
                ) : null}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-astor-accent/20 to-teal-900/30 text-astor-accent-soft">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{feature.text}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
