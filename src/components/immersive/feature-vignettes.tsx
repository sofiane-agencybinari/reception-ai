"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

import { EASE } from "./reveal";

/*
 * Mini-démonstrations animées, une par capacité.
 * Chaque vignette rejoue sa séquence à chaque montage (changement de capacité).
 */

const ink = "#1a1816";
const cherry = "#5c2a36";

const appear = (delay: number) => ({
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.6, delay, ease: EASE },
});

function Bubble({ from, children, delay }: { from: "client" | "astor"; children: ReactNode; delay: number }) {
  return (
    <motion.div
      {...appear(delay)}
      className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${
        from === "astor" ? "self-start rounded-bl-md bg-[#1a1816] text-[#f2efe8]" : "self-end rounded-br-md bg-white text-[#1a1816] shadow-[0_1px_0_rgba(26,24,22,0.06)]"
      }`}
    >
      {children}
    </motion.div>
  );
}

function Chip({ children, delay, tone = "light" }: { children: ReactNode; delay: number; tone?: "light" | "cherry" }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] ${
        tone === "cherry" ? "bg-[#5c2a36] text-[#f2efe8]" : "border border-[#1a1816]/10 bg-white text-[#1a1816]"
      }`}
    >
      {children}
    </motion.span>
  );
}

function Wave({ active = true }: { active?: boolean }) {
  return (
    <span className="lx-wave flex h-3.5 items-center gap-[2px]" style={{ color: active ? cherry : "#1a181633" }} aria-hidden>
      {[0.5, 0.9, 0.6, 1, 0.4, 0.8, 0.55, 0.9].map((h, i) => (
        <span key={i} style={{ height: `${h * 100}%`, animationDelay: `${i * -0.13}s`, animationPlayState: active ? "running" : "paused" }} />
      ))}
    </span>
  );
}

const Row = ({ children, delay, className = "" }: { children: ReactNode; delay: number; className?: string }) => (
  <motion.div {...appear(delay)} className={`flex items-center justify-between rounded-xl border border-[#1a1816]/[0.07] bg-white px-3.5 py-2.5 text-[13px] ${className}`}>
    {children}
  </motion.div>
);

/* ─── Téléphone ─── */

function Understands() {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <Bubble from="client" delay={0.1}>
        Bonjour, je voudrais un tacos M au poulet, sauce algérienne, sans oignon s’il vous plaît.
      </Bubble>
      <motion.div {...appear(0.8)} className="flex items-center gap-2 self-start text-[11px] text-[#8a8175]">
        <Wave /> compris
      </motion.div>
      <div className="flex flex-wrap gap-1.5">
        <Chip delay={1.1}>Tacos M</Chip>
        <Chip delay={1.25}>Poulet</Chip>
        <Chip delay={1.4}>Sauce algérienne</Chip>
        <Chip delay={1.55} tone="cherry">
          Sans oignon
        </Chip>
      </div>
    </div>
  );
}

function ManyLines() {
  const lines = ["06 12 •• •• 78", "07 88 •• •• 44", "06 45 •• •• 33", "06 77 •• •• 10"];
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {lines.map((n, i) => (
        <motion.div
          key={n}
          initial={{ backgroundColor: "#ffffff" }}
          animate={{ backgroundColor: ["#ffffff", "#ffffff", "#f6eef0"] }}
          transition={{ duration: 0.9, delay: 0.4 + i * 0.45, times: [0, 0.4, 1] }}
          className="flex items-center justify-between rounded-xl border border-[#1a1816]/[0.07] px-3.5 py-2.5 text-[13px]"
        >
          <span className="font-[family-name:var(--font-geist-mono)] tabular-nums">{n}</span>
          <motion.span
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.45 }}
            className="flex items-center gap-2 text-[12px] text-[#8a8175]"
          >
            <Wave /> en ligne
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

function Upsell() {
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <Row delay={0.1}>
        <span>2× Tacos M</span>
        <span className="tabular-nums">16,00 €</span>
      </Row>
      <Bubble from="astor" delay={0.7}>
        Souhaitez-vous une boisson ? Le Coca est à 1,50 €.
      </Bubble>
      <Bubble from="client" delay={1.4}>
        Oui, deux s’il vous plaît.
      </Bubble>
      <Row delay={2} className="border-[#5c2a36]/30">
        <span>
          2× Coca <span className="ml-1 text-[11px] text-[#5c2a36]">suggéré</span>
        </span>
        <span className="tabular-nums">3,00 €</span>
      </Row>
      <motion.p {...appear(2.4)} className="mt-1 text-right font-serif text-lg tabular-nums">
        19,00 €
      </motion.p>
    </div>
  );
}

function Handoff() {
  return (
    <div className="flex h-full items-center justify-center gap-4">
      <motion.div {...appear(0.1)} className="rounded-2xl border border-[#1a1816]/[0.07] bg-white p-4 text-[13px]">
        <p className="text-[11px] text-[#8a8175]">Demande hors standard</p>
        <p className="mt-1">« J’aimerais réserver pour un groupe de 30. »</p>
      </motion.div>
      <svg width="64" height="12" viewBox="0 0 64 12" aria-hidden>
        <motion.path
          d="M0 6 H58 M52 1 L58 6 L52 11"
          fill="none"
          stroke={ink}
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
        />
      </svg>
      <motion.div {...appear(1.3)} className="relative grid h-16 w-16 place-items-center rounded-full bg-[#1a1816] text-[13px] text-[#f2efe8]">
        <span className="lx-ring absolute inset-0 rounded-full border border-[#5c2a36]" />
        Karim
      </motion.div>
    </div>
  );
}

/* ─── Opérations ─── */

function MenuImport() {
  const items = ["Tacos M — 8,00 €", "Kebab frites — 9,50 €", "Margherita — 9,00 €", "Coca 33cl — 1,50 €"];
  return (
    <div className="flex h-full items-center gap-5">
      <motion.div {...appear(0.1)} className="relative h-36 w-28 shrink-0 overflow-hidden rounded-lg border border-[#1a1816]/10 bg-white p-3">
        <p className="text-[10px] font-semibold">MENU.pdf</p>
        {[...Array(7)].map((_, i) => (
          <span key={i} className="mt-2 block h-1 rounded bg-[#1a1816]/10" style={{ width: `${55 + ((i * 23) % 40)}%` }} />
        ))}
        <motion.span
          className="absolute inset-x-0 h-6 bg-gradient-to-b from-transparent via-[#5c2a36]/20 to-transparent"
          initial={{ top: "-20%" }}
          animate={{ top: "110%" }}
          transition={{ duration: 1.4, delay: 0.5, ease: "easeInOut" }}
        />
      </motion.div>
      <div className="flex flex-1 flex-col gap-1.5">
        {items.map((t, i) => (
          <Row key={t} delay={1.2 + i * 0.18}>
            <span>{t.split(" — ")[0]}</span>
            <span className="tabular-nums text-[#8a8175]">{t.split(" — ")[1]}</span>
          </Row>
        ))}
      </div>
    </div>
  );
}

function PosSync() {
  return (
    <div className="flex h-full items-center justify-between px-2">
      {["Ligne", "Caisse"].map((n, i) => (
        <motion.div key={n} {...appear(0.1 + i * 0.15)} className="z-10 grid h-20 w-20 place-items-center rounded-2xl border border-[#1a1816]/10 bg-white text-[13px]">
          {n}
        </motion.div>
      ))}
      <div className="absolute left-1/2 top-1/2 h-px w-[46%] -translate-x-1/2 bg-[#1a1816]/10">
        {[0, 1, 2].map((k) => (
          <motion.span
            key={k}
            className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-[#5c2a36]"
            initial={{ left: "0%", opacity: 0 }}
            animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.6, delay: 0.6 + k * 0.5, repeat: Infinity, repeatDelay: 0.4, ease: "easeInOut" }}
          />
        ))}
      </div>
      <motion.p {...appear(1)} className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-[#8a8175]">
        Menu, prix et stocks synchronisés
      </motion.p>
    </div>
  );
}

function Sms() {
  return (
    <div className="flex h-full items-center justify-center">
      <motion.div {...appear(0.1)} className="w-48 rounded-[28px] border border-[#1a1816]/10 bg-[#1a1816] p-3 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -14, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
          className="rounded-2xl bg-white/10 p-3 text-[11px] leading-snug text-[#f2efe8]"
        >
          <p className="mb-1 text-[10px] text-[#f2efe8]/50">SMS · Le Palmier</p>
          Commande AST-2849 confirmée : 19 €, prête à 21h15. Merci !
        </motion.div>
        <div className="h-24" />
      </motion.div>
    </div>
  );
}

function Setup() {
  const steps = ["Menu importé", "Numéro branché", "Agent configuré", "Écran cuisine installé"];
  return (
    <div className="flex h-full items-center gap-6">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r="44" fill="none" stroke="#1a1816" strokeOpacity="0.08" strokeWidth="3" />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={cherry}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, delay: 0.3, ease: "easeInOut" }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-serif text-xl">24 h</span>
      </div>
      <ul className="flex-1 space-y-2">
        {steps.map((s, i) => (
          <motion.li key={s} {...appear(0.4 + i * 0.45)} className="flex items-center gap-2.5 text-[13px]">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-[#5c2a36] text-[9px] text-[#f2efe8]">✓</span>
            {s}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Pilotage ─── */

function Sales() {
  const bars = [32, 48, 41, 66, 58, 92, 74];
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex items-end justify-between">
        <motion.p {...appear(0.1)} className="font-serif text-2xl tabular-nums">
          1 247 €
        </motion.p>
        <Chip delay={1.4}>Export CSV ↓</Chip>
      </div>
      <p className="text-[11px] text-[#8a8175]">aujourd’hui · 18 commandes</p>
      <div className="mt-5 flex h-28 items-end gap-2">
        {bars.map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <motion.span
              className="w-full rounded-t-md"
              style={{ backgroundColor: i === 5 ? cherry : "#1a18161f" }}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: EASE }}
            />
            <span className="text-[10px] text-[#8a8175]">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Customers() {
  const rows = [
    ["Camille R.", "12 commandes", "Sans oignon"],
    ["Yanis B.", "8 commandes", "Fidèle"],
    ["Sophie M.", "5 commandes", "Végé"],
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {rows.map(([n, c, t], i) => (
        <Row key={n} delay={0.15 + i * 0.2}>
          <span className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ebe6de] text-[11px]">{n[0]}</span>
            {n}
          </span>
          <span className="flex items-center gap-2 text-[12px] text-[#8a8175]">
            {c} <Chip delay={0.6 + i * 0.2}>{t}</Chip>
          </span>
        </Row>
      ))}
    </div>
  );
}

function MultiSites() {
  const sites = [
    ["Lyon 7e", 42],
    ["Villeurbanne", 31],
    ["Vénissieux", 27],
  ] as const;
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      {sites.map(([n, v], i) => (
        <motion.div key={n} {...appear(0.15 + i * 0.15)}>
          <div className="flex justify-between text-[13px]">
            <span>{n}</span>
            <span className="tabular-nums text-[#8a8175]">{v} appels</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#1a1816]/[0.07]">
            <motion.div
              className="h-full rounded-full bg-[#5c2a36]"
              initial={{ width: 0 }}
              animate={{ width: `${(v / 42) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: EASE }}
            />
          </div>
        </motion.div>
      ))}
      <motion.p {...appear(1.1)} className="text-[11px] text-[#8a8175]">
        Un tableau de bord, un agent par adresse.
      </motion.p>
    </div>
  );
}

function France() {
  return (
    <div className="flex h-full items-center gap-6">
      <svg viewBox="0 0 48 56" className="h-24 w-20 shrink-0" aria-hidden>
        <motion.path
          d="M24 2 L44 10 V26 C44 40 35 50 24 54 C13 50 4 40 4 26 V10 Z"
          fill="none"
          stroke={cherry}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        <motion.path
          d="M16 28 L22 34 L33 22"
          fill="none"
          stroke={ink}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        />
      </svg>
      <ul className="space-y-2 text-[13px]">
        {["Données hébergées en UE", "Conforme RGPD", "Support en français"].map((t, i) => (
          <motion.li key={t} {...appear(0.5 + i * 0.25)}>
            {t}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export const VIGNETTES: Record<string, () => ReactNode> = {
  "Comprend vos clients": Understands,
  "Plusieurs lignes": ManyLines,
  "Suggestions panier": Upsell,
  "Relais humain": Handoff,
  "Import de carte": MenuImport,
  "Lien caisse": PosSync,
  "SMS confirmation": Sms,
  "Installé en 24 h": Setup,
  "Ventes & compta": Sales,
  "Base clients": Customers,
  "Multi-sites": MultiSites,
  "Hébergé en France": France,
};
