"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Preloader luxe — minimal : marque + barre + %.
 */

const ease = [0.23, 1, 0.32, 1] as const;

type Props = {
  onReveal?: () => void;
  onComplete: () => void;
};

export function MarketingIntro({ onReveal, onComplete }: Props) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (reduce) {
      onReveal?.();
      onComplete();
      setGone(true);
      return;
    }

    const duration = 2000;
    const start = performance.now();
    let raf = 0;
    let exitTimer = 0;
    let doneTimer = 0;
    let revealed = false;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      setProgress(Math.min(100, Math.round(eased * 100)));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }

      setProgress(100);
      exitTimer = window.setTimeout(() => {
        if (!revealed) {
          revealed = true;
          onReveal?.();
        }
        setExiting(true);
        doneTimer = window.setTimeout(() => {
          setGone(true);
          onComplete();
        }, 900);
      }, 200);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [reduce, onComplete, onReveal]);

  if (gone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-[#f3f0ed]"
      initial={{ y: 0 }}
      animate={{ y: exiting ? "-105%" : 0 }}
      transition={{ duration: 0.9, ease }}
      aria-busy={!exiting}
      aria-label="Chargement"
    >
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <motion.p
          className="font-serif text-[clamp(1.6rem,4vw,2.4rem)] uppercase tracking-[0.18em] text-[#1a1816]/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease }}
        >
          LIGNE
        </motion.p>
      </div>

      <div className="px-8 pb-9 sm:px-12 sm:pb-11">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-2.5 flex justify-between">
            <span className="font-serif text-[12px] tabular-nums tracking-[0.06em] text-[#1a1816]/40">
              {progress}%
            </span>
          </div>
          <div className="h-px w-full overflow-hidden bg-[#1a1816]/10">
            <div
              className="h-full origin-left bg-[#1a1816]/70"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
