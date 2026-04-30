"use client";

import { useCallback, useEffect, useState } from "react";

import { DEFAULT_RESTAURANT_ID } from "@/lib/config";
import type { DashboardMetrics, Order } from "@/lib/types";

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
        <MetricCard label="Total commandes" value={metrics.totalOrders.toString()} />
        <MetricCard label="Actives" value={metrics.activeOrders.toString()} />
        <MetricCard label="Recuperees" value={metrics.completedOrders.toString()} />
        <MetricCard label="Annulees" value={metrics.cancelledOrders.toString()} />
        <MetricCard label="Panier moyen" value={`${metrics.avgTicket.toFixed(2)} EUR`} />
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-5">
        <h2 className="text-lg font-semibold">Historique des commandes</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/10 text-zinc-600">
              <tr>
                <th className="px-2 py-2 font-medium">Commande</th>
                <th className="px-2 py-2 font-medium">Telephone</th>
                <th className="px-2 py-2 font-medium">Statut</th>
                <th className="px-2 py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-black/5">
                  <td className="px-2 py-2">{order.id.slice(0, 8)}</td>
                  <td className="px-2 py-2">{order.customer_phone}</td>
                  <td className="px-2 py-2">{order.status}</td>
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

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-black/10 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </article>
  );
}
