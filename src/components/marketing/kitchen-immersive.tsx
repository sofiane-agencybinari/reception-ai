"use client";

import type { ReactNode } from "react";

/** Écran cuisine immersif — 3 colonnes comme le board réel + SMS client. */

type Ticket = {
  id: string;
  name: string;
  phone: string;
  time: string;
  total: string;
  items: string[];
  note?: string;
  status?: string;
};

const NEW_ORDERS: Ticket[] = [
  {
    id: "AST-2847",
    name: "Camille R.",
    phone: "06 12 34 56 78",
    time: "14:45",
    total: "13,00 €",
    items: ["1× Margherita", "1× Coca 33cl"],
    note: "Sans oignon",
  },
  {
    id: "AST-2848",
    name: "Yanis B.",
    phone: "07 88 21 09 44",
    time: "14:50",
    total: "22,50 €",
    items: ["1× Menu kebab", "1× Frites", "1× Ice Tea"],
  },
];

const PREP_ORDERS: Ticket[] = [
  {
    id: "AST-2845",
    name: "Sophie M.",
    phone: "06 45 12 98 33",
    time: "14:35",
    total: "18,00 €",
    items: ["1× Reine", "1× Tiramisu"],
    status: "En préparation",
  },
  {
    id: "AST-2844",
    name: "Karim A.",
    phone: "06 77 01 22 10",
    time: "14:30",
    total: "11,50 €",
    items: ["1× Tacos M", "1× Coca"],
    status: "Prête",
  },
];

const DONE_ORDERS: Ticket[] = [
  {
    id: "AST-2841",
    name: "Léa D.",
    phone: "06 33 44 55 66",
    time: "14:15",
    total: "15,00 €",
    items: ["1× Burger cheddar", "1× Milkshake"],
  },
  {
    id: "AST-2840",
    name: "Hugo P.",
    phone: "07 11 22 33 44",
    time: "14:05",
    total: "9,00 €",
    items: ["1× Margherita"],
  },
];

export function KitchenImmersive() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0c0c0b] text-[#f2efe8]">
      {/* Header AppShell */}
      <header className="shrink-0 border-b border-white/5 bg-[#0c0c0b]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-bold tracking-tight text-white">LIGNE</span>
            <span className="hidden text-[10px] text-zinc-500 sm:inline">Le Palmier</span>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-zinc-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              En ligne
            </span>
          </div>
          <nav className="hidden gap-1 sm:flex">
            {["Hub", "Cuisine", "Analytics", "Clients", "Menu"].map((item, i) => (
              <span
                key={item}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  i === 1 ? "bg-white/10 text-white" : "text-zinc-500"
                }`}
              >
                {item}
              </span>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden px-4 py-4 sm:px-8 sm:py-6">
        <div className="mb-4 shrink-0 sm:mb-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            Le Palmier
          </p>
          <h1 className="mt-1 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Cuisine
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Commandes live · sync temps réel</p>
        </div>

        {/* KPIs */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Kpi label="Nouvelles" value="2" tone="rose" pulse />
          <Kpi label="En prépa" value="2" tone="amber" />
          <Kpi label="Traitées" value="2" tone="green" />
          <span className="ml-auto hidden font-mono text-[11px] text-zinc-600 sm:inline">
            Sync 14:42:08
          </span>
        </div>

        {/* 3 colonnes */}
        <div className="grid min-h-0 flex-1 gap-3 overflow-hidden lg:grid-cols-3">
          <Column
            title="Nouvelles commandes"
            subtitle="À traiter en priorité"
            accent="rose"
            highlight
          >
            {NEW_ORDERS.map((o) => (
              <TicketCard key={o.id} ticket={o} isNew />
            ))}
          </Column>

          <Column title="En prépa" subtitle="Préparation cuisine" accent="amber">
            {PREP_ORDERS.map((o) => (
              <TicketCard key={o.id} ticket={o} />
            ))}
          </Column>

          <Column title="Traitées" subtitle="Historique récent" accent="green">
            {DONE_ORDERS.map((o) => (
              <TicketCard key={o.id} ticket={o} done />
            ))}
          </Column>
        </div>
      </div>

      {/* SMS flottant — commande prête */}
      <div className="pointer-events-none absolute bottom-5 right-4 z-20 w-[min(100%-2rem,320px)] sm:bottom-8 sm:right-8">
        <SmsReadyPreview />
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  tone,
  pulse,
}: {
  label: string;
  value: string;
  tone: "rose" | "amber" | "green";
  pulse?: boolean;
}) {
  const tones = {
    rose: "border-rose-500/30 bg-rose-500/10 text-rose-200",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {pulse ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" /> : null}
      {label}
      <span className="font-mono font-semibold text-white">{value}</span>
    </span>
  );
}

function Column({
  title,
  subtitle,
  accent,
  highlight,
  children,
}: {
  title: string;
  subtitle: string;
  accent: "rose" | "amber" | "green";
  highlight?: boolean;
  children: ReactNode;
}) {
  const bar = {
    rose: "bg-rose-400",
    amber: "bg-amber-400",
    green: "bg-emerald-400",
  };
  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden rounded-2xl border ${
        highlight ? "border-rose-500/25 bg-rose-500/[0.04]" : "border-white/8 bg-white/[0.02]"
      }`}
    >
      <div className="shrink-0 border-b border-white/5 px-3.5 py-3">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${bar[accent]}`} />
          <p className="text-sm font-semibold text-white">{title}</p>
        </div>
        <p className="mt-0.5 pl-3.5 text-[11px] text-zinc-500">{subtitle}</p>
      </div>
      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-2.5">{children}</div>
    </div>
  );
}

function TicketCard({
  ticket,
  isNew,
  done,
}: {
  ticket: Ticket;
  isNew?: boolean;
  done?: boolean;
}) {
  return (
    <article
      className={`rounded-xl border p-3 ${
        isNew
          ? "border-rose-500/30 bg-[#141210]"
          : done
            ? "border-white/5 bg-white/[0.02] opacity-75"
            : "border-white/8 bg-[#141210]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs font-semibold text-white">{ticket.id}</p>
          <p className="mt-0.5 text-[12px] text-zinc-300">{ticket.name}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] tabular-nums text-zinc-400">Retrait {ticket.time}</p>
          {ticket.status ? (
            <p className="mt-0.5 text-[10px] font-medium text-amber-300/90">{ticket.status}</p>
          ) : null}
        </div>
      </div>
      <ul className="mt-2.5 space-y-1 border-t border-white/5 pt-2.5 text-[12px] text-zinc-300">
        {ticket.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {ticket.note ? (
        <p className="mt-2 text-[11px] text-amber-200/80">Note : {ticket.note}</p>
      ) : null}
      <div className="mt-2.5 flex items-center justify-between">
        <p className="text-[10px] text-zinc-600">{ticket.phone}</p>
        <p className="text-sm font-semibold text-white">{ticket.total}</p>
      </div>
      {isNew ? (
        <div className="mt-2.5 rounded-lg bg-white px-3 py-1.5 text-center text-[11px] font-semibold text-[#0c0c0b]">
          Accepter →
        </div>
      ) : ticket.status === "Prête" ? (
        <div className="mt-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-center text-[11px] font-semibold text-emerald-200">
          SMS « prête » envoyé
        </div>
      ) : null}
    </article>
  );
}

/** Bulle iMessage — SMS commande prête. */
function SmsReadyPreview() {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#1c1c1e] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.7)]">
      <div className="flex items-center gap-2.5 border-b border-white/8 px-3.5 py-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#8b4a58] to-[#3d1a22] text-[11px] font-semibold text-white">
          LP
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-white">Le Palmier</p>
          <p className="text-[10px] text-zinc-500">SMS · maintenant</p>
        </div>
      </div>
      <div className="space-y-2 px-3.5 py-3">
        <div className="max-w-[95%] rounded-2xl rounded-bl-md bg-[#3a3a3c] px-3.5 py-2.5">
          <p className="text-[13px] leading-snug text-white">
            Bonjour Camille 👋 Votre commande <span className="font-semibold">AST-2844</span> est{" "}
            <span className="font-semibold text-emerald-300">prête</span> !
          </p>
          <p className="mt-1.5 text-[13px] leading-snug text-zinc-300">
            Vous pouvez venir la récupérer au comptoir. Merci et à bientôt — Le Palmier.
          </p>
        </div>
        <p className="text-right text-[10px] text-zinc-600">Envoyé automatiquement · LIGNE</p>
      </div>
    </div>
  );
}
