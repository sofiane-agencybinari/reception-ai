import { UtensilsCrossed } from "lucide-react";

import { RESTAURANT_TYPES } from "@/components/marketing/marketing-data";

export function MarketingMarquee() {
  const items = [...RESTAURANT_TYPES, ...RESTAURANT_TYPES];

  return (
    <section className="border-y border-white/5 bg-astor-surface py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-6 flex items-center justify-center gap-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          <UtensilsCrossed className="h-3.5 w-3.5 text-astor-accent" />
          Concu pour votre restaurant
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-astor-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-astor-surface to-transparent" />
        <div className="flex animate-marquee gap-3 whitespace-nowrap">
          {items.map((type, i) => (
            <span
              key={`${type}-${i}`}
              className="inline-flex shrink-0 items-center rounded-full border border-white/8 bg-white/[0.03] px-5 py-2 text-sm font-medium text-zinc-300"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
