"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { FAQ } from "@/components/marketing/marketing-data";

const ease = [0.23, 1, 0.32, 1] as const;

export function MarketingFaq() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section id="faq" className="relative bg-[#f3f0ed] py-28 sm:py-36">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <motion.p
          className="font-serif text-[11px] uppercase tracking-[0.34em] text-[#8a8175]"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease }}
        >
          FAQ
        </motion.p>
        <h2 className="font-serif mt-5 text-[clamp(2.1rem,5vw,3.1rem)] font-normal leading-[1.12] tracking-[-0.03em] text-[#1a1816]">
          <span className="block overflow-hidden">
            <motion.span
              className="block italic"
              initial={reduce ? false : { y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease }}
            >
              Questions
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block uppercase tracking-[0.04em]"
              initial={reduce ? false : { y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ delay: reduce ? 0 : 0.08, duration: 0.65, ease }}
            >
              fréquentes
            </motion.span>
          </span>
        </h2>
      </div>

      <div className="mx-auto mt-14 max-w-xl px-6">
        {FAQ.map((item, index) => {
          const open = active === index;
          return (
            <div key={item.q} className="border-t border-[#ddd6cb]/90 last:border-b">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setActive(index)}
                className="flex w-full items-baseline justify-between gap-6 py-5 text-left"
              >
                <span
                  className={`font-serif text-[16px] leading-snug sm:text-[17px] ${
                    open ? "text-[#1a1816]" : "text-[#6f6a62]"
                  }`}
                >
                  {item.q}
                </span>
                <span className="shrink-0 font-serif text-[#8a8175]" aria-hidden>
                  {open ? "–" : "+"}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 font-serif text-[15px] leading-relaxed text-[#5c574f] sm:text-[16px]">
                      {item.a}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
