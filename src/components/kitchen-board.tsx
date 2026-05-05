"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { DEFAULT_RESTAURANT_ID } from "@/lib/config";
import type { Order, OrderStatus } from "@/lib/types";

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  new: "accepted",
  accepted: "preparing",
  preparing: "ready",
  ready: "picked_up",
  picked_up: null,
  cancelled: null,
};

export function KitchenBoard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/orders?restaurantId=${DEFAULT_RESTAURANT_ID}&view=active`,
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Erreur chargement commandes");
      }
      setOrders(data.orders ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const firstLoad = setTimeout(() => {
      void loadOrders();
    }, 0);
    const interval = setInterval(() => {
      void loadOrders();
    }, 5000);

    return () => {
      clearTimeout(firstLoad);
      clearInterval(interval);
    };
  }, [loadOrders]);

  const hasOrders = useMemo(() => orders.length > 0, [orders.length]);

  async function moveStatus(order: Order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;

    const res = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) return;
    void loadOrders();
  }

  if (loading) {
    return <p className="text-sm text-slate-600">Chargement des commandes...</p>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!hasOrders) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-6 text-sm text-slate-700">
        Aucune commande active pour le moment.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-xl border border-black/10 bg-white p-5 text-slate-900 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-900">Commande {order.id.slice(0, 8)}</h3>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium uppercase text-indigo-700">
              {order.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-700">{order.customer_phone}</p>
          <ul className="mt-3 space-y-1 text-sm text-slate-700">
            {order.order_items.map((item) => (
              <li key={item.id}>
                {item.quantity}x {item.item_name} - {item.line_total.toFixed(2)} EUR
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm font-semibold">
              Total: {Number(order.total_amount).toFixed(2)} EUR
            </p>
            {NEXT_STATUS[order.status] ? (
              <button
                type="button"
                onClick={() => void moveStatus(order)}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white transition hover:bg-indigo-500"
              >
                Passer a {NEXT_STATUS[order.status]}
              </button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
