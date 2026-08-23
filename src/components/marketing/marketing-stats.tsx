"use client";

import { motion } from "motion/react";

import { HERO_STATS } from "@/components/marketing/marketing-data";

export function MarketingStats() {
  return (
    <section className="relative z-10 -mt-4 pb-6">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-6 sm:grid-cols-4 sm:gap-4">
        {HERO_STATS.map(({ value, label }, i) => (
          <motion.div
            key={label}
            className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-5 text-center backdrop-blur-sm transition hover:border-astor-accent/30 hover:bg-white/[0.04]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {value}
            </p>
            <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
              {label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
