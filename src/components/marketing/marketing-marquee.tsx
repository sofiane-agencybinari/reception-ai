"use client";

import { motion, useReducedMotion } from "motion/react";

import { RESTAURANT_TYPES } from "@/components/marketing/marketing-data";

export function MarketingMarquee() {
  const reduce = useReducedMotion();
  const items = [...RESTAURANT_TYPES, ...RESTAURANT_TYPES];

  return (
    <section className="relative overflow-hidden border-y border-zinc-200/80 py-7">
      <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
        Fait pour le fast-food
      </p>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f7f6f3] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f7f6f3] to-transparent sm:w-24" />
        {reduce ? (
          <div className="flex flex-wrap justify-center gap-2 px-6">
            {RESTAURANT_TYPES.map((type) => (
              <span
                key={type}
                className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700"
              >
                {type}
              </span>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex gap-3 whitespace-nowrap px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[...items, ...items].map((type, i) => (
              <span
                key={`${type}-${i}`}
                className="inline-flex shrink-0 items-center rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-medium text-zinc-700 shadow-sm"
              >
                {type}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
