import { GlowCard } from "@/components/ui/glow-card";

export function ProductPreview() {
  return (
    <div className="animate-soft-float relative mx-auto w-full max-w-md lg:max-w-lg">
      <div className="absolute -inset-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_30%_20%,rgba(61,155,143,0.35),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(212,184,150,0.18),transparent_50%)] blur-2xl" />

      <div className="absolute -right-2 top-8 z-20 hidden animate-fade-up sm:block" style={{ animationDelay: "0.35s" }}>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3.5 py-2.5 backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300/80">Live</p>
          <p className="mt-0.5 text-sm font-medium text-white">+1 commande · 14:32</p>
        </div>
      </div>

      <GlowCard glow="accent" padding={false} className="relative rounded-[1.35rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)]">
        <div className="overflow-hidden rounded-[calc(1.35rem-1px)] bg-[#090c10]/95">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Ecran cuisine
            </p>
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 animate-live-dot rounded-full bg-emerald-400" />
              En ligne
            </span>
          </div>

          <div className="space-y-2.5 p-4">
            <OrderCard
              id="AST-2847"
              status="Nouvelle"
              tone="accent"
              items={["2x Menu Classique", "1x Frites XL"]}
              time="14:32"
              pulse
            />
            <OrderCard
              id="AST-2846"
              status="En prep"
              tone="blue"
              items={["1x Assiette Mixte"]}
              time="14:28"
            />
            <OrderCard
              id="AST-2845"
              status="Prete"
              tone="emerald"
              items={["3x Sandwich"]}
              time="14:25"
              dimmed
            />
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.06] bg-black/45 px-5 py-3.5">
            <p className="text-xs text-zinc-500">18 commandes · aujourd&apos;hui</p>
            <p className="font-mono text-sm font-semibold text-astor-accent-bright">1 247 €</p>
          </div>
        </div>
      </GlowCard>

      <div className="absolute -bottom-4 -left-3 z-20 sm:-left-6">
        <GlowCard glow="warm" padding={false} className="animate-ring-pulse rounded-2xl shadow-xl">
          <div className="rounded-[calc(1rem-1px)] bg-[#090c10]/95 px-4 py-3">
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
    blue: "bg-sky-500/20 text-sky-300",
    emerald: "bg-emerald-500/20 text-emerald-300",
  };

  return (
    <div
      className={`rounded-xl border border-white/[0.06] bg-white/[0.025] p-3.5 ${dimmed ? "opacity-50" : ""} ${
        pulse ? "animate-new-order border-astor-accent/35" : ""
      }`}
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
    </div>
  );
}
