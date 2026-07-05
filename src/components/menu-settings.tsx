"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";

import { DEFAULT_RESTAURANT_ID } from "@/lib/config";
import {
  CATEGORY_ORDER,
  CATEGORY_TITLES,
  type MenuCategory,
  type MenuItemRow,
  detectMenuCategory,
  formatMenuPrice,
} from "@/lib/menu-categories";

type MenuItem = MenuItemRow;

export function MenuSettings() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<MenuCategory, boolean>>({
    menus: true,
    boissons: false,
    sauces: false,
    autres: false,
  });

  const pdfUrl = `/api/menu-items/pdf?restaurantId=${DEFAULT_RESTAURANT_ID}`;

  const loadMenu = useCallback(async () => {
    const res = await fetch(`/api/menu-items?restaurantId=${DEFAULT_RESTAURANT_ID}`);
    const data = await res.json();
    if (res.ok) {
      setMenuItems(data.menuItems ?? []);
      setError(null);
    } else {
      setError(data.error ?? "Erreur chargement menu");
    }
  }, []);

  useEffect(() => {
    const firstLoad = setTimeout(() => {
      void loadMenu();
    }, 0);
    return () => clearTimeout(firstLoad);
  }, [loadMenu]);

  const sortedMenuItems = useMemo(
    () =>
      [...menuItems].sort((a, b) =>
        a.name.localeCompare(b.name, "fr", { sensitivity: "base", numeric: true }),
      ),
    [menuItems],
  );

  const groupedMenuItems = useMemo(() => {
    const groups: Record<MenuCategory, MenuItem[]> = {
      menus: [],
      boissons: [],
      sauces: [],
      autres: [],
    };
    for (const item of sortedMenuItems) {
      groups[detectMenuCategory(item.name)].push(item);
    }
    return groups;
  }, [sortedMenuItems]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const priceNumber = Number(price);
    if (!name.trim() || Number.isNaN(priceNumber) || priceNumber < 0) {
      setError("Nom et prix valides obligatoires.");
      return;
    }

    const res = await fetch("/api/menu-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: DEFAULT_RESTAURANT_ID,
        name: name.trim(),
        price: priceNumber,
        isAvailable: true,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Impossible d'ajouter le produit");
      return;
    }

    setName("");
    setPrice("");
    void loadMenu();
  }

  async function handleDownloadPdf() {
    setPdfLoading(true);
    setError(null);
    try {
      const res = await fetch(pdfUrl);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Export PDF impossible");
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      anchor.href = objectUrl;
      anchor.download = match?.[1] ?? "menu-restaurant.pdf";
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export PDF impossible");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="glass-card overflow-hidden rounded-xl">
        <div className="border-b border-white/8 bg-gradient-to-r from-astor-accent/10 via-transparent to-transparent px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-astor-accent/15 p-2 text-astor-accent-soft">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Menu PDF</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Carte professionnelle generee depuis vos produits — categories, prix EUR, pret a imprimer.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cockpit-btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
              >
                <FileText className="h-4 w-4" />
                Apercu
              </a>
              <button
                type="button"
                onClick={() => void handleDownloadPdf()}
                disabled={pdfLoading || menuItems.length === 0}
                className="cockpit-btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {pdfLoading ? "Generation…" : "Telecharger PDF"}
              </button>
            </div>
          </div>
        </div>
        <p className="px-5 py-3 text-xs text-zinc-500">
          {menuItems.length} produit{menuItems.length > 1 ? "s" : ""} — mise a jour automatique a chaque export.
        </p>
      </section>

      <section className="glass-card rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white">Ajouter un produit</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            className="cockpit-input px-3 py-2 text-sm"
            placeholder="Nom produit"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            className="cockpit-input px-3 py-2 text-sm"
            placeholder="Prix"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
          <button type="submit" className="cockpit-btn-primary px-3 py-2 text-sm">
            Ajouter
          </button>
        </form>
        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
      </section>

      <section className="glass-card rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white">Menu actuel</h2>
        <div className="mt-4 space-y-3">
          {CATEGORY_ORDER.map((category) => {
            const items = groupedMenuItems[category];
            const isOpen = expanded[category];

            return (
              <article key={category} className="overflow-hidden rounded-xl border border-white/8 bg-black/30">
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [category]: !prev[category],
                    }))
                  }
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left transition hover:bg-white/5"
                >
                  <span className="font-medium text-zinc-200">
                    {CATEGORY_TITLES[category]} ({items.length})
                  </span>
                  <span className="text-lg text-zinc-500">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen ? (
                  <ul className="space-y-2 border-t border-white/5 p-3">
                    {items.length === 0 ? (
                      <li className="text-sm text-zinc-500">Aucun produit</li>
                    ) : (
                      items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between rounded-lg border border-white/5 bg-black/40 px-3 py-2 transition hover:border-astor-accent/25"
                        >
                          <span className={item.is_available ? "text-zinc-200" : "text-zinc-500 line-through"}>
                            {item.name}
                          </span>
                          <span className="font-mono text-sm text-astor-accent-soft/90">
                            {formatMenuPrice(Number(item.price))}
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
