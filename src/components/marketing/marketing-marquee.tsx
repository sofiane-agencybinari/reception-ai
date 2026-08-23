import { UtensilsCrossed } from "lucide-react";

import { RESTAURANT_TYPES } from "@/components/marketing/marketing-data";

export function MarketingMarquee() {
  const items = [...RESTAURANT_TYPES, ...RESTAURANT_TYPES];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.05] py-12">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-astor-accent/[0.04] via-transparent to-astor-warm/[0.04]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <p className="mb-7 flex items-center justify-center gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          <UtensilsCrossed className="h-3.5 w-3.5 text-astor-accent" />
          Concu pour votre type de resto
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent sm:w-28" />
        <div className="flex animate-marquee gap-3 whitespace-nowrap px-4">
          {items.map((type, i) => (
            <span
              key={`${type}-${i}`}
              className="inline-flex shrink-0 items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-astor-accent/30 hover:text-white"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
