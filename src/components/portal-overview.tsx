"use client";

import { useCallback, useEffect, useState } from "react";
import { Phone, ShoppingBag, TrendingUp, Clock } from "lucide-react";

import { useRestaurant } from "@/lib/restaurant-context";

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

/** Prix de l'offre Essentiel : repère simple pour montrer que l'abonnement est rentabilisé. */
const BASE_PLAN_PRICE = 49;

export function PortalOverview() {
  const { restaurantId } = useRestaurant();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [ligne, setLigne] = useState({ todayOrders: 0, monthOrders: 0, monthRevenue: 0 });
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);

  const load = useCallback(async () => {
    const [metricsRes, ordersRes, logsRes] = await Promise.all([
      fetch(`/api/dashboard?restaurantId=${restaurantId}`),
      fetch(`/api/orders?restaurantId=${restaurantId}`),
      fetch(`/api/call-logs?restaurantId=${restaurantId}&limit=5`),
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

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthOrders = (ordersData.orders ?? []).filter(
      (o: { created_at: string; status: string }) =>
        new Date(o.created_at) >= monthStart && o.status !== "cancelled",
    );
    setLigne({
      todayOrders: todayOrders.length,
      monthOrders: monthOrders.length,
      monthRevenue: monthOrders.reduce(
        (sum: number, o: { total_amount: number }) => sum + Number(o.total_amount),
        0,
      ),
    });

    if (logsRes.ok) {
      setCallLogs(logsData.callLogs ?? []);
    }
  }, [restaurantId]);

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 15000);
    return () => clearInterval(interval);
  }, [load]);

  const eur = (value: number) => value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
  const paidBack = Math.floor(ligne.monthRevenue / BASE_PLAN_PRICE);

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-2xl border-astor-accent/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-astor-accent-soft">
          Ce que Ligne vous a rapporté ce mois-ci
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-x-10 gap-y-3">
          <div>
            <p className="text-4xl font-bold text-white">{eur(ligne.monthRevenue)}</p>
            <p className="mt-1 text-sm text-zinc-400">de commandes prises au téléphone par Ligne</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">{ligne.monthOrders}</p>
            <p className="mt-1 text-sm text-zinc-400">commandes ce mois · {ligne.todayOrders} aujourd&apos;hui</p>
          </div>
        </div>
        {paidBack >= 1 ? (
          <p className="mt-4 inline-block rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300">
            Soit {paidBack} fois le prix de l&apos;abonnement de base ({BASE_PLAN_PRICE} €)
          </p>
        ) : null}
      </section>

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
          value={eur(todayRevenue)}
          hint="Commandes validées"
        />
        <StatTile
          icon={Phone}
          label="Commandes Ligne"
          value={metrics?.totalOrders?.toString() ?? "—"}
          hint="Depuis le lancement"
        />
        <StatTile
          icon={Clock}
          label="Panier moyen"
          value={metrics ? eur(metrics.avgTicket) : "—"}
          hint="Par commande"
        />
      </section>

      {callLogs.length > 0 ? (
        <section className="glass-card rounded-2xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Activité récente
          </h2>
          <ul className="mt-4 space-y-2">
            {callLogs.map((log) => (
              <li
                key={log.id}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/30 px-4 py-3 text-sm"
              >
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-astor-accent-soft" />
                <div className="min-w-0 flex-1">
                  <p className="text-zinc-300">
                    {log.transcript?.slice(0, 120) ?? "Appel traité — commande enregistrée"}
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
      <div className="flex items-center gap-2 text-astor-accent-soft">
        <Icon className="h-4 w-4" />
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{hint}</p>
    </article>
  );
}
