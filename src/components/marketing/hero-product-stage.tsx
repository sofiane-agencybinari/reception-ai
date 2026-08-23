"use client";

import { motion, useReducedMotion } from "motion/react";

import { GlowCard } from "@/components/ui/glow-card";

/**
 * Product-focused hero stage: kitchen screen + live call chip.
 * Soft continuous motion — no orbit / particle gimmicks.
 */
export function HeroProductStage() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
      <div className="absolute -inset-8 rounded-[2rem] bg-[radial-gradient(circle_at_40%_30%,rgba(61,155,143,0.28),transparent_60%)] blur-2xl" />

      {/* Live call chip — slides in, gentle float */}
      <motion.div
        className="absolute -left-2 bottom-8 z-20 sm:-left-5"
        initial={{ opacity: 0, x: -16, y: 8 }}
        animate={{ opacity: 1, x: 0, y: reduce ? 0 : [0, -5, 0] }}
        transition={{
          opacity: { delay: 1.25, duration: 0.55 },
          x: { delay: 1.25, duration: 0.55 },
          y: { delay: 1.8, duration: 4.5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <GlowCard glow="warm" padding={false} className="rounded-2xl shadow-xl">
          <div className="rounded-[calc(1rem-1px)] bg-[#0a0d11]/95 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Appel entrant</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-55" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <div>
                <p className="text-sm font-medium text-white">IA decroche…</p>
                <MiniWave className="mt-1.5" />
              </div>
            </div>
          </div>
        </GlowCard>
      </motion.div>

      {/* Live order toast */}
      <motion.div
        className="absolute -right-1 top-6 z-20 hidden sm:block"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: reduce ? 0 : [0, 4, 0] }}
        transition={{
          opacity: { delay: 1.45, duration: 0.5 },
          y: { delay: 2, duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3.5 py-2.5 backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300/85">
            Live
          </p>
          <p className="mt-0.5 text-sm font-medium text-white">+1 commande · 14:32</p>
        </div>
      </motion.div>

      <motion.div
        animate={reduce ? {} : { y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <GlowCard
          glow="accent"
          padding={false}
          className="relative rounded-[1.25rem] shadow-[0_28px_70px_-24px_rgba(0,0,0,0.85)]"
        >
          <div className="overflow-hidden rounded-[calc(1.25rem-1px)] bg-[#090c10]/96">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Ecran cuisine
              </p>
              <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 animate-live-dot rounded-full bg-emerald-400" />
                En ligne
              </span>
            </div>

            <div className="space-y-2.5 p-4">
              <OrderRow
                id="AST-2847"
                status="Nouvelle"
                tone="accent"
                items={["2x Menu Classique", "1x Frites XL"]}
                time="14:32"
                highlight
                delay={1.1}
              />
              <OrderRow
                id="AST-2846"
                status="En prep"
                tone="blue"
                items={["1x Assiette Mixte"]}
                time="14:28"
                delay={1.25}
              />
              <OrderRow
                id="AST-2845"
                status="Prete"
                tone="emerald"
                items={["3x Sandwich"]}
                time="14:25"
                muted
                delay={1.4}
              />
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.06] bg-black/40 px-5 py-3">
              <p className="text-xs text-zinc-500">18 commandes · aujourd&apos;hui</p>
              <p className="font-mono text-sm font-semibold text-astor-accent-bright">1 247 €</p>
            </div>
          </div>
        </GlowCard>
      </motion.div>
    </div>
  );
}

function MiniWave({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const bars = [0.4, 0.7, 1, 0.55, 0.85, 0.45, 0.75];

  return (
    <div className={`flex h-3 items-end gap-0.5 ${className}`} aria-hidden>
      {bars.map((peak, i) => (
        <motion.span
          key={i}
          className="w-0.5 rounded-full bg-astor-accent-bright"
          style={{ originY: 1 }}
          animate={
            reduce ? { scaleY: peak } : { scaleY: [peak * 0.35, peak, peak * 0.4, peak * 0.85] }
          }
          transition={{
            duration: 0.9 + i * 0.08,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.06,
          }}
          initial={{ scaleY: 0.3 }}
        />
      ))}
    </div>
  );
}

function OrderRow({
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
    blue: "bg-sky-500/20 text-sky-300",
    emerald: "bg-emerald-500/20 text-emerald-300",
  };

  return (
    <motion.div
      className={`rounded-xl border border-white/[0.06] bg-white/[0.025] p-3.5 ${
        muted ? "opacity-50" : ""
      } ${highlight ? "animate-new-order border-astor-accent/30" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-zinc-400">{id}</p>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${colors[tone]}`}>
          {status}
        </span>
      </div>
      <ul className="mt-2 space-y-0.5 text-sm text-zinc-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-2 font-mono text-[10px] text-zinc-600">{time}</p>
    </motion.div>
  );
}
