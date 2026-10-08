"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** Emil ease-out — snappy settle. */
const ease = [0.23, 1, 0.32, 1] as const;

type ProductId = "reception" | "cuisine" | "pilotage";

type Product = {
  id: ProductId;
  name: string;
  tagline: string;
  body: string;
  note: string;
  specs: { label: string; value: string }[];
  ambient: string;
  cta: string;
  href: string;
};

const PRODUCTS: Product[] = [
  {
    id: "reception",
    name: "Réception",
    tagline: "Léger. Vocal. Toujours décroche.",
    body: "Le cœur de LIGNE : un agent qui répond en français, prend la commande à la voix et ne rate jamais un appel — même quand la cuisine tourne à fond.",
    note: "Déployé en < 24 h · Sans engagement",
    specs: [
      { label: "Réponse", value: "< 2 s" },
      { label: "Lignes", value: "Jusqu’à 10" },
      { label: "Langue", value: "FR natif" },
      { label: "Dispo", value: "24 h / 24" },
    ],
    ambient:
      "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(61,155,143,0.28), transparent 55%), linear-gradient(180deg, #0a1a18 0%, #050708 55%, #030405 100%)",
    cta: "Essayer la démo",
    href: "/demo-pizza",
  },
  {
    id: "cuisine",
    name: "Cuisine",
    tagline: "Rapide. Clair. Zéro post-it.",
    body: "Dès que le client raccroche, le bon s’affiche sur l’écran cuisine. SMS de confirmation au client. Aucune ressaisie — le service enchaîne.",
    note: "Écran temps réel · SMS inclus",
    specs: [
      { label: "Affichage", value: "Instantané" },
      { label: "SMS", value: "Auto" },
      { label: "Saisie", value: "0 manuelle" },
      { label: "Rush", value: "Prêt" },
    ],
    ambient:
      "radial-gradient(ellipse 80% 60% at 55% 25%, rgba(212,184,150,0.18), transparent 50%), linear-gradient(180deg, #14100c 0%, #08090b 55%, #030405 100%)",
    cta: "Voir le parcours",
    href: "/#comment",
  },
  {
    id: "pilotage",
    name: "Pilotage",
    tagline: "Puissant. Multi-sites. Mesurable.",
    body: "Tableau de bord, historique, base clients et exports. Un ou plusieurs restaurants — LIGNE centralise les appels et le CA téléphone.",
    note: "Offre Business · Support dédié",
    specs: [
      { label: "Sites", value: "Multi" },
      { label: "CA", value: "Temps réel" },
      { label: "Export", value: "CSV" },
      { label: "Support", value: "< 1 h" },
    ],
    ambient:
      "radial-gradient(ellipse 70% 55% at 45% 15%, rgba(142,217,205,0.2), transparent 50%), linear-gradient(180deg, #0c1218 0%, #06080c 55%, #030405 100%)",
    cta: "Demander un essai",
    href: "/#essai",
  },
];

/**
 * Seasats-inspired product stage: switch modeled service “vessels”,
 * crossfade copy + 3D-ish model, pill dock at bottom.
 * Purpose: Explanation (marketing) + State indication on tab change.
 */
export function MarketingProductShowcase() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<ProductId>("reception");
  const product = PRODUCTS.find((p) => p.id === active)!;

  return (
    <section
      id="produits"
      className="relative isolate min-h-[100svh] overflow-hidden"
      aria-label="Les services LIGNE"
    >
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ background: product.ambient }}
        transition={{ duration: reduce ? 0 : 0.7, ease }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to top, black, transparent)",
        }}
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col px-6 pb-36 pt-28 lg:pb-32 lg:pt-32">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-astor-accent">
          Engineered for every rush
        </p>

        <div className="mt-6 grid flex-1 gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14">
          <div className="relative z-20 max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.38, ease }}
              >
                <h2 className="font-display text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[0.92] tracking-[-0.03em] text-white">
                  {product.name}
                </h2>
                <p className="mt-4 text-lg font-medium text-astor-sand/90">{product.tagline}</p>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-zinc-400">
                  {product.body}
                </p>
                <p className="mt-4 text-sm text-zinc-500">{product.note}</p>

                <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/[0.08] pt-6 sm:grid-cols-4">
                  {product.specs.map((s) => (
                    <div key={s.label}>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                        {s.label}
                      </dt>
                      <dd className="mt-1 font-display text-lg font-semibold text-white">
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <a
                  href={product.href}
                  className="marketing-btn marketing-btn-lift mt-8 inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 hover:bg-stone-100"
                >
                  {product.cta}
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 flex min-h-[280px] items-end justify-center sm:min-h-[360px] lg:min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                className="relative w-full max-w-lg"
                initial={reduce ? false : { opacity: 0, y: 28, scale: 0.96, rotateY: -8 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.5, ease }}
                style={{ perspective: 1200 }}
              >
                {product.id === "reception" ? <ModelReception reduce={!!reduce} /> : null}
                {product.id === "cuisine" ? <ModelCuisine reduce={!!reduce} /> : null}
                {product.id === "pilotage" ? <ModelPilotage reduce={!!reduce} /> : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Seasats-style bottom pill dock */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center px-4 sm:bottom-8">
        <nav
          className="pointer-events-auto flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.65)]"
          aria-label="Choisir un service LIGNE"
        >
          {PRODUCTS.map((p) => {
            const isActive = p.id === active;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(p.id)}
                className={`relative flex items-center gap-2 rounded-full px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 sm:px-4 ${
                  isActive ? "text-slate-900" : "text-zinc-500 hover:text-zinc-800"
                }`}
                aria-pressed={isActive}
              >
                {isActive ? (
                  <motion.span
                    layoutId="product-dock-pill"
                    className="absolute inset-0 rounded-full bg-zinc-100"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="relative z-10 flex items-center gap-2">
                  <ProductSilhouette id={p.id} />
                  <span className="hidden xs:inline sm:inline">{p.name}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}

function ProductSilhouette({ id }: { id: ProductId }) {
  if (id === "reception") {
    return (
      <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden className="shrink-0">
        <rect x="1" y="2" width="8" height="10" rx="1.5" fill="currentColor" />
        <path
          d="M11 4h8a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-8V4Z"
          fill="currentColor"
          opacity="0.55"
        />
        <circle cx="5" cy="11" r="0.8" fill="#fff" />
      </svg>
    );
  }
  if (id === "cuisine") {
    return (
      <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden className="shrink-0">
        <rect x="2" y="1.5" width="18" height="11" rx="1.5" fill="currentColor" />
        <rect x="4" y="3.5" width="8" height="5" rx="0.5" fill="#fff" opacity="0.35" />
        <rect x="13.5" y="3.5" width="4.5" height="1.2" fill="#fff" opacity="0.5" />
        <rect x="13.5" y="5.5" width="3.5" height="1.2" fill="#fff" opacity="0.35" />
      </svg>
    );
  }
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden className="shrink-0">
      <rect x="1" y="3" width="6" height="8" rx="1" fill="currentColor" opacity="0.45" />
      <rect x="8" y="1.5" width="6" height="11" rx="1" fill="currentColor" />
      <rect x="15" y="3" width="6" height="8" rx="1" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

/** Modeled “Réception” — phone + voice ring, soft float. */
function ModelReception({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px]">
      <motion.div
        className="absolute inset-x-[8%] bottom-[6%] top-[12%] rounded-[2rem] border border-white/[0.1] bg-gradient-to-br from-[#1a2228] via-[#0d1216] to-[#07090b] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.04)_inset]"
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: "perspective(1200px) rotateX(8deg) rotateY(-12deg)" }}
      >
        <div className="absolute inset-x-6 top-5 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Appel
          </span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
        </div>
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center px-8">
          <div className="relative flex h-24 w-24 items-center justify-center">
            {!reduce ? (
              <>
                <span className="absolute inset-0 animate-ping rounded-full border border-astor-accent/30" />
                <span className="absolute inset-3 rounded-full border border-astor-accent/20" />
              </>
            ) : null}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-astor-accent/20 text-astor-accent">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.1 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-center font-display text-xl font-bold text-white">LIGNE</p>
          <p className="mt-1 text-center text-xs text-zinc-500">Réceptionniste vocal</p>
          <div className="mt-8 w-full space-y-2">
            <div className="rounded-xl bg-white/[0.04] px-3 py-2 text-[11px] text-zinc-400">
              « Une Margherita et un Coca… »
            </div>
            <div className="rounded-xl border border-astor-accent/25 bg-astor-accent/10 px-3 py-2 text-[11px] text-stone-200">
              Noté. Emporter ou livraison ?
            </div>
          </div>
        </div>
      </motion.div>
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle,rgba(61,155,143,0.25),transparent_65%)] blur-2xl" />
    </div>
  );
}

/** Modeled “Cuisine” — kitchen ticket screen. */
function ModelCuisine({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[420px]">
      <motion.div
        className="absolute inset-0 rounded-2xl border border-white/[0.08] bg-[#0a0c0e] shadow-[0_40px_80px_-28px_rgba(0,0,0,0.95)]"
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: "perspective(1200px) rotateX(6deg) rotateY(10deg)" }}
      >
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Cuisine
          </span>
        </div>
        <div className="space-y-3 p-4">
          <Ticket
            id="AST-2847"
            badge="Nouvelle"
            items={["1× Margherita", "1× Orientale", "1× Coca"]}
            time="14:45"
            highlight
          />
          <Ticket
            id="AST-2846"
            badge="Prep"
            items={["2× Menu Classique"]}
            time="14:32"
          />
        </div>
      </motion.div>
      <motion.div
        className="absolute -right-2 top-8 z-20 max-w-[160px] rounded-xl border border-astor-accent/30 bg-[#0d1412]/95 px-3 py-2.5 shadow-xl backdrop-blur"
        initial={reduce ? false : { opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.45, ease }}
      >
        <p className="text-[10px] font-semibold text-astor-accent">Commande envoyée</p>
        <p className="mt-0.5 text-[10px] text-zinc-500">Cuisine · SMS client</p>
      </motion.div>
      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(212,184,150,0.15),transparent_65%)] blur-2xl" />
    </div>
  );
}

function Ticket({
  id,
  badge,
  items,
  time,
  highlight,
}: {
  id: string;
  badge: string;
  items: string[];
  time: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3.5 py-3 ${
        highlight
          ? "border-astor-accent/35 bg-astor-accent/10"
          : "border-white/[0.06] bg-white/[0.03]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-white">{id}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
            highlight ? "bg-emerald-400/20 text-emerald-300" : "bg-white/5 text-zinc-500"
          }`}
        >
          {badge}
        </span>
      </div>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item} className="text-xs text-zinc-300">
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] text-zinc-600">Retrait {time}</p>
    </div>
  );
}

/** Modeled “Pilotage” — multi-panel dashboard. */
function ModelPilotage({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[440px]">
      <motion.div
        className="absolute inset-0 grid grid-cols-[0.9fr_1.1fr] gap-3"
        animate={reduce ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="rounded-2xl border border-white/[0.08] bg-[#0b0f14] p-3 shadow-2xl"
          style={{ transform: "perspective(900px) rotateY(-8deg)" }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Aujourd’hui
          </p>
          <p className="mt-3 font-display text-3xl font-bold text-white">18</p>
          <p className="text-xs text-zinc-500">commandes</p>
          <p className="mt-4 font-display text-2xl font-bold text-astor-accent">1 247 €</p>
          <p className="text-xs text-zinc-500">CA téléphone</p>
          <div className="mt-5 flex h-16 items-end gap-1">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-astor-accent/40"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div
          className="flex flex-col gap-3"
          style={{ transform: "perspective(900px) rotateY(6deg)" }}
        >
          {["Lyon · Centre", "Lyon · Part-Dieu", "Villeurbanne"].map((site, i) => (
            <div
              key={site}
              className="flex flex-1 items-center justify-between rounded-xl border border-white/[0.07] bg-[#0b0f14] px-3.5 py-3"
            >
              <div>
                <p className="text-xs font-medium text-white">{site}</p>
                <p className="text-[10px] text-zinc-500">{i === 0 ? "En ligne" : "En ligne"}</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
          ))}
        </div>
      </motion.div>
      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(142,217,205,0.18),transparent_65%)] blur-2xl" />
    </div>
  );
}
