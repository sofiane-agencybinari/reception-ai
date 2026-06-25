"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bell, Clock, Phone, User } from "lucide-react";

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

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "Nouvelle",
  accepted: "Acceptee",
  preparing: "En preparation",
  ready: "Prete",
  picked_up: "Recuperee",
  cancelled: "Annulee",
};

function playNewOrderChime() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Audio non disponible
  }
}

function formatPickupTime(pickupTime: string | null) {
  if (!pickupTime) return null;
  const date = new Date(pickupTime);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function KitchenBoard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const prevNewCountRef = useRef(0);

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
    void loadOrders();
    const interval = setInterval(() => void loadOrders(), 5000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
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

  useEffect(() => {
    if (loading) return;
    if (newOrders.length > prevNewCountRef.current) {
      playNewOrderChime();
    }
    prevNewCountRef.current = newOrders.length;
  }, [newOrders.length, loading]);

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
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-sm text-zinc-500">
        Chargement des commandes…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
        {error}
      </div>
    );
  }

  if (sortedOrders.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center">
        <Bell className="mx-auto h-10 w-10 text-zinc-600" />
        <p className="mt-4 text-lg font-medium text-white">Cuisine prete</p>
        <p className="mt-1 text-sm text-zinc-500">
          Les commandes telephoniques apparaitront ici en temps reel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="glass-card rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <KpiBadge label="Nouvelles" value={newOrders.length} tone="amber" pulse={newOrders.length > 0} />
            <KpiBadge label="En cours" value={inProgressOrders.length} tone="blue" />
            <KpiBadge label="Traitees" value={handledOrders.length} tone="green" />
          </div>
          <p className="text-xs text-zinc-500">
            Sync{" "}
            <span className="font-mono text-zinc-400">
              {lastUpdatedAt ? lastUpdatedAt.toLocaleTimeString("fr-FR") : "--:--"}
            </span>
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <OrderColumn title="Nouvelles commandes" subtitle="A traiter en priorite" accent="amber" highlight={newOrders.length > 0}>
          {newOrders.length === 0 ? (
            <EmptyColumnMessage message="Aucune nouvelle commande." />
          ) : (
            newOrders.map((order) => (
              <OrderCard key={order.id} order={order} onMoveStatus={moveStatus} isNew />
            ))
          )}
        </OrderColumn>

        <OrderColumn title="En cours" subtitle="Preparation cuisine" accent="blue">
          {inProgressOrders.length === 0 ? (
            <EmptyColumnMessage message="Aucune commande en cours." />
          ) : (
            inProgressOrders.map((order) => (
              <OrderCard key={order.id} order={order} onMoveStatus={moveStatus} />
            ))
          )}
        </OrderColumn>

        <OrderColumn title="Traitees" subtitle="Historique recent" accent="green">
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
  pulse = false,
}: {
  label: string;
  value: number;
  tone: "amber" | "blue" | "green";
  pulse?: boolean;
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
      : tone === "blue"
        ? "border-sky-500/30 bg-sky-500/10 text-sky-200"
        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";

  return (
    <div className={`rounded-full border px-3 py-1 text-xs ${toneClass} ${pulse ? "animate-new-order" : ""}`}>
      <span className="font-semibold">{label}</span>: {value}
    </div>
  );
}

function OrderColumn({
  title,
  subtitle,
  accent,
  highlight = false,
  children,
}: {
  title: string;
  subtitle: string;
  accent: "amber" | "blue" | "green";
  highlight?: boolean;
  children: ReactNode;
}) {
  const accentClass =
    accent === "amber"
      ? "border-amber-500/25"
      : accent === "blue"
        ? "border-sky-500/25"
        : "border-emerald-500/25";

  return (
    <article
      className={`glass-card rounded-2xl p-4 ${accentClass} ${highlight ? "ring-1 ring-amber-500/20" : ""}`}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-white">{title}</h3>
      <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </article>
  );
}

function EmptyColumnMessage({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-white/10 bg-black/20 p-4 text-center text-sm text-zinc-500">
      {message}
    </p>
  );
}

function elapsedMinutes(createdAt: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
}

function OrderCard({
  order,
  onMoveStatus,
  compact = false,
  isNew = false,
}: {
  order: Order;
  onMoveStatus: (order: Order) => Promise<void>;
  compact?: boolean;
  isNew?: boolean;
}) {
  const nextStatus = NEXT_STATUS[order.status];
  const elapsed = elapsedMinutes(order.created_at);
  const pickup = formatPickupTime(order.pickup_time);
  const isLate = elapsed >= 20 && !["picked_up", "cancelled"].includes(order.status);

  return (
    <article
      className={`rounded-xl border bg-black/40 p-4 transition hover:-translate-y-0.5 hover:border-amber-500/30 ${
        isLate ? "border-rose-500/40" : "border-white/8"
      } ${isNew ? "animate-new-order" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-amber-400/80">
            SB-{order.id.slice(0, 8).toUpperCase()}
          </p>
          <h4 className="mt-0.5 font-semibold text-white">
            {order.customer_name?.trim() || "Client"}
          </h4>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase text-zinc-400">
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
        <span className="inline-flex items-center gap-1">
          <Phone className="h-3 w-3" />
          {order.customer_phone}
        </span>
        {pickup ? (
          <span className="inline-flex items-center gap-1 text-amber-300/90">
            <Clock className="h-3 w-3" />
            Retrait {pickup}
          </span>
        ) : null}
        <span className={isLate ? "text-rose-400" : ""}>{elapsed} min</span>
      </div>

      {!compact ? (
        <>
          <ul className="mt-3 space-y-1 border-t border-white/5 pt-3 text-sm text-zinc-300">
            {order.order_items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2">
                <span>
                  {item.quantity}x {item.item_name}
                </span>
                <span className="font-mono text-xs text-zinc-500">
                  {item.line_total.toFixed(2)} EUR
                </span>
              </li>
            ))}
          </ul>
          {order.notes ? (
            <p className="mt-2 rounded-lg bg-amber-500/10 px-2 py-1.5 text-xs text-amber-200/90">
              Note : {order.notes}
            </p>
          ) : null}
        </>
      ) : (
        <p className="mt-2 text-xs text-zinc-500">
          <User className="mr-1 inline h-3 w-3" />
          {order.order_items.map((i) => `${i.quantity}x ${i.item_name}`).join(", ")}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
        <p className="text-sm font-bold text-white">
          {Number(order.total_amount).toFixed(2)} EUR
        </p>
        {nextStatus ? (
          <button
            type="button"
            onClick={() => void onMoveStatus(order)}
            className="cockpit-btn-primary px-3 py-1.5 text-xs"
          >
            {STATUS_LABEL[nextStatus]}
          </button>
        ) : null}
      </div>
    </article>
  );
}
