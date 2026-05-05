"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";

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
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders?restaurantId=${DEFAULT_RESTAURANT_ID}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Erreur chargement commandes");
      }
      setOrders(data.orders ?? []);
      setLastUpdatedAt(new Date());
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

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      ),
    [orders],
  );

  const newOrders = useMemo(
    () => sortedOrders.filter((order) => order.status === "new"),
    [sortedOrders],
  );

  const inProgressOrders = useMemo(
    () =>
      sortedOrders.filter((order) =>
        ["accepted", "preparing", "ready"].includes(order.status),
      ),
    [sortedOrders],
  );

  const handledOrders = useMemo(
    () =>
      [...sortedOrders]
        .filter((order) => ["picked_up", "cancelled"].includes(order.status))
        .reverse()
        .slice(0, 12),
    [sortedOrders],
  );

  const hasOrders = useMemo(() => sortedOrders.length > 0, [sortedOrders.length]);

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
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-6 text-sm text-slate-300">
        Aucune commande pour le moment. La cuisine est prete.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <KpiBadge label="Nouvelles" value={newOrders.length} tone="red" />
            <KpiBadge label="En cours" value={inProgressOrders.length} tone="blue" />
            <KpiBadge label="Traitees" value={handledOrders.length} tone="green" />
          </div>
          <p className="text-xs text-slate-400">
            Derniere synchro:{" "}
            <span className="font-medium text-slate-300">
              {lastUpdatedAt ? lastUpdatedAt.toLocaleTimeString("fr-FR") : "--:--:--"}
            </span>
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <OrderColumn title="Nouvelles commandes" subtitle="A traiter rapidement" accent="red">
          {newOrders.length === 0 ? (
            <EmptyColumnMessage message="Aucune nouvelle commande." />
          ) : (
            newOrders.map((order) => (
              <OrderCard key={order.id} order={order} onMoveStatus={moveStatus} />
            ))
          )}
        </OrderColumn>

        <OrderColumn title="Commandes en cours" subtitle="Preparation cuisine" accent="blue">
          {inProgressOrders.length === 0 ? (
            <EmptyColumnMessage message="Aucune commande en cours." />
          ) : (
            inProgressOrders.map((order) => (
              <OrderCard key={order.id} order={order} onMoveStatus={moveStatus} />
            ))
          )}
        </OrderColumn>

        <OrderColumn title="Commandes traitees" subtitle="Historique recent" accent="green">
          {handledOrders.length === 0 ? (
            <EmptyColumnMessage message="Aucune commande traitee." />
          ) : (
            handledOrders.map((order) => (
              <OrderCard key={order.id} order={order} onMoveStatus={moveStatus} compact />
            ))
          )}
        </OrderColumn>
      </section>
    </div>
  );
}

function KpiBadge({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "red" | "blue" | "green";
}) {
  const toneClass =
    tone === "red"
      ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
      : tone === "blue"
        ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-200"
        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";

  return (
    <div className={`rounded-full border px-3 py-1 text-xs ${toneClass}`}>
      <span className="font-semibold">{label}</span>: {value}
    </div>
  );
}

function OrderColumn({
  title,
  subtitle,
  accent,
  children,
}: {
  title: string;
  subtitle: string;
  accent: "red" | "blue" | "green";
  children: ReactNode;
}) {
  const accentClass =
    accent === "red"
      ? "border-rose-500/30"
      : accent === "blue"
        ? "border-cyan-500/30"
        : "border-emerald-500/30";

  return (
    <article className={`rounded-xl border bg-slate-950/80 p-4 ${accentClass}`}>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">{title}</h3>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </article>
  );
}

function EmptyColumnMessage({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-400">
      {message}
    </p>
  );
}

function formatStatus(status: OrderStatus) {
  switch (status) {
    case "new":
      return "nouvelle";
    case "accepted":
      return "acceptee";
    case "preparing":
      return "en preparation";
    case "ready":
      return "prete";
    case "picked_up":
      return "recuperee";
    case "cancelled":
      return "annulee";
    default:
      return status;
  }
}

function elapsedMinutes(createdAt: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
}

function OrderCard({
  order,
  onMoveStatus,
  compact = false,
}: {
  order: Order;
  onMoveStatus: (order: Order) => Promise<void>;
  compact?: boolean;
}) {
  const nextStatus = NEXT_STATUS[order.status];
  const elapsed = elapsedMinutes(order.created_at);
  const alertTone =
    elapsed >= 20 && !["picked_up", "cancelled"].includes(order.status)
      ? "border-rose-500/40"
      : "border-slate-700";

  return (
    <article
      className={`rounded-xl border bg-slate-900/80 p-4 text-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400/60 ${alertTone}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-semibold">#{order.id.slice(0, 8)}</h4>
        <span className="rounded-full border border-slate-600 px-2 py-0.5 text-[11px] uppercase text-slate-300">
          {formatStatus(order.status)}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
        <span>{order.customer_phone}</span>
        <span>{elapsed} min</span>
      </div>

      {!compact ? (
        <ul className="mt-3 space-y-1 text-sm text-slate-300">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-2">
              <span>
                {item.quantity}x {item.item_name}
              </span>
              <span>{item.line_total.toFixed(2)} EUR</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-white">
          {Number(order.total_amount).toFixed(2)} EUR
        </p>
        {nextStatus ? (
          <button
            type="button"
            onClick={() => void onMoveStatus(order)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500"
          >
            Passer a {formatStatus(nextStatus)}
          </button>
        ) : null}
      </div>
    </article>
  );
}
