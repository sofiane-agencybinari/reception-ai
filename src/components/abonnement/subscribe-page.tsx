"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  BarChart3,
  Bell,
  Check,
  ChefHat,
  Clock,
  Headphones,
  Loader2,
  Lock,
  MessageSquare,
  PhoneCall,
  PhoneIncoming,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { AstorLogo } from "@/components/astor-logo";
import { PRICING_PLANS } from "@/components/marketing/marketing-data";
import { MarketingTrialForm } from "@/components/marketing/marketing-trial-form";

type PlanId = (typeof PRICING_PLANS)[number]["id"];

const EASE = [0.23, 1, 0.32, 1] as const;
const eur = (v: number, digits = 0) =>
  v.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Ce que le restaurateur obtient, partie par partie. `from` = formule à partir de laquelle c'est inclus. */
const BENEFITS = [
  {
    icon: PhoneIncoming,
    title: "Plus jamais d’appel raté",
    text: "Ligne décroche en moins de 2 secondes, 24h/24, même en plein rush ou quand la salle est pleine. Le client n’entend plus jamais la sonnerie dans le vide.",
    from: "essentiel",
  },
  {
    icon: MessageSquare,
    title: "La commande prise comme par un équipier",
    text: "Plats, menus, cuissons, sauces, suppléments, boissons, desserts, à emporter ou en livraison : l’agent connaît votre carte et récapitule avant de valider.",
    from: "essentiel",
  },
  {
    icon: ChefHat,
    title: "Directement en cuisine",
    text: "La commande s’affiche sur l’écran cuisine avec un signal sonore. Plus de bon griffonné, plus d’erreur de prise de note.",
    from: "essentiel",
  },
  {
    icon: Clock,
    title: "Un temps d’attente juste",
    text: "Ligne annonce l’heure de retrait en tenant compte des commandes déjà en cours. Le client sait quand venir, la cuisine n’est pas débordée.",
    from: "essentiel",
  },
  {
    icon: Bell,
    title: "SMS de confirmation au client",
    text: "Chaque client reçoit sa commande et son heure de retrait par SMS. Moins d’appels « c’est prêt ? », moins de commandes oubliées.",
    from: "essentiel",
  },
  {
    icon: PhoneCall,
    title: "Plusieurs appels en même temps",
    text: "2 appels simultanés en Essentiel, 4 en Pro, 10 en Business. Au rush de 12 h 30, c’est la différence entre un client servi et un client parti chez le concurrent.",
    from: "essentiel",
  },
  {
    icon: BarChart3,
    title: "Vos chiffres, en clair",
    text: "Chiffre d’affaires du jour et du mois, produits les plus vendus, ce que Ligne vous a rapporté, exports pour votre comptable.",
    from: "pro",
  },
  {
    icon: Users,
    title: "Votre base clients",
    text: "Historique par client, clients fidèles, fiches complétées par lien SMS (prénom, e-mail, anniversaire) pour vos offres.",
    from: "pro",
  },
  {
    icon: Headphones,
    title: "Chaque appel réécoutable",
    text: "Résumé, conversation écrite et enregistrement de chaque appel : vous savez exactement ce qui a été dit à vos clients.",
    from: "pro",
  },
  {
    icon: Sparkles,
    title: "Relais humain et sur-mesure",
    text: "Transfert vers un membre de l’équipe quand le client le demande, ton et promotions personnalisés, un numéro par établissement.",
    from: "business",
  },
] as const;

const PLAN_RANK: Record<string, number> = { essentiel: 0, pro: 1, business: 2 };
const PLAN_LINES: Record<string, number> = { essentiel: 2, pro: 4, business: 10 };

/** Formule conseillée selon le volume d'appels par jour. */
function recommendedPlan(callsPerDay: number): PlanId {
  if (callsPerDay > 45) return "business";
  if (callsPerDay > 12) return "pro";
  return "essentiel";
}

export function SubscribePage() {
  const params = useSearchParams();
  const initial = PRICING_PLANS.find((p) => p.id === params.get("plan"))?.id ?? "pro";
  const [plan, setPlan] = useState<PlanId>(initial);
  const [callsPerDay, setCallsPerDay] = useState(25);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const selected = PRICING_PLANS.find((p) => p.id === plan)!;
  const recommended = recommendedPlan(callsPerDay);
  const minutesPerMonth = callsPerDay * 30 * 2;

  const estimates = useMemo(
    () =>
      PRICING_PLANS.map((p) => ({
        id: p.id,
        name: p.name,
        total: p.price + minutesPerMonth * p.perMinute,
      })),
    [minutesPerMonth],
  );

  async function pay() {
    setPaying(true);
    setPayError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (res.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      setPayError(data.error ?? "Impossible d’ouvrir le paiement. Réessayez.");
    } catch {
      setPayError("Connexion impossible. Réessayez.");
    }
    setPaying(false);
  }

  return (
    <div className="lx min-h-screen bg-[#ebe6de] text-[#1a1816]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-10">
        <Link href="/" aria-label="Ligne — accueil">
          <AstorLogo size={30} />
        </Link>
        <ol className="hidden items-center gap-3 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-[#8a8175] sm:flex">
          <li className="text-[#5c2a36]">1. Formule</li>
          <li aria-hidden>→</li>
          <li>2. Paiement</li>
          <li aria-hidden>→</li>
          <li>3. Installation</li>
        </ol>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-36 sm:px-10 sm:pb-28">
        {/* Accroche */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="pt-10 sm:pt-16"
        >
          <p className="lx-label">Abonnement</p>
          <h1 className="mt-5 max-w-[18ch] font-sans text-[clamp(2.3rem,6vw,5rem)] font-medium leading-[1.02] tracking-[-0.045em]">
            Votre téléphone ne sonnera <span className="text-[#5c2a36]">plus jamais dans le vide.</span>
          </h1>
          <p className="mt-6 max-w-xl font-serif text-[clamp(1.05rem,1.6vw,1.3rem)] leading-snug text-[#5c574f]">
            Ligne décroche, prend la commande et l’envoie en cuisine. Installé en 24 h, à distance, sans engagement.
          </p>
        </motion.section>

        {/* Avantages, partie par partie */}
        <section className="mt-20 sm:mt-28">
          <p className="lx-label">Ce que vous obtenez</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b, i) => {
              const included = PLAN_RANK[plan] >= PLAN_RANK[b.from];
              const Icon = b.icon;
              return (
                <motion.article
                  key={b.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
                  className={`relative rounded-[22px] border p-6 transition-all duration-500 ${
                    included ? "border-[#1a1816]/10 bg-[#f3f0ed]" : "border-dashed border-[#1a1816]/15 bg-transparent opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`grid h-10 w-10 place-items-center rounded-full ${included ? "bg-[#5c2a36] text-[#f2efe8]" : "bg-[#1a1816]/10 text-[#5c574f]"}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.18em] text-[#8a8175]">
                      {b.from === "essentiel" ? "Toutes formules" : b.from === "pro" ? "Pro et Business" : "Business"}
                    </span>
                  </div>
                  <h3 className="mt-5 text-[1.15rem] font-medium tracking-[-0.02em]">{b.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#5c574f]">{b.text}</p>
                  {!included ? (
                    <button
                      type="button"
                      onClick={() => setPlan(b.from as PlanId)}
                      className="mt-4 text-[13px] font-medium text-[#5c2a36] underline underline-offset-4"
                    >
                      Passer en {b.from === "pro" ? "Pro" : "Business"} pour l’avoir
                    </button>
                  ) : null}
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* Comment fonctionne le forfait */}
        <section className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <p className="lx-label">Comment fonctionne le forfait</p>
            <h2 className="mt-5 font-sans text-[clamp(1.8rem,3.6vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em]">
              Un abonnement fixe, <span className="text-[#5c2a36]">plus les minutes réellement parlées.</span>
            </h2>
            <ul className="mt-8 space-y-4 text-[15px] leading-relaxed text-[#5c574f]">
              <li className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-[#5c2a36]" />Un prix mensuel selon la formule : 49, 99 ou 199 €.</li>
              <li className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-[#5c2a36]" />Les minutes d’appel facturées à l’usage en fin de mois, moins chères à chaque formule.</li>
              <li className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-[#5c2a36]" />Sans engagement : vous arrêtez quand vous voulez, d’un mois sur l’autre.</li>
              <li className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-[#5c2a36]" />Installation à distance en 24 h incluse, sans frais de mise en service.</li>
            </ul>
          </div>

          <div className="rounded-[26px] bg-[#1a1816] p-7 text-[#f2efe8] sm:p-9">
            <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-[#d9a3b0]">Estimez votre mois</p>
            <label className="mt-5 block text-[15px]">
              Appels reçus par jour : <span className="font-semibold">{callsPerDay}</span>
              <input
                type="range"
                min={3}
                max={80}
                value={callsPerDay}
                onChange={(e) => setCallsPerDay(Number(e.target.value))}
                className="mt-3 w-full accent-[#d9a3b0]"
              />
            </label>
            <p className="mt-1 text-[12px] text-white/45">Base : 2 minutes par appel, 30 jours, soit {minutesPerMonth} minutes.</p>
            <ul className="mt-6 space-y-2">
              {estimates.map((e) => (
                <li
                  key={e.id}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
                    e.id === recommended ? "bg-[#5c2a36]" : "bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {e.name}
                    {e.id === recommended ? (
                      <span className="rounded-full bg-[#f2efe8] px-2 py-0.5 text-[10px] font-medium text-[#5c2a36]">conseillé</span>
                    ) : null}
                  </span>
                  <span className="tabular-nums">≈ {eur(e.total)} / mois</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[13px] leading-relaxed text-white/60">
              À {callsPerDay} appels par jour, votre rush peut amener plusieurs appels en même temps. Avec{" "}
              {PRICING_PLANS.find((p) => p.id === recommended)!.name}, jusqu’à {PLAN_LINES[recommended]} clients sont servis
              simultanément.
            </p>
            {recommended !== plan ? (
              <button
                type="button"
                onClick={() => setPlan(recommended)}
                className="mt-5 h-11 w-full rounded-full bg-[#f2efe8] text-[14px] font-medium text-[#1a1816] transition-colors hover:bg-white"
              >
                Choisir {PRICING_PLANS.find((p) => p.id === recommended)!.name}
              </button>
            ) : null}
          </div>
        </section>

        {/* Choix de la formule */}
        <section id="formules" className="mt-24">
          <p className="lx-label">Votre formule</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:items-center">
            {PRICING_PLANS.map((p) => {
              const on = p.id === plan;
              const hot = p.id !== "essentiel";
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  onClick={() => setPlan(p.id)}
                  aria-pressed={on}
                  whileHover={{ y: -6 }}
                  animate={{ scale: on ? 1.03 : 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className={`relative flex flex-col rounded-[26px] p-7 text-left transition-colors sm:p-8 ${
                    on
                      ? "bg-[#5c2a36] text-[#f2efe8] shadow-[0_40px_80px_-30px_rgba(92,42,54,0.6)]"
                      : "border border-[#1a1816]/12 bg-[#f3f0ed] hover:border-[#1a1816]/35"
                  } ${p.id === "pro" ? "lg:py-12" : ""}`}
                >
                  {p.id === "pro" ? (
                    <span className={`absolute -top-3 left-7 rounded-full px-3 py-1 font-serif text-[13px] italic ${on ? "bg-[#f2efe8] text-[#5c2a36]" : "bg-[#5c2a36] text-[#f2efe8]"}`}>
                      recommandé
                    </span>
                  ) : null}
                  <span className="flex items-center justify-between">
                    <span className="lx-title lx-caps text-[1.6rem]">{p.name}</span>
                    {on ? <Check className="h-5 w-5" /> : null}
                  </span>
                  <span className={`mt-2 text-[14px] ${on ? "text-[#f2efe8]/70" : "text-[#8a8175]"}`}>{p.description}</span>
                  <span className="mt-8 flex items-end gap-2">
                    <span className="lx-title text-[4rem] leading-[0.8] tabular-nums">{p.price}</span>
                    <span className="pb-1 font-serif text-lg italic">€ / mois</span>
                  </span>
                  <span className={`mt-2 text-[12px] ${on ? "text-[#f2efe8]/65" : "text-[#8a8175]"}`}>
                    + {p.perMinute.toFixed(2).replace(".", ",")} € / minute · {PLAN_LINES[p.id]} appels simultanés
                  </span>
                  <ul className={`mt-6 space-y-2 border-t pt-6 text-[14px] ${on ? "border-[#f2efe8]/15" : "border-[#1a1816]/10"}`}>
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span className={on ? "text-[#f2efe8]/60" : "text-[#5c2a36]"} aria-hidden>✦</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {hot && !on ? (
                    <span className="mt-6 text-[13px] font-medium text-[#5c2a36]">
                      {p.id === "pro"
                        ? "Pour 50 € de plus : 2 fois plus d’appels simultanés et vos chiffres"
                        : "Fort volume ou plusieurs établissements"}
                    </span>
                  ) : null}
                </motion.button>
              );
            })}
          </div>

          {/* Paiement */}
          <motion.div
            key={plan}
            initial={{ opacity: 0.6, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mx-auto mt-12 max-w-xl text-center"
          >
            <button
              type="button"
              onClick={pay}
              disabled={paying}
              className="marketing-btn flex h-16 w-full items-center justify-center gap-2 rounded-full bg-[#5c2a36] text-[16px] font-medium text-[#f2efe8] shadow-[0_24px_50px_-20px_rgba(92,42,54,0.7)] transition-colors hover:bg-[#4a2029] disabled:opacity-70"
            >
              {paying ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
              Activer Ligne {selected.name} · {selected.price} € / mois
            </button>
            <p className="mt-3 flex items-center justify-center gap-2 text-[12px] text-[#8a8175]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Paiement sécurisé par Stripe · sans engagement · résiliable chaque mois
            </p>
            {payError ? <p className="mt-3 text-[13px] text-[#a3354b]">{payError}</p> : null}
            <p className="mt-6 text-[14px] leading-relaxed text-[#5c574f]">
              Juste après le paiement, vous remplissez le formulaire d’installation (carte, horaires, numéro). On configure
              votre agent à distance : aucun rendez-vous nécessaire.
            </p>
          </motion.div>
        </section>

        {/* Rappel par l'équipe, en dernier recours */}
        <section className="mx-auto mt-24 max-w-xl border-t border-[#1a1816]/10 pt-14">
          <p className="lx-label">Une question avant de vous lancer ?</p>
          <h2 className="mt-4 text-[1.6rem] font-medium tracking-[-0.03em]">Être rappelé par notre équipe</h2>
          <p className="mt-2 text-[14px] text-[#5c574f]">On vous rappelle dans la journée pour répondre à vos questions et vous conseiller la bonne formule.</p>
          <div className="mt-8">
            <MarketingTrialForm key={plan} plan={selected.name} submitLabel="Être rappelé" />
          </div>
        </section>
      </main>

      {/* Sur téléphone, l'offre choisie et le paiement restent toujours à portée de pouce. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1a1816]/10 bg-[#f3f0ed]/95 px-4 py-3 backdrop-blur sm:hidden">
        <button
          type="button"
          onClick={pay}
          disabled={paying}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#5c2a36] text-[15px] font-medium text-[#f2efe8] disabled:opacity-70"
        >
          {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          Activer {selected.name} · {selected.price} € / mois
        </button>
      </div>
    </div>
  );
}
