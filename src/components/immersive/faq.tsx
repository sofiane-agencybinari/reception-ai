"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { FAQ } from "@/components/marketing/marketing-data";

import { EASE, Reveal, SectionHead } from "./reveal";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" data-tone="dark" className="relative overflow-hidden bg-[#120c0e] px-5 py-28 text-[#f2efe8] sm:px-10 sm:py-36">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] top-[10%] h-[55vw] w-[55vw] rounded-full bg-[radial-gradient(circle,rgba(122,52,69,0.45)_0%,transparent_65%)] blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            index="05"
            label="Questions"
            tone="dark"
            title={
              <>
                Les réponses, <span className="lx-italic">simplement.</span>
              </>
            }
            text={
              <>
                Une autre question ?{" "}
                <a href="mailto:contact@agencybinari.com" className="text-[#f2efe8] underline underline-offset-4">
                  Écrivez-nous
                </a>
                .
              </>
            }
          />
        </div>

        <Reveal delay={0.1}>
          <ul className="border-t border-white/10">
            {FAQ.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q} className="border-b border-white/10">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className={`font-serif text-[1.15rem] transition-colors duration-300 ${isOpen ? "text-[#d9a3b0]" : "hover:text-[#d9a3b0]"}`}>
                      {item.q}
                    </span>
                    <span className="relative h-3 w-3 shrink-0" aria-hidden>
                      <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
                      <motion.span
                        className="absolute left-0 top-1/2 h-px w-3 bg-current"
                        animate={{ rotate: isOpen ? 0 : 90 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-xl pb-6 text-[14px] leading-relaxed text-[#f2efe8]/65">{item.a}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
