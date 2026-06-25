"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { customersToCsvRows } from "@/lib/customers";
import type { CustomerProfile } from "@/lib/customers";
import { DEFAULT_RESTAURANT_ID } from "@/lib/config";

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
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [expandedPhone, setExpandedPhone] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/customers?restaurantId=${DEFAULT_RESTAURANT_ID}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur chargement clients");
      setCustomers(data.customers ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    }
  }, []);

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
      <section className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 text-slate-100">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Base clients</h2>
            <p className="mt-1 text-sm text-slate-400">
              Profils deduits des commandes (telephone, nom, historique et dates). Export CSV pour
              outils mailing.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void load()}
              className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-indigo-400 hover:text-white"
            >
              Actualiser
            </button>
            <button
              type="button"
              onClick={exportAll}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-500"
            >
              Exporter tout (CSV)
            </button>
            <button
              type="button"
              onClick={exportFiltered}
              disabled={filtered.length === 0}
              className="rounded-lg border border-indigo-500/50 px-3 py-2 text-xs font-medium text-indigo-200 transition hover:bg-indigo-500/10 disabled:opacity-40"
            >
              Exporter filtre (CSV)
            </button>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Rechercher
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom ou telephone..."
            className="mt-1 w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-500"
          />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {customers.length} client(s) uniques · {filtered.length} affiche(s)
        </p>
      </section>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
            Aucun client pour ce filtre. Les profils apparaissent des la premiere commande enregistree
            dans Supabase.
          </p>
        ) : (
          filtered.map((c) => {
            const open = expandedPhone === c.phone;
            return (
              <article
                key={c.phone}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 text-slate-100 transition hover:border-indigo-500/40"
              >
                <button
                  type="button"
                  onClick={() => setExpandedPhone(open ? null : c.phone)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-900/80"
                >
                  <div>
                    <p className="font-semibold text-white">{c.name}</p>
                    <p className="text-sm text-slate-400">{c.phone}</p>
                  </div>
                  <div className="flex items-center gap-3 text-right text-xs text-slate-400">
                    <span>
                      {c.orderCount} commande{c.orderCount > 1 ? "s" : ""}
                    </span>
                    <span className="rounded-full border border-slate-600 px-2 py-0.5 text-slate-300">
                      {open ? "Masquer" : "Historique"}
                    </span>
                  </div>
                </button>
                {open ? (
                  <div className="border-t border-slate-800 bg-slate-900/50 px-4 py-3">
                    <ul className="space-y-2">
                      {c.orders.map((o) => (
                        <li
                          key={o.id}
                          className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-slate-300">
                              {new Date(o.createdAt).toLocaleString("fr-FR", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </span>
                            <span className="text-xs uppercase text-slate-500">{o.status}</span>
                          </div>
                          <p className="mt-1 text-slate-200">{o.itemsLabel}</p>
                          <p className="mt-1 text-xs text-slate-500">
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
