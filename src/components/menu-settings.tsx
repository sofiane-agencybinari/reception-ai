"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import { DEFAULT_RESTAURANT_ID } from "@/lib/config";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
};

export function MenuSettings() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

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
      <section className="rounded-xl border border-indigo-200 bg-white/90 p-5 text-slate-900">
        <h2 className="text-lg font-semibold text-slate-900">Ajouter un produit</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Nom produit"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Prix"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-white transition hover:bg-indigo-500"
          >
            Ajouter
          </button>
        </form>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </section>

      <section className="rounded-xl border border-indigo-200 bg-white/90 p-5 text-slate-900">
        <h2 className="text-lg font-semibold text-slate-900">Menu actuel</h2>
        <ul className="mt-4 space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
            >
              <span className="text-slate-900">{item.name}</span>
              <span className="text-sm text-slate-600">
                {Number(item.price).toFixed(2)} EUR
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
