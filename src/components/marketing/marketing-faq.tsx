"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { FAQ } from "@/components/marketing/marketing-data";

export function MarketingFaq() {
  const [active, setActive] = useState(0);
  const current = FAQ[active] ?? FAQ[0];

  return (
    <section id="faq" className="border-t border-white/[0.05] py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-astor-accent">
            FAQ
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Sélectionnez une question — la réponse s’affiche à côté.
          </p>
        </div>

        {/* Liste verticale (longueur) + panneau réponse */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
          <nav
            aria-label="Questions fréquentes"
            className="flex flex-col gap-1 border-l border-white/[0.08] lg:sticky lg:top-28 lg:self-start"
          >
            {FAQ.map((item, index) => {
              const selected = active === index;
              return (
                <button
                  key={item.q}
                  type="button"
                  aria-current={selected ? "true" : undefined}
                  onClick={() => setActive(index)}
                  className={`relative -ml-px border-l-2 py-2.5 pl-4 pr-2 text-left text-sm leading-snug transition ${
                    selected
                      ? "border-astor-accent text-white"
                      : "border-transparent text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                  }`}
                >
                  <span className="mb-0.5 block font-mono text-[10px] tracking-wider text-zinc-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.q}
                </button>
              );
            })}
          </nav>

          <div className="min-h-[14rem] rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.q}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-mono text-[10px] tracking-[0.2em] text-astor-accent">
                  QUESTION {String(active + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {current.q}
                </h3>
                <p className="mt-5 text-[15px] leading-relaxed text-zinc-400">{current.a}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-6">
              <p className="text-xs text-zinc-500">Pas la bonne question ?</p>
              <a
                href="mailto:contact@agencybinari.com?subject=Question%20ASTOR"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-astor-accent-soft transition hover:text-astor-accent-bright"
              >
                Écrire à l’équipe
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
