"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { customersToCsvRows } from "@/lib/customers";
import type { CustomerProfile } from "@/lib/customers";
import { useRestaurant } from "@/lib/restaurant-context";

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadCsv(rows: string[][], filename: string) {
  const body = rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
  const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ClientsTracker() {
  const { restaurantId } = useRestaurant();
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [expandedPhone, setExpandedPhone] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/customers?restaurantId=${restaurantId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur chargement clients");
      setCustomers(data.customers ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    }
  }, [restaurantId]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.phone.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q),
    );
  }, [customers, query]);

  function exportAll() {
    const rows = customersToCsvRows(customers);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(rows, `astor_clients_${stamp}.csv`);
  }

  function exportFiltered() {
    const rows = customersToCsvRows(filtered);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(rows, `astor_clients_filtre_${stamp}.csv`);
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-xl p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Base clients</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Profils deduits des commandes (telephone, nom, historique). Export CSV pour mailing.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void load()}
              className="cockpit-btn-ghost px-3 py-2 text-xs font-medium"
            >
              Actualiser
            </button>
            <button
              type="button"
              onClick={exportAll}
              className="cockpit-btn-primary px-3 py-2 text-xs"
            >
              Exporter tout (CSV)
            </button>
            <button
              type="button"
              onClick={exportFiltered}
              disabled={filtered.length === 0}
              className="cockpit-btn-ghost border-astor-accent/30 px-3 py-2 text-xs text-astor-accent-bright disabled:opacity-40"
            >
              Exporter filtre (CSV)
            </button>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Rechercher
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom ou telephone..."
            className="cockpit-input mt-1 w-full max-w-md px-3 py-2 text-sm"
          />
        </div>
        <p className="mt-3 text-xs text-zinc-600">
          {customers.length} client(s) uniques · {filtered.length} affiche(s)
        </p>
      </section>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-sm text-zinc-500">
            Aucun client pour ce filtre. Les profils apparaissent des la premiere commande enregistree.
          </p>
        ) : (
          filtered.map((c) => {
            const open = expandedPhone === c.phone;
            return (
              <article
                key={c.phone}
                className="glass-card overflow-hidden rounded-xl transition hover:border-astor-accent/20"
              >
                <button
                  type="button"
                  onClick={() => setExpandedPhone(open ? null : c.phone)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-white/5"
                >
                  <div>
                    <p className="font-semibold text-white">{c.name}</p>
                    <p className="text-sm text-zinc-500">{c.phone}</p>
                  </div>
                  <div className="flex items-center gap-3 text-right text-xs text-zinc-500">
                    <span>
                      {c.orderCount} commande{c.orderCount > 1 ? "s" : ""}
                    </span>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-zinc-400">
                      {open ? "Masquer" : "Historique"}
                    </span>
                  </div>
                </button>
                {open ? (
                  <div className="border-t border-white/5 bg-black/30 px-4 py-3">
                    <ul className="space-y-2">
                      {c.orders.map((o) => (
                        <li
                          key={o.id}
                          className="rounded-lg border border-white/5 bg-black/40 px-3 py-2 text-sm"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-zinc-400">
                              {new Date(o.createdAt).toLocaleString("fr-FR", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </span>
                            <span className="text-[10px] font-mono uppercase text-zinc-600">{o.status}</span>
                          </div>
                          <p className="mt-1 text-zinc-200">{o.itemsLabel}</p>
                          <p className="mt-1 text-xs text-zinc-600">
                            Total {o.totalAmount.toFixed(2)} EUR · #{o.id.slice(0, 8)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
