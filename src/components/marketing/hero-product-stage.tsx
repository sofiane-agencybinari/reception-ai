"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

const TRANSCRIPT = [
  { who: "astor" as const, text: "Bonsoir, ASTOR pour Le Palmier — je vous écoute." },
  { who: "client" as const, text: "Un menu classique, avec frites et Coca." },
  { who: "astor" as const, text: "Parfait. Pour 14h45, emporter ?" },
  { who: "client" as const, text: "Oui, c'est bon." },
];

/**
 * Dual composition: live call transcript + kitchen screen.
 * Premium depth, no orbit gimmicks.
 */
export function HeroProductStage() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
      {/* Glow bed */}
      <div className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(61,155,143,0.25),transparent_65%)] blur-2xl" />

      <div className="relative grid gap-4 sm:grid-cols-[0.85fr_1.15fr] sm:items-end">
        {/* Call panel */}
        <motion.div
          className="relative z-20 order-2 sm:order-1 sm:mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.05, duration: 0.7, ease }}
        >
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0e12]/80 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <p className="text-[11px] font-semibold text-white">Appel en cours</p>
              </div>
              <CallTimer />
            </div>

            <div className="space-y-3 px-4 py-4">
              {TRANSCRIPT.map((line, i) => (
                <motion.div
                  key={i}
                  className={`flex ${line.who === "client" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.35 + i * 0.35, duration: 0.45, ease }}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed ${
                      line.who === "astor"
                        ? "rounded-tl-md bg-astor-accent/15 text-astor-accent-bright"
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

        {/* Kitchen panel — slight 3D tilt */}
        <motion.div
          className="relative z-10 order-1 sm:order-2"
          animate={reduce ? {} : { y: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            className="overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-[#080b0f] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95),0_0_0_1px_rgba(61,155,143,0.15)]"
            initial={{ rotateY: -6, rotateX: 4 }}
            animate={{ rotateY: reduce ? 0 : [-2, 2, -2], rotateX: reduce ? 0 : [2, 0, 2] }}
            transition={{
              rotateY: { duration: 10, repeat: Infinity, ease: "easeInOut" },
              rotateX: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            {/* Specular sweep */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
              animate={reduce ? {} : { x: ["-120%", "140%"] }}
              transition={{ duration: 3.8, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            />

            <div className="relative flex items-center justify-between border-b border-white/[0.06] bg-gradient-to-r from-white/[0.03] to-transparent px-5 py-3.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/75" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/75" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/75" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                Cuisine · ASTOR
              </p>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
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
                delay={1.15}
              />
              <OrderCard
                id="AST-2846"
                status="En prep"
                tone="blue"
                items={["1× Assiette Mixte"]}
                time="14:28"
                delay={1.3}
              />
              <OrderCard
                id="AST-2845"
                status="Prete"
                tone="emerald"
                items={["3× Sandwich"]}
                time="14:25"
                muted
                delay={1.45}
              />
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.06] bg-black/50 px-5 py-3.5">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">Aujourd&apos;hui</p>
                <p className="text-xs text-zinc-400">18 commandes</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">CA tel</p>
                <p className="font-display text-lg font-bold text-astor-accent-bright">1 247 €</p>
              </div>
            </div>
          </motion.div>

          {/* Toast */}
          <motion.div
            className="absolute -right-2 -top-3 z-40 sm:-right-4 sm:-top-4"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.5, ease }}
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

function CallTimer() {
  return (
    <motion.p
      className="font-mono text-[11px] text-zinc-500"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
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
            reduce ? { scaleY: peak } : { scaleY: [peak * 0.3, peak, peak * 0.4, peak * 0.85] }
          }
          transition={{
            duration: 0.85 + (i % 4) * 0.1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
          initial={{ scaleY: 0.25 }}
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
    accent: "bg-astor-accent/20 text-astor-accent-bright",
    blue: "bg-sky-500/15 text-sky-300",
    emerald: "bg-emerald-500/15 text-emerald-300",
  };

  return (
    <motion.div
      className={`rounded-xl border p-3.5 ${
        highlight
          ? "border-astor-accent/35 bg-astor-accent/[0.07] shadow-[0_0_24px_-8px_rgba(61,155,143,0.45)]"
          : "border-white/[0.06] bg-white/[0.02]"
      } ${muted ? "opacity-45" : ""}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: muted ? 0.45 : 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease }}
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
