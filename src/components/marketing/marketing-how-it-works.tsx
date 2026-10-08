"use client";

import { Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { STEPS } from "@/components/marketing/marketing-data";
import { Reveal, RevealItem, RevealStagger } from "@/components/marketing/reveal";
import { GlowCard } from "@/components/ui/glow-card";
import { SectionHeader } from "@/components/ui/section-header";

const ease = [0.23, 1, 0.32, 1] as const;

export function MarketingHowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section id="comment" className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <Reveal>
        <SectionHeader
          label="En trois étapes"
          title="Comment ça marche ?"
          description="De l'appel entrant au bon en cuisine — sans raccrocher, sans post-it."
        />
      </Reveal>

      <div className="mt-16 space-y-20 lg:space-y-24">
        {STEPS.map((step, index) => (
          <motion.article
            key={step.num}
            className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
              index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
            }`}
            initial={reduce ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.7, ease }}
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-astor-accent/30 bg-astor-accent/10 font-mono text-xs font-semibold text-astor-accent-bright">
                  {step.num}
                </span>
                <p className="text-xs font-semibold uppercase tracking-wider text-astor-warm">
                  {step.subtitle}
                </p>
              </div>
              <h3 className="mt-4 text-2xl font-bold text-zinc-900 sm:text-3xl">{step.title}</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-600">{step.text}</p>
              <RevealStagger className="mt-6 flex flex-wrap gap-2" delay={0.08}>
                {step.tags.map((tag) => (
                  <RevealItem key={tag}>
                    <span className="inline-block rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600">
                      {tag}
                    </span>
                  </RevealItem>
                ))}
              </RevealStagger>
            </div>
            <StepVisual type={step.visual} />
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function StepVisual({ type }: { type: "calls" | "chat" | "order" }) {
  const reduce = useReducedMotion();

  if (type === "calls") {
    const calls = [
      { phone: "06 12 34 56 78", label: "Client régulier", active: true },
      { phone: "06 98 76 54 32", label: "Nouveau client", active: true },
      { phone: "04 67 89 01 23", label: "En cours", active: true },
    ];

    return (
      <GlowCard glow="accent">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Appels entrants
        </p>
        <div className="mt-4 space-y-3">
          {calls.map((call, i) => (
            <motion.div
              key={call.phone}
              className="flex items-center justify-between rounded-xl border border-white/6 bg-white px-4 py-3"
              initial={reduce ? false : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ delay: 0.12 + i * 0.1, duration: 0.45, ease }}
            >
              <div>
                <p className="text-sm font-medium text-zinc-900">{call.phone}</p>
                <p className="text-xs text-zinc-500">{call.label}</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 animate-live-dot rounded-full bg-emerald-400" />
                Live
              </span>
            </motion.div>
          ))}
        </div>
        <motion.p
          className="mt-4 text-center text-xs text-astor-accent-soft"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.4, ease }}
        >
          LIGNE gère tout simultanément
        </motion.p>
      </GlowCard>
    );
  }

  if (type === "chat") {
    const bubbles = [
      { from: "ai" as const, text: "Bonjour ! LIGNE à votre service, que puis-je vous préparer ?" },
      {
        from: "client" as const,
        text: "Un menu classique avec supplément fromage s'il vous plaît.",
      },
      {
        from: "ai" as const,
        text: "Parfait ! Souhaitez-vous ajouter une boisson ou un dessert ?",
      },
    ];

    return (
      <GlowCard glow="warm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-astor-accent/20 text-xs font-bold text-astor-accent-bright">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900">LIGNE</p>
            <p className="text-[10px] text-emerald-400">En écoute</p>
          </div>
        </div>
        <div className="space-y-3">
          {bubbles.map((b, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 10, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ delay: 0.1 + i * 0.14, duration: 0.42, ease }}
            >
              <Bubble from={b.from} text={b.text} />
            </motion.div>
          ))}
        </div>
      </GlowCard>
    );
  }

  return (
    <GlowCard glow="accent" padding={false} className="overflow-hidden">
      <motion.div
        className="border-b border-white/6 bg-astor-accent/10 px-5 py-3"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease }}
      >
        <p className="font-mono text-xs text-astor-accent-bright">COMMANDE #2847</p>
        <p className="text-[10px] text-zinc-500">Pour 14:45 — Tél: 06 12 34 56 78</p>
      </motion.div>
      <ul className="divide-y divide-white/5 px-5 py-2">
        {[
          { name: "Menu Classique", price: "9,50 €", note: "Supplément fromage" },
          { name: "Accompagnement", price: "3,00 €" },
          { name: "Coca-Cola", price: "2,50 €" },
        ].map((line, i) => (
          <motion.li
            key={line.name}
            initial={reduce ? false : { opacity: 0, x: 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 + i * 0.08, duration: 0.4, ease }}
          >
            <OrderLine name={line.name} price={line.price} note={line.note} />
          </motion.li>
        ))}
      </ul>
      <motion.div
        className="flex items-center justify-between border-t border-white/6 bg-black/30 px-5 py-4"
        initial={reduce ? false : { opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.4, ease }}
      >
        <span className="text-sm font-semibold text-zinc-900">TOTAL</span>
        <span className="text-lg font-bold text-astor-accent-soft">15,00 €</span>
      </motion.div>
      <motion.div
        className="flex items-center gap-2 border-t border-white/6 px-5 py-3 text-xs text-emerald-400"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.52, duration: 0.35, ease }}
      >
        <Phone className="h-3.5 w-3.5" />
        SMS confirmation envoyé
      </motion.div>
    </GlowCard>
  );
}

function Bubble({ from, text }: { from: "ai" | "client"; text: string }) {
  const isAi = from === "ai";
  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
      <p
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isAi
            ? "rounded-tl-sm bg-white/[0.06] text-zinc-700"
            : "rounded-tr-sm bg-astor-accent/20 text-stone-50"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

function OrderLine({
  name,
  price,
  note,
}: {
  name: string;
  price: string;
  note?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm text-zinc-700">1x {name}</p>
        {note ? <p className="text-xs text-zinc-500">→ {note}</p> : null}
      </div>
      <span className="shrink-0 font-mono text-sm text-zinc-600">{price}</span>
    </div>
  );
}
