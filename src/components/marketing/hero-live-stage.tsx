"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export function HeroWaveform({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const bars = [0.35, 0.55, 0.85, 1, 0.7, 0.95, 0.6, 0.8, 0.45, 0.75, 0.9, 0.5, 0.65, 0.4];

  return (
    <div className={`flex h-16 items-end justify-center gap-1.5 ${className}`} aria-hidden>
      {bars.map((peak, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-astor-accent to-astor-accent-bright sm:w-2"
          style={{ originY: 1 }}
          animate={
            reduce
              ? { scaleY: peak }
              : { scaleY: [peak * 0.35, peak, peak * 0.45, peak * 0.9, peak * 0.4] }
          }
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: 1.1 + (i % 5) * 0.12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.05,
                }
          }
          initial={{ scaleY: peak * 0.3 }}
        />
      ))}
    </div>
  );
}

export function HeroPulseRings() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-astor-accent/25"
          style={{ width: 120 + i * 90, height: 120 + i * 90 }}
          animate={
            reduce
              ? { opacity: 0.2 }
              : { scale: [1, 1.08, 1], opacity: [0.35, 0.08, 0.35] }
          }
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.45,
          }}
        />
      ))}
      <motion.div
        className="absolute h-28 w-28 rounded-full bg-astor-accent/20 blur-2xl"
        animate={reduce ? {} : { scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

const TICKETS = [
  { id: "AST-2847", label: "2× Menu Classique", status: "Nouvelle", x: "-38%", y: "-30%" },
  { id: "AST-2846", label: "Assiette Mixte", status: "En prep", x: "34%", y: "-22%" },
  { id: "AST-2845", label: "3× Sandwich", status: "Prete", x: "-30%", y: "34%" },
] as const;

export function HeroOrbitTickets() {
  const reduce = useReducedMotion();

  return (
    <>
      {TICKETS.map((ticket, i) => (
        <motion.div
          key={ticket.id}
          className="absolute z-20 hidden rounded-xl border border-white/10 bg-[#0a0d11]/90 px-3 py-2 shadow-xl backdrop-blur-md sm:block"
          style={{ left: `calc(50% + ${ticket.x})`, top: `calc(50% + ${ticket.y})` }}
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={
            reduce
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 1, scale: 1, y: [0, -8, 0] }
          }
          transition={{
            opacity: { delay: 1.55 + i * 0.18, duration: 0.5 },
            scale: { delay: 1.55 + i * 0.18, duration: 0.5 },
            y: {
              delay: 2 + i * 0.15,
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <p className="font-mono text-[9px] text-zinc-500">{ticket.id}</p>
          </div>
          <p className="mt-1 text-xs font-medium text-white">{ticket.label}</p>
          <p className="text-[10px] text-astor-accent-bright">{ticket.status}</p>
        </motion.div>
      ))}
    </>
  );
}

export function HeroCallCore() {
  const reduce = useReducedMotion();
  const [sec, setSec] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [reduce]);

  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");

  return (
    <div className="relative z-10 flex flex-col items-center">
      {!reduce
        ? Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 150 + (i % 3) * 28;
            return (
              <motion.span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-astor-accent-bright/70"
                style={{
                  left: "50%",
                  top: "42%",
                }}
                animate={{
                  x: [
                    Math.cos(angle) * radius,
                    Math.cos(angle + 0.8) * (radius + 12),
                    Math.cos(angle) * radius,
                  ],
                  y: [
                    Math.sin(angle) * radius,
                    Math.sin(angle + 0.8) * (radius + 12),
                    Math.sin(angle) * radius,
                  ],
                  opacity: [0.2, 0.9, 0.2],
                }}
                transition={{
                  duration: 5 + (i % 4),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15,
                }}
              />
            );
          })
        : null}

      <motion.div
        className="relative flex h-36 w-36 items-center justify-center rounded-full border border-astor-accent/40 bg-gradient-to-br from-astor-accent/30 via-[#0c1514] to-astor-surface shadow-[0_0_60px_-10px_rgba(61,155,143,0.7)] sm:h-44 sm:w-44"
        animate={reduce ? {} : { rotate: [0, 2, -2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-3 rounded-full border border-white/5" />
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-astor-accent-bright">
            En direct
          </p>
          <p className="font-display mt-1 text-lg font-bold text-white sm:text-xl">ASTOR</p>
          <p className="mt-1 font-mono text-xs text-zinc-400">
            {mm}:{ss}
          </p>
        </div>
      </motion.div>

      <div className="mt-6 w-full max-w-[220px]">
        <HeroWaveform />
      </div>

      <motion.p
        className="mt-4 max-w-[260px] text-center text-xs leading-relaxed text-zinc-400"
        animate={reduce ? {} : { opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity }}
      >
        « Un menu classique, avec frites et Coca… »
      </motion.p>
    </div>
  );
}
