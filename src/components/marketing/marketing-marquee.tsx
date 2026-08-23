"use client";

import { motion } from "motion/react";

import { RESTAURANT_TYPES } from "@/components/marketing/marketing-data";

const LINE =
  "NE RATE JAMAIS · VOIX NATURELLE · COMMANDE EN CUISINE · SMS CONFIRMÉ · ";

export function MarketingMarquee() {
  const items = [...RESTAURANT_TYPES, ...RESTAURANT_TYPES];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.05] py-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-astor-accent/[0.05] via-transparent to-astor-warm/[0.05]" />

      {/* Giant typographic ribbon — Silencio energy */}
      <div className="relative mb-8 overflow-hidden py-2">
        <motion.div
          className="flex whitespace-nowrap font-display text-[clamp(2.5rem,8vw,5.5rem)] font-bold tracking-[-0.04em] text-white/[0.06]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          <span className="pr-12">{LINE.repeat(4)}</span>
          <span className="pr-12">{LINE.repeat(4)}</span>
        </motion.div>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent sm:w-28" />
        <motion.div
          className="flex gap-3 whitespace-nowrap px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        >
          {[...items, ...items].map((type, i) => (
            <span
              key={`${type}-${i}`}
              className="inline-flex shrink-0 items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-300"
            >
              {type}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="relative mt-4 overflow-hidden">
        <motion.div
          className="flex gap-3 whitespace-nowrap px-4"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        >
          {[...items, ...items].map((type, i) => (
            <span
              key={`rev-${type}-${i}`}
              className="inline-flex shrink-0 items-center rounded-full border border-astor-accent/20 bg-astor-accent/[0.06] px-5 py-2.5 text-sm font-medium text-astor-accent-bright"
            >
              {type}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
