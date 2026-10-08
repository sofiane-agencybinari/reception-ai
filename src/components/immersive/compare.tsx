"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";

import { COMPARISON } from "@/components/marketing/marketing-data";

import { CharReveal } from "./char-reveal";
import { VIGNETTES } from "./feature-vignettes";
import type { FlowPose } from "./flow-canvas";
import { gsap, prefersReducedMotion, useGSAP } from "./gsap";
import { EASE } from "./reveal";

const FlowCanvas = dynamic(() => import("./flow-canvas"), { ssr: false });

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* ─── Mini-scènes « sans Ligne » ─── */

function BusyLine() {
  const rows = [
    { n: "06 12 •• •• 78", state: "En ligne avec l’équipe", ok: true },
    { n: "07 88 •• •• 44", state: "Tonalité occupée", ok: false },
    { n: "06 45 •• •• 33", state: "Tonalité occupée", ok: false },
    { n: "06 77 •• •• 10", state: "A raccroché", ok: false },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {rows.map((r, i) => (
        <motion.div
          key={r.n}
          className="flex items-center justify-between rounded-xl border border-[#1a1816]/[0.07] bg-white px-3.5 py-2.5 text-[13px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.18, duration: 0.5, ease: EASE }}
        >
          <span className="font-[family-name:var(--font-geist-mono)] tabular-nums">{r.n}</span>
          <span className={`flex items-center gap-2 text-[12px] ${r.ok ? "text-[#8a8175]" : "text-[#c2413f]"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${r.ok ? "bg-[#8a8175]" : "bg-[#e0605e]"}`} />
            {r.state}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function PostIt() {
  return (
    <div className="flex h-full items-center justify-center gap-5">
      {[
        { t: "2 tacos ?? sauce…", sub: "06 12 …", rot: -5, d: 0.1 },
        { t: "Pizza reine + ?", sub: "pour 20h ?", rot: 4, d: 0.35 },
      ].map((p) => (
        <motion.div
          key={p.t}
          className="w-36 bg-[#f5e27a] p-3 font-serif text-[15px] italic leading-snug text-[#1a1816] shadow-[0_14px_30px_-12px_rgba(0,0,0,0.35)]"
          initial={{ opacity: 0, y: -16, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: p.rot }}
          transition={{ delay: p.d, duration: 0.7, ease: EASE }}
        >
          {p.t}
          <span className="mt-2 block text-[12px] text-[#1a1816]/50 line-through">{p.sub}</span>
        </motion.div>
      ))}
    </div>
  );
}

function Criteria() {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-3 pb-2 font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.18em] text-[#8a8175]">
        <span />
        <span>Sans</span>
        <span className="text-[#5c2a36]">Avec Ligne</span>
      </div>
      {COMPARISON.map((row, i) => (
        <motion.div
          key={row.label}
          className="grid grid-cols-[1.2fr_1fr_1fr] items-baseline gap-3 border-t border-[#1a1816]/[0.08] py-2 text-[12px]"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: EASE }}
        >
          <span className="text-[#8a8175]">{row.label}</span>
          <span className="text-[#1a1816]/40 line-through decoration-[#1a1816]/25">{row.before}</span>
          <span className="font-medium">{row.after}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Scénario ─── */

type Scene = {
  pose: Omit<FlowPose, "mode"> & { mode: 0 | 1 };
  /** Grand titre centré (ouvertures) ou contenu placé à gauche / à droite. */
  title?: string;
  side?: "left" | "right";
  label?: string;
  heading?: string;
  text?: string;
  card?: () => ReactNode;
  missed: number;
};

const SCENES: Scene[] = [
  { pose: { x: 0.5, y: 0.5, s: 1, mode: 0 }, title: "Sans Ligne", missed: 3 },
  {
    pose: { x: 0.5, y: 0.5, s: 1, mode: 0 },
    side: "left",
    label: "12:03 · le rush",
    heading: "Une seule ligne pour tout le monde.",
    text: "Trois clients appellent en même temps : deux tombent sur la tonalité occupée et vont voir ailleurs.",
    card: BusyLine,
    missed: 8,
  },
  {
    pose: { x: 0.5, y: 0.5, s: 1, mode: 0 },
    side: "right",
    label: "12:11 · en cuisine",
    heading: "La commande griffonnée sur un post-it.",
    text: "Ressaisie à la main, oublis, erreurs de sauce : le rush coûte des commandes et des clients.",
    card: PostIt,
    missed: 14,
  },
  { pose: { x: 0.5, y: 0.5, s: 1.25, mode: 1 }, title: "Avec Ligne", missed: 0 },
  {
    pose: { x: 0.72, y: 0.5, s: 0.95, mode: 1 },
    side: "left",
    label: "12:03 · le même rush",
    heading: "Tous les appels décrochés.",
    text: "Jusqu’à 10 appels en même temps, chacun pris en moins de deux secondes.",
    card: VIGNETTES["Plusieurs lignes"],
    missed: 0,
  },
  {
    pose: { x: 0.27, y: 0.58, s: 0.85, mode: 1 },
    side: "right",
    label: "12:11 · en cuisine",
    heading: "La commande arrive toute seule.",
    text: "Sur l’écran cuisine dès que le client raccroche, avec un SMS de confirmation. Zéro ressaisie.",
    card: VIGNETTES["SMS confirmation"],
    missed: 0,
  },
  {
    pose: { x: 0.76, y: 0.45, s: 0.8, mode: 1 },
    side: "left",
    label: "Le bilan",
    heading: "Même équipe. Même numéro. Un autre service.",
    card: Criteria,
    missed: 0,
  },
];

const SWITCH = SCENES.findIndex((s) => s.pose.mode === 1);
const TRAVEL = 0.35;

function MissedCounter({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => String(Math.round(v)));
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.9, ease: EASE });
    return () => c.stop();
  }, [mv, value]);
  return <motion.span className="tabular-nums">{text}</motion.span>;
}

/**
 * Avant / avec Ligne — « le flux d'appels ».
 * Sans Ligne : des centaines d'appels errent dans l'écran, certains s'éteignent.
 * La bascule les aspire en un tourbillon bordeaux qui voyage ensuite de scène en scène.
 */
export function Compare() {
  const root = useRef<HTMLElement>(null);
  const pose = useRef<FlowPose>({ x: 0.5, y: 0.5, s: 1, mode: 0 });
  const [view, setView] = useState({ scene: 0, arrived: false });
  const [mobile, setMobile] = useState(false);

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
        const f = clamp(p) * SCENES.length;
        const i = Math.min(SCENES.length - 1, Math.floor(f));
        const t = f - i;
        const isMobile = window.matchMedia("(max-width: 1023px)").matches;
        // Mobile : galaxie centrée sur les écrans de titre, en haut quand du contenu s'affiche dessous.
        const fit = (sc: Scene) =>
          isMobile
            ? { ...sc.pose, x: 0.5, y: sc.title || !sc.pose.mode ? 0.5 : 0.26, s: sc.pose.s * (sc.title ? 0.8 : 0.6) }
            : sc.pose;
        const to = fit(SCENES[i]);
        const from = fit(SCENES[Math.max(0, i - 1)]);
        const e = smooth(0, TRAVEL, t);
        pose.current = {
          x: from.x + (to.x - from.x) * e,
          y: from.y + (to.y - from.y) * e - Math.sin(Math.PI * e) * (Math.abs(to.x - from.x) > 0.2 ? 0.08 : 0),
          s: from.s + (to.s - from.s) * e,
          mode: to.mode,
        };
        const arrived = t > TRAVEL * 0.8;
        setView((v) => (v.scene === i && v.arrived === arrived ? v : { scene: i, arrived }));
      };

      if (prefersReducedMotion()) {
        gsap.delayedCall(0, () => apply(1));
        return;
      }
      const state = { p: 0 };
      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => apply(state.p),
        scrollTrigger: { trigger: root.current, start: "top top", end: `+=${SCENES.length * 75}%`, pin: true, scrub: 0.6 },
      });
      apply(0);
    },
    { scope: root },
  );

  const scene = SCENES[view.scene];
  const Card = scene.card;
  const isAfter = view.scene >= SWITCH;

  return (
    <section ref={root} id="avant-apres" data-tone="dark" className="relative h-[100svh] overflow-hidden bg-[#120a0c] text-[#f2efe8]">
      {/* Lumière : froide avant, bordeaux après */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-[1600ms]"
        style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(60,80,110,0.25), transparent 70%)", opacity: isAfter ? 0 : 1 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-[1600ms]"
        style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(122,52,69,0.35), transparent 70%)", opacity: isAfter ? 1 : 0 }}
      />

      <div className="absolute inset-0 z-10">
        <FlowCanvas pose={pose} />
      </div>

      {/* Lueur IA au moment de la bascule */}
      <AnimatePresence>
        {view.scene === SWITCH && view.arrived ? (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[15]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.55] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, times: [0, 0.3, 1] }}
            aria-hidden
          >
            <div className="lx-ai-glow">
              <span />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Repères */}
      <div className="absolute left-5 top-24 z-30 flex items-center gap-4 sm:left-10 sm:top-28">
        <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.22em] text-[#d9a3b0]">03 — Avant / avec Ligne</p>
        <p className="hidden text-[11px] lg:block">
          <span className={isAfter ? "text-white/30" : "text-[#f2efe8]"}>Sans</span>
          <span className="mx-2 text-white/20">/</span>
          <span className={isAfter ? "text-[#f2efe8]" : "text-white/30"}>Avec</span>
        </p>
      </div>
      <div className="absolute bottom-6 right-5 z-30 text-right sm:right-10">
        <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-white/45">Appels manqués</p>
        <p className={`mt-1 font-sans text-[clamp(2rem,3vw,2.8rem)] font-medium leading-none transition-colors duration-700 ${scene.missed ? "text-[#e0605e]" : "text-[#d9a3b0]"}`}>
          <MissedCounter value={scene.missed} />
        </p>
        <p className="mt-1 text-[10px] text-white/35">service de midi · illustration</p>
      </div>

      <AnimatePresence mode="wait">
        {view.arrived && scene.title ? (
          <motion.div
            key={`title-${view.scene}`}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center"
            exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)", transition: { duration: 0.4 } }}
          >
            <h3 className="font-sans text-[clamp(3rem,9vw,8.5rem)] font-medium leading-none tracking-[-0.05em] [text-shadow:0_10px_50px_rgba(0,0,0,0.6)]">
              <CharReveal text={scene.title} show fromHidden stagger={0.045} />
            </h3>
          </motion.div>
        ) : null}

        {view.arrived && scene.heading ? (
          <motion.div
            key={`scene-${view.scene}`}
            className={`absolute z-20 w-[min(92vw,410px)] ${
              mobile
                ? "bottom-24 left-1/2 -translate-x-1/2"
                : `top-1/2 -translate-y-1/2 ${scene.side === "left" ? "left-[8%]" : "right-[8%]"}`
            }`}
            initial={{ opacity: 0, x: mobile ? 0 : scene.side === "left" ? -30 : 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.3 } }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className={`font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] ${isAfter ? "text-[#d9a3b0]" : "text-[#9fb0c6]"}`}>
              {scene.label}
            </p>
            <h3 className="mt-2 font-sans text-[clamp(1.5rem,2.3vw,2.1rem)] font-medium leading-tight tracking-[-0.035em]">
              <CharReveal text={scene.heading} show fromHidden stagger={0.018} />
            </h3>
            {scene.text ? (
              <motion.p
                className="mt-2 text-[14px] leading-relaxed text-white/60"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
              >
                {scene.text}
              </motion.p>
            ) : null}
            {Card ? (
              <motion.div
                className="mt-6 overflow-hidden rounded-[18px] border border-white/20 bg-[#f3f0ed] text-[#1a1816] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)]"
                initial={{ opacity: 0, y: 24, rotateX: -12 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
                style={{ transformPerspective: 900 }}
              >
                <div className="relative aspect-[4/3]">
                  <div className="absolute inset-0 px-6 py-5">
                    <Card />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
