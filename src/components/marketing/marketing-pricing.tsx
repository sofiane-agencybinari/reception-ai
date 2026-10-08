"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import { PRICING_PLANS } from "@/components/marketing/marketing-data";

const ease = [0.23, 1, 0.32, 1] as const;

/** Capacité concurrente — le vrai levier restaurant */
const CONCURRENT: Record<string, number> = {
  essentiel: 2,
  pro: 4,
  business: 10,
};

/**
 * Tarifs immersifs — un plan à la fois.
 * Le chiffre héro = appels simultanés ; le prix mute en dessous.
 */
export function MarketingPricing() {
  const reduce = useReducedMotion();
  const defaultIndex = Math.max(
    0,
    PRICING_PLANS.findIndex((p) => p.popular),
  );
  const [index, setIndex] = useState(defaultIndex);
  const plan = PRICING_PLANS[index] ?? PRICING_PLANS[0];
  const concurrent = CONCURRENT[plan.id] ?? 2;

  function go(dir: -1 | 1) {
    setIndex((i) => (i + dir + PRICING_PLANS.length) % PRICING_PLANS.length);
  }

  return (
    <section id="tarifs" className="relative overflow-hidden bg-[#f3f0ed] py-24 sm:py-32">
      {/* Halo qui change d’intensité selon le plan */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[42%] h-[min(70vw,520px)] w-[min(70vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden
        animate={{
          opacity: 0.08 + index * 0.06,
          scale: 0.92 + index * 0.08,
        }}
        transition={{ duration: 0.7, ease }}
        style={{
          background:
            "radial-gradient(circle, rgba(92,42,54,0.55) 0%, transparent 68%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.p
          className="font-serif text-[11px] uppercase tracking-[0.34em] text-[#8a8175]"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease }}
        >
          Tarifs
        </motion.p>
        <h2 className="font-serif mt-5 text-[clamp(2rem,4.8vw,3.1rem)] font-normal leading-[1.12] tracking-[-0.03em] text-[#1a1816]">
          <span className="italic">Choisissez</span>{" "}
          <span className="uppercase tracking-[0.04em]">votre ligne.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-sm font-serif text-[15px] leading-relaxed text-[#5c574f]">
          Sans commission. Sans engagement. Résiliation mensuelle.
        </p>

        {/* Sélecteur de plans — piste éditoriale */}
        <div
          className="mt-12 flex items-center justify-center gap-1 sm:gap-2"
          role="tablist"
          aria-label="Formules"
        >
          {PRICING_PLANS.map((p, i) => {
            const active = i === index;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setIndex(i)}
                className={`marketing-btn relative px-4 py-2 font-serif text-[14px] transition sm:px-5 sm:text-[15px] ${
                  active ? "text-[#1a1816]" : "text-[#8a8175] hover:text-[#3d3a35]"
                }`}
              >
                {p.name}
                {active ? (
                  <motion.span
                    layoutId="tarif-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-[#1a1816]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Scène centrale */}
        <div className="relative mt-14 min-h-[22rem] sm:mt-16 sm:min-h-[24rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={plan.id}
              role="tabpanel"
              initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease }}
              className="absolute inset-0 flex flex-col items-center"
            >
              {plan.popular ? (
                <p className="font-serif text-[10px] uppercase tracking-[0.28em] text-[#8a8175]">
                  Le plus choisi
                </p>
              ) : (
                <p className="h-[15px]" aria-hidden />
              )}

              {/* Chiffre immersif = capacité ligne */}
              <p className="mt-4 font-serif text-[clamp(5.5rem,18vw,9.5rem)] font-normal leading-none tracking-[-0.06em] text-[#1a1816]">
                {concurrent}
              </p>
              <p className="mt-2 font-serif text-[15px] tracking-[0.04em] text-[#6f6a62] sm:text-[16px]">
                appels <span className="italic">simultanés</span>
              </p>

              {/* Prix */}
              <div className="mt-10 flex items-baseline gap-2">
                <span className="font-serif text-[clamp(2.4rem,6vw,3.25rem)] font-normal tracking-[-0.03em] text-[#1a1816]">
                  {plan.price}
                </span>
                <span className="font-serif text-[15px] text-[#8a8175]">€ / mois</span>
              </div>
              <p className="mt-2 font-serif text-[13px] text-[#8a8175]">
                + {plan.perMinute.toFixed(2).replace(".", ",")} € / minute d’appel
              </p>

              <p className="mx-auto mt-8 max-w-md font-serif text-[15px] leading-relaxed text-[#5c574f]">
                {plan.description}
              </p>

              <ul className="mt-8 space-y-2">
                {plan.features.slice(0, 5).map((f, fi) => (
                  <motion.li
                    key={f}
                    className="font-serif text-[14px] text-[#3d3a35]"
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.12 + fi * 0.05, duration: 0.35, ease }}
                  >
                    <span className="text-[#8a8175]">— </span>
                    {f}
                  </motion.li>
                ))}
              </ul>

              <a
                href="#essai"
                className="marketing-btn mt-10 inline-flex items-center gap-2 border border-[#1a1816] bg-[#1a1816] px-8 py-3.5 font-serif text-[14px] text-[#f2efe8] transition hover:bg-transparent hover:text-[#1a1816]"
              >
                Démarrer avec {plan.name}
                <span aria-hidden>→</span>
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav flèches + dots */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label="Formule précédente"
            onClick={() => go(-1)}
            className="marketing-btn font-serif text-[20px] text-[#8a8175] transition hover:text-[#1a1816]"
          >
            ←
          </button>
          <div className="flex gap-2">
            {PRICING_PLANS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                aria-label={p.name}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-[#1a1816]" : "w-1.5 bg-[#cfc7bb] hover:bg-[#8a8175]"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Formule suivante"
            onClick={() => go(1)}
            className="marketing-btn font-serif text-[20px] text-[#8a8175] transition hover:text-[#1a1816]"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
