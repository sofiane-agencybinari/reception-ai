"use client";

import { Phone } from "lucide-react";
import { motion } from "motion/react";

import { STEPS } from "@/components/marketing/marketing-data";
import { Reveal } from "@/components/marketing/reveal";
import { GlowCard } from "@/components/ui/glow-card";
import { SectionHeader } from "@/components/ui/section-header";

export function MarketingHowItWorks() {
  return (
    <section id="comment" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <SectionHeader
          label="Simple comme bonjour"
          title="Comment ça marche ?"
          description="De l'appel entrant au bon en cuisine — en trois étapes automatisées."
        />
      </Reveal>

      <div className="mt-16 space-y-16">
        {STEPS.map((step, index) => (
          <motion.article
            key={step.num}
            className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-14 ${
              index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
            }`}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="font-mono text-sm text-astor-accent">{step.num}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-astor-warm">
                {step.subtitle}
              </p>
              <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{step.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">{step.text}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {step.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <StepVisual type={step.visual} />
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function StepVisual({ type }: { type: "calls" | "chat" | "order" }) {
  if (type === "calls") {
    return (
      <GlowCard glow="accent">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Appels entrants
        </p>
        <div className="mt-4 space-y-3">
          {[
            { phone: "06 12 34 56 78", label: "Client regulier", active: true },
            { phone: "06 98 76 54 32", label: "Nouveau client", active: true },
            { phone: "04 67 89 01 23", label: "En cours", active: true },
          ].map((call) => (
            <div
              key={call.phone}
              className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-white">{call.phone}</p>
                <p className="text-xs text-zinc-500">{call.label}</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-astor-accent-soft">
          ASTOR gere tout simultanement
        </p>
      </GlowCard>
    );
  }

  if (type === "chat") {
    return (
      <GlowCard glow="warm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-astor-accent/20 text-xs font-bold text-astor-accent-bright">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-white">ASTOR IA</p>
            <p className="text-[10px] text-emerald-400">En ecoute</p>
          </div>
        </div>
        <div className="space-y-3">
          <Bubble from="ai" text="Bonjour ! ASTOR a votre service, que puis-je vous preparer ?" />
          <Bubble
            from="client"
            text="Un menu classique avec supplement fromage s'il vous plait."
          />
          <Bubble from="ai" text="Parfait ! Souhaitez-vous ajouter une boisson ou un dessert ?" />
        </div>
      </GlowCard>
    );
  }

  return (
    <GlowCard glow="accent" padding={false} className="overflow-hidden">
      <div className="border-b border-white/6 bg-astor-accent/10 px-5 py-3">
        <p className="font-mono text-xs text-astor-accent-bright">COMMANDE #2847</p>
        <p className="text-[10px] text-zinc-500">Pour 14:45 — Tel: 06 12 34 56 78</p>
      </div>
      <ul className="divide-y divide-white/5 px-5 py-2">
        <OrderLine name="Menu Classique" price="9,50 €" note="Supplement fromage" />
        <OrderLine name="Accompagnement" price="3,00 €" />
        <OrderLine name="Coca-Cola" price="2,50 €" />
      </ul>
      <div className="flex items-center justify-between border-t border-white/6 bg-black/30 px-5 py-4">
        <span className="text-sm font-semibold text-white">TOTAL</span>
        <span className="text-lg font-bold text-astor-accent-soft">15,00 €</span>
      </div>
      <div className="flex items-center gap-2 border-t border-white/6 px-5 py-3 text-xs text-emerald-400">
        <Phone className="h-3.5 w-3.5" />
        SMS confirmation envoye
      </div>
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
            ? "rounded-tl-sm bg-white/[0.06] text-zinc-200"
            : "rounded-tr-sm bg-astor-accent/20 text-teal-50"
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
    <li className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm text-zinc-200">1x {name}</p>
        {note ? <p className="text-xs text-zinc-500">→ {note}</p> : null}
      </div>
      <span className="shrink-0 font-mono text-sm text-zinc-400">{price}</span>
    </li>
  );
}
