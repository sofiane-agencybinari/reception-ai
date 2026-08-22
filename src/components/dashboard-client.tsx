"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRestaurant } from "@/lib/restaurant-context";
import {
  buildProductSalesRows,
  downloadCsv,
  ordersToCsv,
  productSalesToCsv,
  sumRevenue,
} from "@/lib/exports";
import type { DashboardMetrics, Order } from "@/lib/types";

const EMPTY_METRICS: DashboardMetrics = {
  totalOrders: 0,
  activeOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  avgTicket: 0,
};

export function DashboardClient() {
  const { restaurantId } = useRestaurant();
  const [metrics, setMetrics] = useState<DashboardMetrics>(EMPTY_METRICS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "active" | "picked_up" | "cancelled"
  >("all");

  const loadData = useCallback(async () => {
    try {
      const [metricsRes, ordersRes] = await Promise.all([
        fetch(`/api/dashboard?restaurantId=${restaurantId}`),
        fetch(`/api/orders?restaurantId=${restaurantId}`),
      ]);

      const metricsData = await metricsRes.json();
      const ordersData = await ordersRes.json();

      if (!metricsRes.ok) throw new Error(metricsData.error ?? "Erreur dashboard");
      if (!ordersRes.ok) throw new Error(ordersData.error ?? "Erreur commandes");

      setMetrics(metricsData.metrics ?? EMPTY_METRICS);
      setOrders(ordersData.orders ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }, [restaurantId]);

  useEffect(() => {
    const firstLoad = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(firstLoad);
  }, [loadData]);

  const filteredOrders = useMemo(() => {
    if (selectedFilter === "all") return orders;
    if (selectedFilter === "active") {
      return orders.filter((order) =>
        ["new", "accepted", "preparing", "ready"].includes(order.status),
      );
    }
    return orders.filter((order) => order.status === selectedFilter);
  }, [orders, selectedFilter]);

  const analyticsOrders = useMemo(() => {
    const days = selectedPeriod === "week" ? 7 : selectedPeriod === "month" ? 30 : 365;
    const now = Date.now();
    const periodStart = now - (days - 1) * 24 * 60 * 60 * 1000;
    return orders.filter((order) => new Date(order.created_at).getTime() >= periodStart);
  }, [orders, selectedPeriod]);

  const topProducts = useMemo(() => {
    const map = new Map<string, { quantity: number; revenue: number }>();
    for (const order of analyticsOrders) {
      for (const item of order.order_items) {
        const prev = map.get(item.item_name) ?? { quantity: 0, revenue: 0 };
        map.set(item.item_name, {
          quantity: prev.quantity + item.quantity,
          revenue: prev.revenue + Number(item.line_total),
        });
      }
    }
    return [...map.entries()]
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8);
  }, [analyticsOrders]);

  const analyticsPoints = useMemo(() => {
    const now = new Date();
    const days = selectedPeriod === "week" ? 7 : selectedPeriod === "month" ? 30 : 365;
    const points = Array.from({ length: days }, (_, index) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (days - 1 - index));
      return {
        key: day.toISOString().slice(0, 10),
        label:
          selectedPeriod === "week"
            ? day.toLocaleDateString("fr-FR", { weekday: "short" })
            : day.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
        total: 0,
        perProduct: {} as Record<string, number>,
      };
    });

    for (const order of analyticsOrders) {
      const key = new Date(order.created_at).toISOString().slice(0, 10);
      const point = points.find((p) => p.key === key);
      if (!point) continue;
      for (const item of order.order_items) {
        point.total += item.quantity;
        point.perProduct[item.item_name] = (point.perProduct[item.item_name] ?? 0) + item.quantity;
      }
    }
    return points;
  }, [analyticsOrders, selectedPeriod]);

  const maxDayVolume = useMemo(
    () => Math.max(...analyticsPoints.map((point) => point.total), 1),
    [analyticsPoints],
  );

  const topProductNames = useMemo(
    () => topProducts.slice(0, 5).map((product) => product.name),
    [topProducts],
  );

  const productColorByName = useMemo(() => {
    const palette = [
      "bg-cyan-400",
      "bg-indigo-400",
      "bg-violet-400",
      "bg-emerald-400",
      "bg-astor-accent-soft",
    ];
    const entries = topProductNames.map((name, idx) => [name, palette[idx % palette.length]] as const);
    return Object.fromEntries(entries);
  }, [topProductNames]);

  const totalVolumeForPeriod = useMemo(
    () => analyticsPoints.reduce((sum, point) => sum + point.total, 0),
    [analyticsPoints],
  );

  const periodRevenue = useMemo(() => sumRevenue(analyticsOrders), [analyticsOrders]);

  const todayStats = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter(
      (o) => new Date(o.created_at).toISOString().slice(0, 10) === todayKey,
    );
    const valid = todayOrders.filter((o) => o.status !== "cancelled");
    return {
      orders: todayOrders.length,
      revenue: sumRevenue(todayOrders),
      units: valid.reduce(
        (sum, o) => sum + o.order_items.reduce((s, i) => s + i.quantity, 0),
        0,
      ),
    };
  }, [orders]);

  const periodLabel = selectedPeriod === "week" ? "7 jours" : selectedPeriod === "month" ? "30 jours" : "365 jours";
  const featuredProduct = topProducts[0];

  function exportProductSales() {
    const products = buildProductSalesRows(analyticsOrders);
    const rows = productSalesToCsv(products, periodLabel, periodRevenue);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(rows, `astor_compta_produits_${stamp}.csv`);
  }

  function exportOrders() {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(ordersToCsv(filteredOrders), `astor_commandes_${stamp}.csv`);
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-2xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-astor-accent">
              Rapport du jour
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {todayStats.revenue.toFixed(2)} EUR
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {todayStats.orders} commandes · {todayStats.units} produits vendus
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-zinc-500">CA periode ({periodLabel})</p>
            <p className="mt-2 text-2xl font-semibold text-astor-accent-soft">
              {periodRevenue.toFixed(2)} EUR
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportProductSales}
            className="rounded-full bg-astor-accent px-4 py-2 text-xs font-semibold text-white transition hover:bg-astor-accent-soft"
          >
            Export compta produits (CSV)
          </button>
          <button
            type="button"
            onClick={exportOrders}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:border-astor-accent/30 hover:text-white"
          >
            Export commandes (CSV)
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          label="Total commandes"
          value={metrics.totalOrders.toString()}
          active={selectedFilter === "all"}
          onClick={() => setSelectedFilter("all")}
        />
        <MetricCard
          label="Actives"
          value={metrics.activeOrders.toString()}
          active={selectedFilter === "active"}
          onClick={() => setSelectedFilter("active")}
        />
        <MetricCard
          label="Recuperees"
          value={metrics.completedOrders.toString()}
          active={selectedFilter === "picked_up"}
          onClick={() => setSelectedFilter("picked_up")}
        />
        <MetricCard
          label="Annulees"
          value={metrics.cancelledOrders.toString()}
          active={selectedFilter === "cancelled"}
          onClick={() => setSelectedFilter("cancelled")}
        />
        <MetricCard label="Panier moyen" value={`${metrics.avgTicket.toFixed(2)} EUR`} />
        <MetricCard label={`CA (${periodLabel})`} value={`${periodRevenue.toFixed(2)} EUR`} />
      </section>

      <section className="rounded-2xl border border-white/8 bg-black/30 p-5 backdrop-blur">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Tableau d&apos;analyse produits
          </h2>
          <div className="inline-flex rounded-lg border border-white/10 bg-black/40 p-1">
            <PeriodButton
              label="Semaine"
              active={selectedPeriod === "week"}
              onClick={() => setSelectedPeriod("week")}
            />
            <PeriodButton
              label="Mois"
              active={selectedPeriod === "month"}
              onClick={() => setSelectedPeriod("month")}
            />
            <PeriodButton
              label="Annee"
              active={selectedPeriod === "year"}
              onClick={() => setSelectedPeriod("year")}
            />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <article className="glass-card rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Total ({periodLabel})</p>
            <p className="mt-2 text-4xl font-semibold text-white">{totalVolumeForPeriod}</p>
            <p className="mt-1 text-xs text-zinc-500">Unites produits vendues</p>
          </article>
          <article className="glass-card rounded-xl border-astor-accent/20 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-400">Produit le plus commande</p>
            <p className="mt-2 text-2xl font-semibold text-astor-accent-bright">
              {featuredProduct?.name ?? "Aucun produit"}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {featuredProduct
                ? `${featuredProduct.quantity} unites | ${featuredProduct.revenue.toFixed(2)} EUR`
                : "Ajoutez des ventes pour voir les stats"}
            </p>
          </article>
        </div>
        <div className="mt-5 glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Volume par jour et par produit ({periodLabel})
          </h3>
          {topProducts.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">Aucune vente enregistree pour le moment.</p>
          ) : (
            <>
              <div className="mt-4 flex h-56 items-end gap-1 overflow-x-auto pb-2">
                {analyticsPoints.map((point) => {
                  const safeTotal = Math.max(point.total, 1);
                  const height = Math.max((point.total / maxDayVolume) * 100, point.total > 0 ? 8 : 2);
                  const tooltipProducts = topProductNames
                    .map((name) => `${name}: ${point.perProduct[name] ?? 0}`)
                    .join(" | ");

                  return (
                    <div key={point.key} className="group flex min-w-4 flex-1 flex-col items-center justify-end">
                      <div
                        className="flex w-full flex-col overflow-hidden rounded-sm border border-white/10 bg-black/50"
                        style={{ height: `${height}%` }}
                        title={`${point.label} - Total: ${point.total} | ${tooltipProducts}`}
                      >
                        {topProductNames.map((name) => {
                          const qty = point.perProduct[name] ?? 0;
                          if (qty === 0) return null;
                          return (
                            <div
                              key={`${point.key}-${name}`}
                              className={productColorByName[name] ?? "bg-slate-500"}
                              style={{ height: `${(qty / safeTotal) * 100}%` }}
                            />
                          );
                        })}
                      </div>
                      <span className="mt-2 text-[10px] text-zinc-600">
                        {selectedPeriod === "week" ? point.label : point.label.split(" ")[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {topProductNames.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2 py-1 text-xs text-zinc-400"
                  >
                    <span className={`h-2 w-2 rounded-full ${productColorByName[name] ?? "bg-slate-500"}`} />
                    {name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="glass-card rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white">Top produits commandes ({periodLabel})</h2>
          <div className="mt-4 space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-sm text-zinc-500">Aucune vente enregistree pour la periode.</p>
            ) : (
              topProducts.map((product) => (
                <div key={product.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-200">{product.name}</span>
                    <span className="text-zinc-500">{product.quantity} ventes</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="glass-card rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white">
          Historique des commandes ({filteredOrders.length})
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Filtre actif:{" "}
          <span className="font-medium text-zinc-300">
            {selectedFilter === "all"
              ? "Toutes"
              : selectedFilter === "active"
                ? "Actives"
                : selectedFilter === "picked_up"
                  ? "Recuperees"
                  : "Annulees"}
          </span>
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-zinc-300">
            <thead className="border-b border-white/10 text-zinc-500">
              <tr>
                <th className="px-2 py-2 font-medium">Commande</th>
                <th className="px-2 py-2 font-medium">Telephone</th>
                <th className="px-2 py-2 font-medium">Statut</th>
                <th className="px-2 py-2 font-medium">Produits</th>
                <th className="px-2 py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5">
                  <td className="px-2 py-2">{order.id.slice(0, 8)}</td>
                  <td className="px-2 py-2">{order.customer_phone}</td>
                  <td className="px-2 py-2">{order.status}</td>
                  <td className="px-2 py-2">
                    {order.order_items.map((item) => `${item.quantity}x ${item.item_name}`).join(", ")}
                  </td>
                  <td className="px-2 py-2">
                    {Number(order.total_amount).toFixed(2)} EUR
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PeriodButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1 text-xs font-medium transition ${
        active
          ? "bg-astor-accent text-white"
          : "text-zinc-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function MetricCard({
  label,
  value,
  active = false,
  onClick,
}: {
  label: string;
  value: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <article
      onClick={onClick}
      className={`glass-card rounded-xl p-4 transition ${
        onClick ? "cursor-pointer hover:-translate-y-0.5 hover:border-astor-accent/30" : ""
      } ${active ? "border-astor-accent/40 ring-1 ring-astor-accent/25" : ""}`}
    >
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </article>
  );
}
