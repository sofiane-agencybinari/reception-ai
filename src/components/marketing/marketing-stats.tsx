import { HERO_STATS } from "@/components/marketing/marketing-data";

export function MarketingStats() {
  return (
    <section className="relative z-10 -mt-4 pb-6">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-6 sm:grid-cols-4 sm:gap-4">
        {HERO_STATS.map(({ value, label }, i) => (
          <div
            key={label}
            className="animate-fade-up group rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-5 text-center backdrop-blur-sm transition hover:border-astor-accent/30 hover:bg-white/[0.04]"
            style={{ animationDelay: `${0.05 * i}s` }}
          >
            <p className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {value}
            </p>
            <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
