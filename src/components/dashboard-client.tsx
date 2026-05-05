"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { DEFAULT_RESTAURANT_ID } from "@/lib/config";
import type { DashboardMetrics, Order, OrderStatus } from "@/lib/types";

const EMPTY_METRICS: DashboardMetrics = {
  totalOrders: 0,
  activeOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  avgTicket: 0,
};

export function DashboardClient() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(EMPTY_METRICS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "active" | "picked_up" | "cancelled"
  >("all");

  const loadData = useCallback(async () => {
    try {
      const [metricsRes, ordersRes] = await Promise.all([
        fetch(`/api/dashboard?restaurantId=${DEFAULT_RESTAURANT_ID}`),
        fetch(`/api/orders?restaurantId=${DEFAULT_RESTAURANT_ID}`),
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
  }, []);

  useEffect(() => {
    const firstLoad = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(firstLoad);
  }, [loadData]);

  const statusCount = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      new: 0,
      accepted: 0,
      preparing: 0,
      ready: 0,
      picked_up: 0,
      cancelled: 0,
    };
    for (const order of orders) {
      counts[order.status] += 1;
    }
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (selectedFilter === "all") return orders;
    if (selectedFilter === "active") {
      return orders.filter((order) =>
        ["new", "accepted", "preparing", "ready"].includes(order.status),
      );
    }
    return orders.filter((order) => order.status === selectedFilter);
  }, [orders, selectedFilter]);

  const topProducts = useMemo(() => {
    const map = new Map<string, { quantity: number; revenue: number }>();
    for (const order of orders) {
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
  }, [orders]);

  const last7Days = useMemo(() => {
    const now = new Date();
    const points = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - index));
      return {
        key: day.toISOString().slice(0, 10),
        label: day.toLocaleDateString("fr-FR", { weekday: "short" }),
        count: 0,
      };
    });

    for (const order of orders) {
      const key = new Date(order.created_at).toISOString().slice(0, 10);
      const point = points.find((p) => p.key === key);
      if (point) point.count += 1;
    }
    return points;
  }, [orders]);

  const maxDayCount = useMemo(
    () => Math.max(...last7Days.map((point) => point.count), 1),
    [last7Days],
  );
  const maxProductQty = useMemo(
    () => Math.max(...topProducts.map((product) => product.quantity), 1),
    [topProducts],
  );

  if (error) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-indigo-200 bg-white/90 p-5 text-slate-800">
          <h2 className="text-lg font-semibold text-slate-900">Volume commandes (7 jours)</h2>
          <div className="mt-4 space-y-3">
            {last7Days.map((point) => (
              <div key={point.key} className="grid grid-cols-[58px_1fr_38px] items-center gap-3">
                <span className="text-xs uppercase text-slate-500">{point.label}</span>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-indigo-500"
                    style={{ width: `${(point.count / maxDayCount) * 100}%` }}
                  />
                </div>
                <span className="text-right text-sm font-medium text-slate-700">{point.count}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-indigo-200 bg-white/90 p-5 text-slate-800">
          <h2 className="text-lg font-semibold text-slate-900">Top produits commandes</h2>
          <p className="mt-1 text-sm text-slate-600">
            Classement par quantite vendue (clic sur une commande pour details).
          </p>
          <div className="mt-4 space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-sm text-slate-600">Aucune vente enregistree pour le moment.</p>
            ) : (
              topProducts.map((product) => (
                <div key={product.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-800">{product.name}</span>
                    <span className="text-slate-600">{product.quantity} ventes</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${(product.quantity / maxProductQty) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-indigo-200 bg-white/90 p-5 text-slate-800">
        <h2 className="text-lg font-semibold text-slate-900">
          Historique des commandes ({filteredOrders.length})
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Filtre actif:{" "}
          <span className="font-medium text-slate-800">
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
          <table className="min-w-full text-left text-sm text-slate-800">
            <thead className="border-b border-slate-200 text-slate-600">
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
                <tr key={order.id} className="border-b border-slate-100">
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
      className={`rounded-xl border bg-white/90 p-4 ${
        onClick ? "cursor-pointer transition hover:border-indigo-400" : ""
      } ${active ? "border-indigo-500 ring-2 ring-indigo-200" : "border-indigo-200"}`}
    >
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}
