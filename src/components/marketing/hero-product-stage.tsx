"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.23, 1, 0.32, 1] as const;

const TRANSCRIPT = [
  { who: "astor" as const, text: "Bonsoir, LIGNE pour Le Palmier — je vous écoute." },
  { who: "client" as const, text: "Un menu classique, avec frites et Coca." },
  { who: "astor" as const, text: "Parfait. Pour 14h45, emporter ?" },
  { who: "client" as const, text: "Oui, c'est bon." },
];

/**
 * Dual composition: live call transcript + kitchen screen.
 * Purpose: explain product in one glance — phone takes the order, kitchen sees it.
 */
export function HeroProductStage() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
      <div className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(61,155,143,0.22),transparent_65%)] blur-2xl" />

      <div className="relative grid gap-4 sm:grid-cols-[0.85fr_1.15fr] sm:items-end">
        {/* Call panel */}
        <motion.div
          className="relative z-20 order-2 sm:order-1 sm:mb-8"
          initial={reduce ? false : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: reduce ? 0 : 0.85, duration: 0.65, ease }}
        >
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0e12]/85 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {!reduce ? (
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/50" />
                  ) : null}
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <p className="text-[11px] font-semibold text-white">Appel en cours</p>
              </div>
              <CallTimer reduce={!!reduce} />
            </div>

            <div className="space-y-3 px-4 py-4">
              {TRANSCRIPT.map((line, i) => (
                <motion.div
                  key={i}
                  className={`flex ${line.who === "client" ? "justify-end" : "justify-start"}`}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduce ? 0 : 1.1 + i * 0.28,
                    duration: 0.42,
                    ease,
                  }}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed ${
                      line.who === "astor"
                        ? "rounded-tl-md bg-astor-accent/15 text-astor-accent"
                        : "rounded-tr-md bg-white/[0.06] text-zinc-200"
                    }`}
                  >
                    {line.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-white/[0.06] px-4 py-3">
              <MiniWave />
            </div>
          </div>
        </motion.div>

        {/* Kitchen panel */}
        <motion.div
          className="relative z-10 order-1 sm:order-2"
          animate={reduce ? undefined : { y: [0, -4, 0] }}
          transition={
            reduce
              ? undefined
              : { duration: 8, repeat: Infinity, ease: [0.77, 0, 0.175, 1] }
          }
          style={{ transformStyle: "preserve-3d", perspective: 1200 }}
        >
          <div className="relative overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-[#080b0f] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95),0_0_0_1px_rgba(61,155,143,0.12)]">
            {/* Specular sweep — sparse, not noisy */}
            {!reduce ? (
              <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
                <div className="absolute inset-y-0 w-1/3 animate-light-sweep bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              </div>
            ) : null}

            <div className="relative flex items-center justify-between border-b border-white/[0.06] bg-gradient-to-r from-white/[0.03] to-transparent px-5 py-3.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/75" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/75" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/75" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                Cuisine · LIGNE
              </p>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                <span className="h-1.5 w-1.5 animate-live-dot rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            <div className="space-y-2.5 p-4">
              <OrderCard
                id="AST-2847"
                status="Nouvelle"
                tone="accent"
                items={["2× Menu Classique", "1× Frites XL"]}
                time="14:32"
                highlight
                delay={reduce ? 0 : 0.95}
              />
              <OrderCard
                id="AST-2846"
                status="En prep"
                tone="blue"
                items={["1× Assiette Mixte"]}
                time="14:28"
                delay={reduce ? 0 : 1.1}
              />
              <OrderCard
                id="AST-2845"
                status="Prete"
                tone="emerald"
                items={["3× Sandwich"]}
                time="14:25"
                muted
                delay={reduce ? 0 : 1.25}
              />
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.06] bg-black/50 px-5 py-3.5">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                  Aujourd&apos;hui
                </p>
                <p className="text-xs text-zinc-400">18 commandes</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">CA tel</p>
                <p className="font-display text-lg font-bold text-astor-accent">
                  1 247 €
                </p>
              </div>
            </div>
          </div>

          {/* Toast confirmation */}
          <motion.div
            className="absolute -right-2 -top-3 z-40 sm:-right-4 sm:-top-4"
            initial={reduce ? false : { opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : 2.05, duration: 0.48, ease }}
          >
            <div className="rounded-xl border border-emerald-400/25 bg-[#0c1210]/95 px-3 py-2 shadow-lg backdrop-blur-xl">
              <p className="text-[10px] font-semibold text-emerald-300">Commande envoyée</p>
              <p className="text-[11px] text-zinc-400">Cuisine notifiée · SMS client</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function CallTimer({ reduce }: { reduce: boolean }) {
  return (
    <motion.p
      className="font-mono text-[11px] text-zinc-500"
      animate={reduce ? undefined : { opacity: [0.55, 1, 0.55] }}
      transition={reduce ? undefined : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    >
      00:42
    </motion.p>
  );
}

function MiniWave() {
  const reduce = useReducedMotion();
  const bars = [0.35, 0.55, 0.9, 0.5, 1, 0.65, 0.8, 0.4, 0.7, 0.95, 0.45, 0.6];

  return (
    <div className="flex h-6 items-end justify-center gap-[3px]" aria-hidden>
      {bars.map((peak, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-astor-accent/40 to-astor-accent-bright"
          style={{ originY: 1 }}
          animate={
            reduce
              ? { scaleY: peak }
              : { scaleY: [peak * 0.35, peak, peak * 0.45, peak * 0.85] }
          }
          transition={{
            duration: 0.9 + (i % 4) * 0.08,
            repeat: reduce ? 0 : Infinity,
            ease: [0.77, 0, 0.175, 1],
            delay: reduce ? 0 : i * 0.04,
          }}
          initial={{ scaleY: 0.3 }}
        />
      ))}
    </div>
  );
}

function OrderCard({
  id,
  status,
  tone,
  items,
  time,
  highlight,
  muted,
  delay,
}: {
  id: string;
  status: string;
  tone: "accent" | "blue" | "emerald";
  items: string[];
  time: string;
  highlight?: boolean;
  muted?: boolean;
  delay: number;
}) {
  const colors = {
    accent: "bg-astor-accent/20 text-astor-accent",
    blue: "bg-stone-500/10 text-stone-400",
    emerald: "bg-emerald-500/15 text-emerald-300",
  };

  return (
    <motion.div
      className={`rounded-xl border p-3.5 ${
        highlight
          ? "border-astor-accent/35 bg-astor-accent/[0.07] shadow-[0_0_24px_-8px_rgba(22,22,21,0.12)]"
          : "border-white/[0.06] bg-white/[0.02]"
      } ${muted ? "opacity-45" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: muted ? 0.45 : 1, y: 0 }}
      transition={{ delay, duration: 0.48, ease }}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] text-zinc-500">{id}</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${colors[tone]}`}>
          {status}
        </span>
      </div>
      <ul className="mt-2 space-y-0.5 text-[13px] text-zinc-200">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-2 font-mono text-[10px] text-zinc-600">{time}</p>
    </motion.div>
  );
}
