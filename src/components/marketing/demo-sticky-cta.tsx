"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  /** Element that must leave the viewport before the bar appears. */
  watchSelector?: string;
};

export function DemoStickyCta({ watchSelector = "#demo-widget" }: Props) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.querySelector(watchSelector);
    if (!target) {
      const onScroll = () => setVisible(window.scrollY > 280);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0.15 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [watchSelector]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 rounded-2xl border border-astor-accent/30 bg-[#050607]/92 px-4 py-3 shadow-[0_-12px_48px_-8px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:px-5">
            <p className="text-sm font-medium text-zinc-200 sm:text-[15px]">
              Convaincu ?{" "}
              <span className="text-white">S’abonner en ligne</span>
            </p>
            <motion.a
              href="/#essai"
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-astor-accent px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-astor-accent-soft sm:text-sm"
            >
              Demander
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
