export function ProductPreview() {
  return (
    <div className="animate-soft-float relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-astor-accent/15 via-transparent to-teal-900/20 blur-2xl" />
      <div className="glass-card relative overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-astor-accent/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Ecran cuisine</p>
        </div>
        <div className="space-y-3 p-4">
          <OrderCard id="SB-A3F21B" status="Nouvelle" tone="accent" items={["2x Burger", "1x Frites"]} time="14:32" />
          <OrderCard id="SB-B8C44D" status="En prep" tone="blue" items={["1x Menu Duo"]} time="14:28" />
          <OrderCard id="SB-C1D99E" status="Pret" tone="emerald" items={["3x Pizza"]} time="14:25" dimmed />
        </div>
        <div className="flex items-center justify-between border-t border-white/5 bg-black/30 px-4 py-3">
          <p className="text-xs text-zinc-500">12 commandes aujourd&apos;hui</p>
          <p className="text-sm font-semibold text-astor-accent-soft">847 EUR</p>
        </div>
      </div>
      <div className="absolute -bottom-4 -left-4 glass-card rounded-xl px-4 py-3 shadow-xl">
        <p className="text-[10px] uppercase tracking-wider text-zinc-500">Appel en cours</p>
        <p className="mt-1 flex items-center gap-2 text-sm font-medium text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          IA decroche...
        </p>
      </div>
    </div>
  );
}

function OrderCard({ id, status, tone, items, time, dimmed }: { id: string; status: string; tone: string; items: string[]; time: string; dimmed?: boolean }) {
  const colors: Record<string, string> = {
    accent: "bg-astor-accent/20 text-astor-accent-bright",
    blue: "bg-blue-500/20 text-blue-300",
    emerald: "bg-emerald-500/20 text-emerald-300",
  };
  return (
    <div className={`rounded-xl border border-white/5 bg-white/[0.03] p-3 ${dimmed ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-zinc-400">{id}</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${colors[tone]}`}>{status}</span>
      </div>
      <ul className="mt-2 space-y-0.5 text-sm text-zinc-300">{items.map((i) => <li key={i}>{i}</li>)}</ul>
      <p className="mt-2 text-[10px] text-zinc-600">{time}</p>
    </div>
  );
}
