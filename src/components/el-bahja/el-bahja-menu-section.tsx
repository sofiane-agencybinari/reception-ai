import { Download, Droplets, GlassWater, Phone, Sparkles, UtensilsCrossed } from "lucide-react";

import {
  CATEGORY_ORDER,
  CATEGORY_TITLES,
  type MenuCategory,
  type MenuItemRow,
  formatMenuPrice,
} from "@/lib/menu-categories";
import { EL_BAHJA, EL_BAHJA_RESTAURANT_ID } from "@/lib/el-bahja";

const CATEGORY_ICONS: Record<MenuCategory, typeof UtensilsCrossed> = {
  menus: UtensilsCrossed,
  boissons: GlassWater,
  sauces: Droplets,
  autres: Sparkles,
};

type Props = {
  groupedMenu: Record<MenuCategory, MenuItemRow[]>;
  itemCount: number;
  menuError?: string | null;
};

export function ElBahjaMenuSection({ groupedMenu, itemCount, menuError }: Props) {
  const pdfUrl = `/api/menu-items/pdf?restaurantId=${EL_BAHJA_RESTAURANT_ID}`;

  return (
    <section id="carte" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-astor-accent">
            Notre carte
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Menu</h2>
          {itemCount > 0 ? (
            <p className="mt-2 text-sm text-zinc-500">{itemCount} produits disponibles</p>
          ) : null}
        </div>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-astor-accent/30 hover:text-white"
        >
          <Download className="h-3.5 w-3.5" />
          Télécharger le PDF
        </a>
      </div>

      {menuError ? (
        <div className="glass-card mt-10 rounded-2xl p-8 text-center text-sm text-rose-300">
          {menuError}
        </div>
      ) : itemCount === 0 ? (
        <div className="glass-card mt-10 rounded-2xl p-10 text-center">
          <p className="text-zinc-400">Menu en cours de chargement.</p>
          <a
            href={`tel:${EL_BAHJA.phone}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-astor-accent-soft hover:text-astor-accent-bright"
          >
            <Phone className="h-4 w-4" />
            Appelez-nous pour connaître la carte
          </a>
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {CATEGORY_ORDER.map((category) => {
            const items = groupedMenu[category];
            if (items.length === 0) return null;

            const Icon = CATEGORY_ICONS[category];

            return (
              <div key={category}>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-astor-accent/10 text-astor-accent-soft">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {CATEGORY_TITLES[category]}
                    </h3>
                    <p className="text-sm text-zinc-500">{items.length} produit{items.length > 1 ? "s" : ""}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="group glass-card flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 transition hover:border-astor-accent/25 hover:bg-white/[0.03]"
                    >
                      <span className="text-sm leading-snug text-zinc-200 group-hover:text-white">
                        {item.name}
                      </span>
                      <span className="shrink-0 rounded-lg bg-astor-accent/10 px-2.5 py-1 font-mono text-sm text-astor-accent-soft">
                        {formatMenuPrice(Number(item.price))}
                      </span>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
