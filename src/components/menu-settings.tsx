"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { DEFAULT_RESTAURANT_ID } from "@/lib/config";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
};

type MenuCategory = "menus" | "boissons" | "sauces" | "autres";

const CATEGORY_TITLES: Record<MenuCategory, string> = {
  menus: "Menus",
  boissons: "Boissons",
  sauces: "Sauces",
  autres: "Autres",
};

function detectCategory(name: string): MenuCategory {
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (
    normalized.includes("menu") ||
    normalized.includes("burger") ||
    normalized.includes("tacos") ||
    normalized.includes("sandwich")
  ) {
    return "menus";
  }

  if (
    normalized.includes("boisson") ||
    normalized.includes("coca") ||
    normalized.includes("sprite") ||
    normalized.includes("fanta") ||
    normalized.includes("eau") ||
    normalized.includes("jus")
  ) {
    return "boissons";
  }

  if (
    normalized.includes("sauce") ||
    normalized.includes("ketchup") ||
    normalized.includes("mayo") ||
    normalized.includes("mayonnaise") ||
    normalized.includes("harissa")
  ) {
    return "sauces";
  }

  return "autres";
}

export function MenuSettings() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<MenuCategory, boolean>>({
    menus: true,
    boissons: false,
    sauces: false,
    autres: false,
  });

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
      groups[detectCategory(item.name)].push(item);
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

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 text-slate-100">
        <h2 className="text-lg font-semibold text-white">Ajouter un produit</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
            placeholder="Nom produit"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
            placeholder="Prix"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-500"
          >
            Ajouter
          </button>
        </form>
        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 text-slate-100">
        <h2 className="text-lg font-semibold text-white">Menu actuel</h2>
        <div className="mt-4 space-y-3">
          {(Object.keys(CATEGORY_TITLES) as MenuCategory[]).map((category) => {
            const items = groupedMenuItems[category];
            const isOpen = expanded[category];

            return (
              <article key={category} className="rounded-lg border border-slate-700 bg-slate-900/70">
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [category]: !prev[category],
                    }))
                  }
                  className="flex w-full items-center justify-between px-3 py-2 text-left transition hover:bg-slate-800/60"
                >
                  <span className="font-medium text-slate-100">
                    {CATEGORY_TITLES[category]} ({items.length})
                  </span>
                  <span className="text-lg text-slate-300">{isOpen ? "-" : "+"}</span>
                </button>

                {isOpen ? (
                  <ul className="space-y-2 border-t border-slate-800 p-3">
                    {items.length === 0 ? (
                      <li className="text-sm text-slate-400">Aucun produit</li>
                    ) : (
                      items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 transition hover:border-indigo-500/60"
                        >
                          <span className="text-slate-100">{item.name}</span>
                          <span className="text-sm text-slate-300">
                            {Number(item.price).toFixed(2)} EUR
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
