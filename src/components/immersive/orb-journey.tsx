"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";

import { FEATURE_GROUPS } from "@/components/marketing/marketing-data";

import { CharReveal } from "./char-reveal";
import { VIGNETTES } from "./feature-vignettes";
import { gsap, prefersReducedMotion, useGSAP } from "./gsap";
import type { OrbPose } from "./orb-canvas";
import { EASE } from "./reveal";

const OrbCanvas = dynamic(() => import("./orb-canvas"), { ssr: false });

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

type Step = { kind: "chapter"; chapter: number } | { kind: "feature"; chapter: number; index: number };

/** Le scénario : chaque domaine s'ouvre par une plongée dans l'orbe, puis ses 4 capacités. */
const STEPS: Step[] = FEATURE_GROUPS.flatMap((g, c) => [
  { kind: "chapter" as const, chapter: c },
  ...g.features.map((_, i) => ({ kind: "feature" as const, chapter: c, index: i })),
]);

/** Positions de l'orbe pour les 4 capacités d'un domaine (desktop). */
const PATH = [
  { x: 0.28, y: 0.52, s: 1.0 },
  { x: 0.76, y: 0.3, s: 0.6 },
  { x: 0.26, y: 0.74, s: 0.72 },
  { x: 0.78, y: 0.6, s: 0.95 },
];

function poseFor(step: Step, mobile: boolean): Omit<OrbPose, "energy"> {
  if (step.kind === "chapter") return { x: 0.5, y: 0.5, s: mobile ? 1.7 : 2.7 };
  if (mobile) return { x: step.index % 2 ? 0.7 : 0.3, y: 0.27, s: 0.62 };
  const base = PATH[step.index % PATH.length];
  // Chaque domaine emprunte un trajet différent : direct, miroir horizontal, miroir vertical.
  if (step.chapter === 1) return { ...base, x: 1 - base.x };
  if (step.chapter === 2) return { ...base, y: 1.04 - base.y };
  return base;
}

/** Part de chaque étape consacrée au voyage de l'orbe (le reste : temps de lecture). */
const TRAVEL = 0.38;

/**
 * Capacités — « le voyage de l'orbe ».
 * L'orbe vocal traverse tout l'écran ; à chaque arrêt, une capacité apparaît
 * dans l'espace qu'il libère. Chaque domaine s'ouvre par une plongée dans l'orbe.
 */
export function OrbJourney() {
  const root = useRef<HTMLElement>(null);
  const pose = useRef<OrbPose>({ x: 0.5, y: 0.5, s: 0.2, energy: 0.6 });
  const [mobile, setMobile] = useState(false);
  const [view, setView] = useState({ step: 0, arrived: false });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useGSAP(
    () => {
      const apply = (p: number) => {
        const f = clamp(p) * STEPS.length;
        const i = Math.min(STEPS.length - 1, Math.floor(f));
        const t = f - i;
        const isMobile = window.matchMedia("(max-width: 1023px)").matches;
        const to = poseFor(STEPS[i], isMobile);
        const from = i === 0 ? { x: 0.5, y: 0.62, s: 0.25 } : poseFor(STEPS[i - 1], isMobile);
        const e = smooth(0, TRAVEL, t);
        // Trajectoire en arc : l'orbe s'élève au milieu du trajet.
        const lift = Math.sin(Math.PI * e) * (Math.abs(to.x - from.x) > 0.2 ? 0.1 : 0.04);
        pose.current = {
          x: from.x + (to.x - from.x) * e,
          y: from.y + (to.y - from.y) * e - lift,
          s: from.s + (to.s - from.s) * e,
          energy: STEPS[i].kind === "chapter" ? 1 : 0.6,
        };
        const arrived = t > TRAVEL * 0.8;
        setView((v) => (v.step === i && v.arrived === arrived ? v : { step: i, arrived }));
      };

      if (prefersReducedMotion()) {
        gsap.delayedCall(0, () => apply(1 / STEPS.length + 0.5 / STEPS.length));
        return;
      }
      const state = { p: 0 };
      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => apply(state.p),
        scrollTrigger: { trigger: root.current, start: "top top", end: `+=${STEPS.length * 70}%`, pin: true, scrub: 0.6 },
      });
      apply(0);
    },
    { scope: root },
  );

  const step = STEPS[view.step];
  const group = FEATURE_GROUPS[step.chapter];
  const feature = step.kind === "feature" ? group.features[step.index] : null;
  const orbPose = poseFor(step, mobile);
  const onLeft = orbPose.x < 0.5;
  const Vignette = feature ? VIGNETTES[feature.title] : null;

  return (
    <section ref={root} id="capacites" data-tone="dark" className="relative h-[100svh] overflow-hidden bg-[#120a0c] text-[#f2efe8]">
      {/* Lumière ambiante qui suit grossièrement l'orbe */}
      <div
        aria-hidden
        className="pointer-events-none absolute h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left,top] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          left: `${orbPose.x * 100}%`,
          top: `${orbPose.y * 100}%`,
          background: "radial-gradient(closest-side, rgba(122,52,69,0.4), rgba(92,42,54,0.1) 55%, transparent)",
        }}
      />

      <div className="absolute inset-0 z-10">
        <OrbCanvas pose={pose} />
      </div>

      {/* Repère permanent */}
      <div className="absolute left-5 top-24 z-30 flex items-center gap-4 sm:left-10 sm:top-28">
        <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.22em] text-[#d9a3b0]">02 — Tout ce que fait Ligne</p>
        <ol className="hidden gap-4 text-[11px] lg:flex">
          {FEATURE_GROUPS.map((g, i) => (
            <li key={g.label} className={`transition-colors duration-500 ${i === step.chapter ? "text-[#f2efe8]" : "text-white/30"}`}>
              {g.label}
            </li>
          ))}
        </ol>
      </div>

      <AnimatePresence mode="wait">
        {view.arrived && step.kind === "chapter" ? (
          /* Plongée dans l'orbe : le domaine s'écrit par-dessus */
          <motion.div
            key={`chapter-${step.chapter}`}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)", transition: { duration: 0.4 } }}
          >
            <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.3em] text-[#f2efe8]/70">
              <CharReveal text={`0${step.chapter + 1} · ${group.label}`} show fromHidden stagger={0.03} />
            </p>
            <h3 className="mt-5 max-w-3xl font-sans text-[clamp(2.2rem,5.2vw,4.8rem)] font-medium leading-[1.02] tracking-[-0.045em] [text-shadow:0_10px_40px_rgba(0,0,0,0.5)]">
              <CharReveal text={group.title} show fromHidden stagger={0.025} />
            </h3>
          </motion.div>
        ) : null}

        {view.arrived && feature ? (
          <motion.div
            key={`feature-${view.step}`}
            className={`absolute z-20 w-[min(92vw,400px)] ${
              mobile
                ? "bottom-8 left-1/2 -translate-x-1/2"
                : `top-1/2 -translate-y-1/2 ${onLeft ? "left-[54%]" : "right-[54%]"}`
            }`}
            initial={{ opacity: 0, x: mobile ? 0 : onLeft ? 30 : -30, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: mobile ? 0 : onLeft ? -20 : 20, filter: "blur(10px)", transition: { duration: 0.3 } }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
              {group.label}
              <span className="tabular-nums text-white/30">
                {String((step.kind === "feature" ? step.index : 0) + 1).padStart(2, "0")}/{String(group.features.length).padStart(2, "0")}
              </span>
            </p>
            <h3 className="mt-2 font-sans text-[clamp(1.6rem,2.4vw,2.2rem)] font-medium leading-tight tracking-[-0.035em]">
              <CharReveal text={feature.title} show fromHidden stagger={0.025} />
            </h3>
            <motion.p
              className="mt-2 text-[14px] leading-relaxed text-white/60"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
            >
              {feature.text}
            </motion.p>
            <motion.div
              className="mt-6 overflow-hidden rounded-[18px] border border-white/20 bg-[#f3f0ed] text-[#1a1816] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)]"
              initial={{ opacity: 0, y: 24, rotateX: -12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
              style={{ transformPerspective: 900 }}
            >
              <div className="relative aspect-[4/3]">
                <div className="absolute inset-0 px-6 py-5">{Vignette ? <Vignette /> : null}</div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="absolute bottom-6 right-5 z-30 hidden h-px w-40 overflow-hidden bg-white/15 sm:right-10 lg:block">
        <div className="h-full origin-left bg-[#d9a3b0] transition-transform duration-500" style={{ transform: `scaleX(${(view.step + 1) / STEPS.length})` }} />
      </div>
    </section>
  );
}
