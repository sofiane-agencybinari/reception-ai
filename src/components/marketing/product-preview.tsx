import { GlowCard } from "@/components/ui/glow-card";

export function ProductPreview() {
  return (
    <div className="animate-soft-float relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-astor-accent/20 via-transparent to-astor-warm/10 blur-3xl" />

      <GlowCard glow="accent" padding={false} className="relative rounded-[1.25rem] shadow-2xl shadow-black/40">
        <div className="rounded-[calc(1.25rem-1px)] bg-[#0d1014]/95">
          <div className="flex items-center justify-between border-b border-white/6 px-5 py-3.5">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              Cockpit cuisine
            </p>
          </div>

          <div className="space-y-3 p-4">
            <OrderCard
              id="AST-2847"
              status="Nouvelle"
              tone="accent"
              items={["2x Menu Classique", "1x Frites"]}
              time="14:32"
              pulse
            />
            <OrderCard id="AST-2846" status="En prep" tone="blue" items={["1x Assiette Mix"]} time="14:28" />
            <OrderCard id="AST-2845" status="Prete" tone="emerald" items={["3x Sandwich"]} time="14:25" dimmed />
          </div>

          <div className="flex items-center justify-between border-t border-white/6 bg-black/40 px-5 py-3.5">
            <p className="text-xs text-zinc-500">18 commandes aujourd&apos;hui</p>
            <p className="font-mono text-sm font-semibold text-astor-accent-bright">1 247 EUR</p>
          </div>
        </div>
      </GlowCard>

      <GlowCard glow="warm" padding={false} className="absolute -bottom-5 -left-5 max-w-[220px] rounded-xl shadow-xl">
        <div className="rounded-[calc(0.75rem-1px)] bg-[#0d1014]/95 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Appel entrant</p>
          <p className="mt-1.5 flex items-center gap-2 text-sm font-medium text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            IA decroche…
          </p>
        </div>
      </GlowCard>
    </div>
  );
}

function OrderCard({
  id,
  status,
  tone,
  items,
  time,
  dimmed,
  pulse,
}: {
  id: string;
  status: string;
  tone: string;
  items: string[];
  time: string;
  dimmed?: boolean;
  pulse?: boolean;
}) {
  const colors: Record<string, string> = {
    accent: "bg-astor-accent/20 text-astor-accent-bright",
    blue: "bg-blue-500/20 text-blue-300",
    emerald: "bg-emerald-500/20 text-emerald-300",
  };

  return (
    <div
      className={`rounded-xl border border-white/6 bg-white/[0.02] p-3.5 ${dimmed ? "opacity-55" : ""} ${
        pulse ? "animate-new-order border-astor-accent/30" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-zinc-400">{id}</p>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${colors[tone]}`}>
          {status}
        </span>
      </div>
      <ul className="mt-2.5 space-y-0.5 text-sm text-zinc-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-2 font-mono text-[10px] text-zinc-600">{time}</p>
    </div>
  );
}
