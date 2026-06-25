"use client";

import { useCallback, useEffect, useState } from "react";
import { Phone, ShoppingBag, TrendingUp, Clock } from "lucide-react";

import { DEFAULT_RESTAURANT_ID } from "@/lib/config";

type CallLog = {
  id: string;
  call_id: string | null;
  transcript: string | null;
  success: boolean;
  created_at: string;
  order_id: string | null;
};

type Metrics = {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  avgTicket: number;
};

export function PortalOverview() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);

  const load = useCallback(async () => {
    const [metricsRes, ordersRes, logsRes] = await Promise.all([
      fetch(`/api/dashboard?restaurantId=${DEFAULT_RESTAURANT_ID}`),
      fetch(`/api/orders?restaurantId=${DEFAULT_RESTAURANT_ID}`),
      fetch(`/api/call-logs?restaurantId=${DEFAULT_RESTAURANT_ID}&limit=5`),
    ]);

    const metricsData = await metricsRes.json();
    const ordersData = await ordersRes.json();
    const logsData = await logsRes.json();

    if (metricsRes.ok) {
      setMetrics(metricsData.metrics);
    }

    const todayKey = new Date().toISOString().slice(0, 10);
    const todayOrders = (ordersData.orders ?? []).filter(
      (o: { created_at: string; status: string; total_amount: number }) =>
        new Date(o.created_at).toISOString().slice(0, 10) === todayKey &&
        o.status !== "cancelled",
    );
    setTodayRevenue(
      todayOrders.reduce(
        (sum: number, o: { total_amount: number }) => sum + Number(o.total_amount),
        0,
      ),
    );

    if (logsRes.ok) {
      setCallLogs(logsData.callLogs ?? []);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 15000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={ShoppingBag}
          label="Commandes actives"
          value={metrics?.activeOrders?.toString() ?? "—"}
          hint="En cuisine maintenant"
        />
        <StatTile
          icon={TrendingUp}
          label="CA aujourd'hui"
          value={`${todayRevenue.toFixed(2)} EUR`}
          hint="Commandes validees"
        />
        <StatTile
          icon={Phone}
          label="Total appels"
          value={metrics?.totalOrders?.toString() ?? "—"}
          hint="Depuis le lancement"
        />
        <StatTile
          icon={Clock}
          label="Panier moyen"
          value={metrics ? `${metrics.avgTicket.toFixed(2)} EUR` : "—"}
          hint="Par commande"
        />
      </section>

      {callLogs.length > 0 ? (
        <section className="glass-card rounded-2xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Activite recente
          </h2>
          <ul className="mt-4 space-y-2">
            {callLogs.map((log) => (
              <li
                key={log.id}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/30 px-4 py-3 text-sm"
              >
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-zinc-300">
                    {log.transcript?.slice(0, 120) ?? "Appel traite — commande enregistree"}
                    {log.transcript && log.transcript.length > 120 ? "…" : ""}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {new Date(log.created_at).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                    {log.order_id ? ` · #${log.order_id.slice(0, 8)}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                    log.success
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-rose-500/15 text-rose-400"
                  }`}
                >
                  {log.success ? "OK" : "Erreur"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <article className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-2 text-amber-400">
        <Icon className="h-4 w-4" />
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{hint}</p>
    </article>
  );
}
