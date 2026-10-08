"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { gsap, prefersReducedMotion, useGSAP } from "./gsap";
import { EASE, SectionHead } from "./reveal";

/* ─── Journée simulée (illustration) ─────────────────────────────── */

const START = 11 * 60; // 11:00
const END = 23 * 60; // 23:00
const SPAN = END - START;

const MENU = [
  { label: "2× Tacos M · 2× Coca", total: 19 },
  { label: "Menu kebab · Frites", total: 12.5 },
  { label: "1× Reine · 1× Tiramisu", total: 18 },
  { label: "Burger cheddar · Milkshake", total: 15 },
  { label: "3× Kebab · 1× Ayran", total: 27.5 },
  { label: "2× Margherita", total: 18 },
  { label: "Wrap poulet · Ice Tea", total: 10.5 },
  { label: "Menu enfant · 2× Tacos L", total: 31 },
] as const;
const NAMES = ["Yanis", "Camille", "Karim", "Sophie", "Inès", "Hugo", "Léa", "Mehdi", "Sarah", "Nabil"];

/** PRNG déterministe : la même journée à chaque rendu. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Call = { at: number; name: string; label: string; total: number };

function buildDay(): Call[] {
  const rnd = seeded(42);
  // [début, fin, nombre d'appels] — deux rushs, un creux l'après-midi
  const windows: [number, number, number][] = [
    [11 * 60 + 20, 11 * 60 + 50, 3],
    [11 * 60 + 50, 14 * 60, 22],
    [14 * 60, 18 * 60 + 30, 5],
    [18 * 60 + 30, 21 * 60 + 45, 31],
    [21 * 60 + 45, 22 * 60 + 50, 5],
  ];
  const calls: Call[] = [];
  for (const [a, b, n] of windows) {
    for (let i = 0; i < n; i++) {
      const dish = MENU[Math.floor(rnd() * MENU.length)];
      calls.push({ at: a + rnd() * (b - a), name: NAMES[Math.floor(rnd() * NAMES.length)], ...dish });
    }
  }
  return calls.sort((x, y) => x.at - y.at);
}

const CALLS = buildDay();

/** Courbe de volume (appels par tranche de 20 min, lissée) en coordonnées 0–1000 × 0–100. */
function buildCurve(calls: Call[]) {
  const bucket = 20;
  const n = Math.ceil(SPAN / bucket);
  const counts = new Array(n).fill(0);
  calls.forEach((c) => counts[Math.min(n - 1, Math.floor((c.at - START) / bucket))]++);
  const smooth = counts.map((_, i) => (counts[i - 1] ?? counts[i]) * 0.25 + counts[i] * 0.5 + (counts[i + 1] ?? counts[i]) * 0.25);
  const max = Math.max(...smooth);
  const pts = smooth.map((v, i) => [((i + 0.5) / n) * 1000, 96 - (v / max) * 84] as const);
  let d = `M 0 96 L ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
  }
  return { line: d.replace("M 0 96 L", "M"), area: `${d} L 1000 96 Z` };
}

const CURVE = buildCurve(CALLS);

const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.floor(m % 60)).padStart(2, "0")}`;
const euros = (v: number) => v.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

/* ─── Section ────────────────────────────────────────────────────── */

export function DayTimeline() {
  const root = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.delayedCall(0, () => setP(1)); // journée complète, sans épinglage
        return;
      }
      const state = { p: 0 };
      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => setP(Math.round(state.p * 2000) / 2000),
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 0.8,
        },
      });
    },
    { scope: root },
  );

  const now = START + p * SPAN;
  const passed = useMemo(() => CALLS.filter((c) => c.at <= now), [now]);
  const last = passed[passed.length - 1];
  const revenue = passed.reduce((s, c) => s + c.total, 0);
  const hours = Array.from({ length: 13 }, (_, i) => 11 + i);

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-[var(--lx-paper)] text-[var(--lx-ink)]">
      <div className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-6 px-5 pt-20 sm:gap-14 sm:px-10 sm:pt-20">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead
            index="01"
            label="Une journée avec Ligne"
            title={
              <>
                Du premier appel de midi <span className="lx-italic">au dernier de la nuit.</span>
              </>
            }
            text={
              <>
                <span className="sm:hidden">Faites défiler : chaque point est un appel décroché et envoyé en cuisine.</span>
                <span className="hidden sm:inline">
                  Faites défiler : voici une journée type d’un snack équipé de Ligne. Chaque point est un appel décroché, pris
                  en commande et envoyé en cuisine.
                </span>
              </>
            }
          />

          <div className="w-full max-w-[300px] lg:w-[300px]">
            <p className="hidden font-[family-name:var(--lx-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--lx-muted)] sm:block">
              Dernier appel
            </p>
            <div className="relative h-[72px] overflow-hidden sm:mt-3 sm:h-[84px] rounded-2xl border border-[var(--lx-line)] bg-white/60">
              <AnimatePresence mode="popLayout" initial={false}>
                {last ? (
                  <motion.div
                    key={last.at}
                    initial={{ y: 24, opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -24, opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="absolute inset-0 flex items-center justify-between gap-3 px-4"
                  >
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-[13px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--lx-cherry)]" />
                        {last.name} · <span className="tabular-nums text-[var(--lx-muted)]">{hhmm(last.at)}</span>
                      </p>
                      <p className="mt-1 truncate text-[13px] text-[var(--lx-muted)]">{last.label}</p>
                    </div>
                    <p className="shrink-0 font-serif text-xl tabular-nums">{last.total.toFixed(2).replace(".", ",")} €</p>
                  </motion.div>
                ) : (
                  <p className="absolute inset-0 grid place-items-center text-[13px] text-[var(--lx-muted)]">Ouverture à 11 h…</p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Frise */}
        <div>
          <div className="relative h-[96px] sm:h-[150px]">
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <defs>
                <linearGradient id="day-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#5c2a36" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#5c2a36" stopOpacity="0" />
                </linearGradient>
                <clipPath id="day-clip">
                  <rect x="0" y="-10" width={p * 1000} height="120" />
                </clipPath>
              </defs>
              <path d={CURVE.line} fill="none" stroke="#1a1816" strokeOpacity="0.08" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <g clipPath="url(#day-clip)">
                <path d={CURVE.area} fill="url(#day-fill)" />
                <path d={CURVE.line} fill="none" stroke="#5c2a36" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </g>
            </svg>

            {/* Appels */}
            {CALLS.map((c, i) => {
              const x = (c.at - START) / SPAN;
              const on = c.at <= now;
              return (
                <span
                  key={i}
                  className="absolute bottom-0 h-full w-px origin-bottom transition-[transform,opacity] duration-500 ease-out"
                  style={{ left: `${x * 100}%`, transform: `scaleY(${on ? 1 : 0})`, opacity: on ? 1 : 0 }}
                  aria-hidden
                >
                  <span className="absolute bottom-0 left-0 h-[22%] w-px bg-[var(--lx-ink)]/20" />
                  <span className="absolute bottom-[22%] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[var(--lx-cherry)]" />
                </span>
              );
            })}

            {/* Tête de lecture */}
            <div className="pointer-events-none absolute inset-y-0 w-px bg-[var(--lx-ink)]" style={{ left: `${p * 100}%` }}>
              <span className="absolute -top-7 left-0 rounded-full bg-[var(--lx-ink)] px-2 py-0.5 font-[family-name:var(--lx-mono)] text-[10px] tabular-nums text-[var(--lx-paper)]"
                style={{ transform: `translateX(-${p * 100}%)` }}
              >
                {hhmm(now)}
              </span>
            </div>
          </div>

          <div className="relative mt-3 h-4 border-t border-[var(--lx-line)]">
            {hours.map((h, i) => (
              <span
                key={h}
                className={`absolute top-2 -translate-x-1/2 font-[family-name:var(--lx-mono)] text-[10px] text-[var(--lx-muted)] ${i % 2 ? "hidden sm:block" : ""}`}
                style={{ left: `${(i / 12) * 100}%` }}
              >
                {h}h
              </span>
            ))}
          </div>
        </div>

        {/* Compteurs */}
        <dl className="grid grid-cols-2 gap-y-4 border-t border-[var(--lx-line)] pt-4 sm:grid-cols-4 sm:pt-6">
          {[
            ["Appels décrochés", String(passed.length)],
            ["Panier moyen", passed.length ? `${(revenue / passed.length).toFixed(2).replace(".", ",")} €` : "—"],
            ["Chiffre d’affaires", `${euros(revenue)} €`],
            ["Appels manqués", "0"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[12px] text-[var(--lx-muted)]">{label}</dt>
              <dd className="mt-1 font-serif text-[clamp(1.6rem,2.4vw,2.2rem)] tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="-mt-3 text-[11px] text-[var(--lx-muted)] sm:-mt-8">Journée simulée, à titre d’illustration.</p>
      </div>
    </section>
  );
}
