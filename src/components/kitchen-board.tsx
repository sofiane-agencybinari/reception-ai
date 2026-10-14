"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bell, Clock, Maximize2, Phone, User, Volume2, VolumeX } from "lucide-react";

import { useRestaurant } from "@/lib/restaurant-context";
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
  accepted: "Acceptée",
  preparing: "En préparation",
  ready: "Prête",
  picked_up: "Récupérée",
  cancelled: "Annulée",
};

// Le navigateur n'autorise le son qu'après un clic : le bouton « Activer le son » débloque ce contexte audio.
let audioCtx: AudioContext | null = null;

function unlockAudio() {
  try {
    audioCtx ??= new AudioContext();
    void audioCtx.resume();
    return true;
  } catch {
    return false;
  }
}

/** Trois bips nets, audibles dans une cuisine. */
function playNewOrderChime() {
  if (!audioCtx) return;
  const start = audioCtx.currentTime;
  [0, 0.25, 0.5].forEach((offset, index) => {
    const osc = audioCtx!.createOscillator();
    const gain = audioCtx!.createGain();
    osc.type = "square";
    osc.frequency.value = index === 2 ? 1175 : 880;
    osc.connect(gain);
    gain.connect(audioCtx!.destination);
    gain.gain.setValueAtTime(0.25, start + offset);
    gain.gain.exponentialRampToValueAtTime(0.01, start + offset + 0.2);
    osc.start(start + offset);
    osc.stop(start + offset + 0.2);
  });
}

function formatPickupTime(pickupTime: string | null) {
  if (!pickupTime) return null;
  const date = new Date(pickupTime);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function KitchenBoard() {
  const { restaurantId } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const prevNewCountRef = useRef(0);
  const [soundOn, setSoundOn] = useState(false);

  function toggleSound() {
    if (soundOn) {
      setSoundOn(false);
      return;
    }
    if (unlockAudio()) {
      setSoundOn(true);
      playNewOrderChime();
    }
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  }

  const controls = (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={toggleSound}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
          soundOn ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/20 text-amber-200 animate-pulse"
        }`}
      >
        {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        {soundOn ? "Son activé" : "Activer le son"}
      </button>
      <button type="button" onClick={toggleFullscreen} className="cockpit-btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs">
        <Maximize2 className="h-3.5 w-3.5" />
        Plein écran
      </button>
    </div>
  );

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders?restaurantId=${restaurantId}`);
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
  }, [restaurantId]);

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
    if (soundOn && newOrders.length > prevNewCountRef.current) {
      playNewOrderChime();
    }
    prevNewCountRef.current = newOrders.length;
  }, [newOrders.length, loading, soundOn]);

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
      <div className="space-y-5">
        <div className="flex justify-end">{controls}</div>
        <div className="glass-card rounded-2xl p-10 text-center">
          <Bell className="mx-auto h-10 w-10 text-zinc-600" />
          <p className="mt-4 text-lg font-medium text-white">Cuisine prête</p>
          <p className="mt-1 text-sm text-zinc-500">
            Les commandes téléphoniques apparaîtront ici en temps réel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="glass-card rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <KpiBadge label="Nouvelles" value={newOrders.length} tone="accent" pulse={newOrders.length > 0} />
            <KpiBadge label="En cours" value={inProgressOrders.length} tone="blue" />
            <KpiBadge label="Traitées" value={handledOrders.length} tone="green" />
          </div>
          {controls}
          <p className="text-xs text-zinc-500">
            Sync{" "}
            <span className="font-mono text-zinc-400">
              {lastUpdatedAt ? lastUpdatedAt.toLocaleTimeString("fr-FR") : "--:--"}
            </span>
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <OrderColumn title="Nouvelles commandes" subtitle="À traiter en priorité" accent="accent" highlight={newOrders.length > 0}>
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

        <OrderColumn title="Traitées" subtitle="Historique récent" accent="green">
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
  tone: "accent" | "blue" | "green";
  pulse?: boolean;
}) {
  const toneClass =
    tone === "accent"
      ? "border-astor-accent/30 bg-astor-accent/10 text-teal-100"
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
  accent: "accent" | "blue" | "green";
  highlight?: boolean;
  children: ReactNode;
}) {
  const accentClass =
    accent === "accent"
      ? "border-astor-accent/25"
      : accent === "blue"
        ? "border-sky-500/25"
        : "border-emerald-500/25";

  return (
    <article
      className={`glass-card rounded-2xl p-4 ${accentClass} ${highlight ? "ring-1 ring-astor-accent/20" : ""}`}
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
      className={`rounded-xl border bg-black/40 p-4 transition hover:-translate-y-0.5 hover:border-astor-accent/30 ${
        isLate ? "border-rose-500/40" : "border-white/8"
      } ${isNew ? "animate-new-order" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-astor-accent-soft/80">
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
          <span className="inline-flex items-center gap-1 text-astor-accent-bright/90">
            <Clock className="h-3 w-3" />
            Retrait {pickup}
          </span>
        ) : null}
        <span className={isLate ? "text-rose-400" : ""}>{formatElapsed(elapsed)}</span>
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
                  {Number(item.line_total).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                </span>
              </li>
            ))}
          </ul>
          {order.notes ? (
            <p className="mt-2 rounded-lg bg-astor-accent/10 px-2 py-1.5 text-xs text-teal-100/90">
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
          {Number(order.total_amount).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
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

/** « 12 min », « 2 h 05 », « 3 j » : lisible même pour une commande ancienne. */
function formatElapsed(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")}`;
  return `${Math.floor(minutes / 1440)} j`;
}
