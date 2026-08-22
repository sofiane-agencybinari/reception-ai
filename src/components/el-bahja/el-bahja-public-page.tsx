import Link from "next/link";
import {
  Clock,
  Download,
  MapPin,
  Phone,
  UtensilsCrossed,
} from "lucide-react";

import {
  CATEGORY_ORDER,
  CATEGORY_TITLES,
  type MenuCategory,
  type MenuItemRow,
  formatMenuPrice,
} from "@/lib/menu-categories";
import { EL_BAHJA, EL_BAHJA_RESTAURANT_ID } from "@/lib/el-bahja";

type Props = {
  groupedMenu: Record<MenuCategory, MenuItemRow[]>;
  itemCount: number;
  menuError?: string | null;
};

export function ElBahjaPublicPage({ groupedMenu, itemCount, menuError }: Props) {
  const pdfUrl = `/api/menu-items/pdf?restaurantId=${EL_BAHJA_RESTAURANT_ID}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="marketing-grid pointer-events-none fixed inset-0 opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-astor-accent/10 blur-[100px]" />

      <header className="relative z-20 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-astor-accent-soft to-teal-800 text-sm font-bold text-white shadow-lg shadow-astor-accent/20">
              EB
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-white">{EL_BAHJA.name}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Montpellier</p>
            </div>
          </div>
          <a
            href={`tel:${EL_BAHJA.phone}`}
            className="hidden items-center gap-2 rounded-full bg-astor-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-astor-accent-soft sm:inline-flex"
          >
            <Phone className="h-4 w-4" />
            Appeler
          </a>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-28 pt-10 sm:pb-16">
        <section className="animate-fade-up text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-astor-accent/20 bg-astor-accent/10 px-4 py-1.5 text-xs font-medium text-teal-100">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            {EL_BAHJA.tagline}
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Bienvenue chez <span className="text-gradient">{EL_BAHJA.name}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-400">
            Commandez vos sandwichs, assiettes et formules par telephone — retrait sur place ou a
            emporter.
          </p>
          <a
            href={`tel:${EL_BAHJA.phone}`}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-astor-accent px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-astor-accent-soft"
          >
            <Phone className="h-4 w-4" />
            Commander par telephone
          </a>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          <article className="glass-card rounded-2xl p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-astor-accent/10 text-astor-accent-soft">
              <MapPin className="h-4 w-4" />
            </div>
            <h2 className="mt-3 text-sm font-semibold text-white">Adresse</h2>
            <p className="mt-1 text-sm text-zinc-400">{EL_BAHJA.address}</p>
            <p className="text-sm text-zinc-400">{EL_BAHJA.city}</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${EL_BAHJA.address}, ${EL_BAHJA.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs font-medium text-astor-accent-soft hover:text-astor-accent-bright"
            >
              Voir sur la carte →
            </a>
          </article>

          <article className="glass-card rounded-2xl p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-astor-accent/10 text-astor-accent-soft">
              <Phone className="h-4 w-4" />
            </div>
            <h2 className="mt-3 text-sm font-semibold text-white">Telephone</h2>
            <a
              href={`tel:${EL_BAHJA.phone}`}
              className="mt-1 block text-sm font-medium text-astor-accent-soft hover:text-astor-accent-bright"
            >
              {EL_BAHJA.phoneDisplay}
            </a>
            <p className="mt-2 text-xs text-zinc-500">Appelez pour passer commande</p>
          </article>

          <article className="glass-card rounded-2xl p-5 sm:col-span-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-astor-accent/10 text-astor-accent-soft">
              <Clock className="h-4 w-4" />
            </div>
            <h2 className="mt-3 text-sm font-semibold text-white">Horaires</h2>
            <ul className="mt-2 space-y-1.5">
              {EL_BAHJA.hours.map((slot) => (
                <li key={slot.days} className="flex justify-between gap-2 text-sm">
                  <span className="text-zinc-400">{slot.days}</span>
                  <span className="font-medium text-zinc-200">{slot.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-zinc-600">Horaires indicatifs</p>
          </article>
        </section>

        <section className="mt-14" id="menu">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-astor-accent">
                Notre carte
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">Menu</h2>
              {itemCount > 0 ? (
                <p className="mt-1 text-sm text-zinc-500">{itemCount} produits disponibles</p>
              ) : null}
            </div>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:border-astor-accent/30 hover:text-white"
            >
              <Download className="h-3.5 w-3.5" />
              Telecharger le PDF
            </a>
          </div>

          {menuError ? (
            <div className="glass-card mt-6 rounded-2xl p-6 text-center text-sm text-rose-300">
              {menuError}
            </div>
          ) : itemCount === 0 ? (
            <div className="glass-card mt-6 rounded-2xl p-8 text-center">
              <p className="text-zinc-400">Menu en cours de chargement.</p>
              <a
                href={`tel:${EL_BAHJA.phone}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-astor-accent-soft hover:text-astor-accent-bright"
              >
                <Phone className="h-4 w-4" />
                Appelez-nous pour connaitre la carte
              </a>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {CATEGORY_ORDER.map((category) => {
                const items = groupedMenu[category];
                if (items.length === 0) return null;

                return (
                  <article key={category} className="glass-card overflow-hidden rounded-2xl">
                    <div className="border-b border-white/8 bg-gradient-to-r from-astor-accent/10 via-transparent to-transparent px-5 py-4">
                      <h3 className="font-semibold text-white">
                        {CATEGORY_TITLES[category]}
                        <span className="ml-2 text-sm font-normal text-zinc-500">
                          ({items.length})
                        </span>
                      </h3>
                    </div>
                    <ul className="divide-y divide-white/5">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-white/[0.02]"
                        >
                          <span className="text-sm text-zinc-200">{item.name}</span>
                          <span className="shrink-0 font-mono text-sm text-astor-accent-soft">
                            {formatMenuPrice(Number(item.price))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-14">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-astor-accent via-teal-700 to-slate-900 px-8 py-12 text-center">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white">Pret a commander ?</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-teal-100/80">
                Passez votre commande par telephone — emporter ou sur place. Notre equipe vous
                accueille au {EL_BAHJA.address}.
              </p>
              <a
                href={`tel:${EL_BAHJA.phone}`}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-teal-900 transition hover:bg-teal-50"
              >
                <Phone className="h-4 w-4" />
                {EL_BAHJA.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-6 text-center text-xs text-zinc-600">
        <p>
          {EL_BAHJA.name} · {EL_BAHJA.address}, {EL_BAHJA.city}
        </p>
        <p className="mt-2">
          Propulse par{" "}
          <Link href="/" className="text-zinc-500 transition hover:text-astor-accent-soft">
            ASTOR
          </Link>
        </p>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/90 p-4 backdrop-blur-xl sm:hidden">
        <a
          href={`tel:${EL_BAHJA.phone}`}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-astor-accent py-3.5 text-sm font-semibold text-white transition hover:bg-astor-accent-soft"
        >
          <Phone className="h-4 w-4" />
          Commander par telephone
        </a>
      </div>
    </div>
  );
}
