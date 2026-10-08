"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, Lock, X } from "lucide-react";

import { MarketingTrialForm } from "@/components/marketing/marketing-trial-form";
import { PRICING_PLANS } from "@/components/marketing/marketing-data";

import { getLenis } from "./smooth-scroll";
import { EASE } from "./reveal";

type PlanId = (typeof PRICING_PLANS)[number]["id"];
type Ctx = { open: (plan?: PlanId | null) => void };

const SubscribeContext = createContext<Ctx | null>(null);

/**
 * Ouvre le panneau de souscription depuis n'importe où (bandeau, tarifs, démo).
 * Hors provider (autres pages), renvoie vers la section tarifs de l'accueil.
 */
export function useSubscribe(): Ctx {
  const ctx = useContext(SubscribeContext);
  return ctx ?? { open: () => window.location.assign("/#tarifs") };
}

const perMinute = (v: number) => v.toFixed(2).replace(".", ",");

export function SubscribeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  /** null = simple demande de contact, sans formule choisie. */
  const [plan, setPlan] = useState<PlanId | null>(null);

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  /** Paiement en ligne indisponible (Stripe non configuré) : on retombe sur le formulaire. */
  const [payUnavailable, setPayUnavailable] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const open = useCallback((p?: PlanId | null) => {
    setPlan(p ?? null);
    setPayError(null);
    setShowForm(false);
    setIsOpen(true);
  }, []);

  /** Redirige vers la page de paiement Stripe Checkout de la formule. */
  async function pay(planId: PlanId) {
    setPaying(true);
    setPayError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string };
      if (res.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      if (res.status === 503) setPayUnavailable(true);
      setPayError(data.error ?? "Impossible d’ouvrir le paiement. Réessayez.");
    } catch {
      setPayError("Connexion impossible. Réessayez.");
    }
    setPaying(false);
  }
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const lenis = getLenis();
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const value = useMemo(() => ({ open }), [open]);
  const selected = PRICING_PLANS.find((p) => p.id === plan);

  return (
    <SubscribeContext.Provider value={value}>
      {children}
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {isOpen ? (
                <motion.div className="fixed inset-0 z-[90] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <button type="button" aria-label="Fermer" className="absolute inset-0 bg-[#0c0c0b]/60 backdrop-blur-sm" onClick={close} />
                  <motion.aside
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="subscribe-title"
                    data-lenis-prevent
                    className="relative h-full w-full max-w-xl overflow-y-auto bg-[#f3f0ed] p-6 text-[#1a1816] sm:p-10"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <button
                      type="button"
                      onClick={close}
                      className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-[#1a1816]/10 transition-colors hover:border-[#1a1816]/40"
                      aria-label="Fermer"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.22em] text-[#8a8175]">
                      {selected ? "Souscription" : "Installation"}
                    </p>
                    <h3 id="subscribe-title" className="mt-4 font-sans text-[2rem] font-medium leading-[1.05] tracking-[-0.04em]">
                      {selected ? (
                        <>
                          Activer Ligne <span className="text-[#5c2a36]">{selected.name}.</span>
                        </>
                      ) : (
                        <>
                          On installe Ligne <span className="text-[#5c2a36]">chez vous.</span>
                        </>
                      )}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-[#5c574f]">
                      Choisissez votre formule et laissez vos coordonnées : on vous rappelle sous 24 h, on configure l’agent
                      sur votre carte et Ligne décroche dès le lendemain. Sans engagement, résiliable chaque mois.
                    </p>

                    {/* Choix de la formule */}
                    <div role="radiogroup" aria-label="Formule" className="mt-8 grid gap-2 sm:grid-cols-3">
                      {PRICING_PLANS.map((p) => {
                        const on = p.id === plan;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => setPlan(on ? null : p.id)}
                            className={`relative rounded-2xl border p-4 text-left transition-colors duration-300 ${
                              on ? "border-[#5c2a36] bg-[#5c2a36] text-[#f2efe8]" : "border-[#1a1816]/12 hover:border-[#1a1816]/40"
                            }`}
                          >
                            {on ? <Check className="absolute right-3 top-3 h-4 w-4" /> : null}
                            <span className="block text-[13px] font-medium">{p.name}</span>
                            <span className="mt-1 block font-serif text-2xl leading-none">
                              {p.price} €<span className="text-[12px] font-sans"> /mois</span>
                            </span>
                            <span className={`mt-1 block text-[11px] ${on ? "text-[#f2efe8]/70" : "text-[#8a8175]"}`}>
                              + {perMinute(p.perMinute)} € / min
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {!selected ? (
                      <p className="mt-2 text-[12px] text-[#8a8175]">Pas sûr ? Laissez sans formule : on vous conseille au téléphone.</p>
                    ) : null}

                    {selected && !payUnavailable ? (
                      <div className="mt-8">
                        <button
                          type="button"
                          onClick={() => pay(selected.id)}
                          disabled={paying}
                          className="marketing-btn flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#5c2a36] text-[15px] font-medium text-[#f2efe8] transition-colors hover:bg-[#4a2029] disabled:opacity-70"
                        >
                          {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                          Payer et activer Ligne {selected.name} — {selected.price} € / mois
                        </button>
                        <p className="mt-2 text-center text-[11px] text-[#8a8175]">
                          Paiement sécurisé par Stripe · carte, Apple Pay, Google Pay · sans engagement, résiliable chaque mois
                        </p>
                        {payError ? <p className="mt-2 text-center text-[12px] text-[#a3354b]">{payError}</p> : null}

                        <button
                          type="button"
                          onClick={() => setShowForm((v) => !v)}
                          className="mx-auto mt-6 block text-[13px] text-[#5c574f] underline underline-offset-4 hover:text-[#1a1816]"
                        >
                          {showForm ? "Masquer" : "Je préfère être rappelé avant de payer"}
                        </button>
                      </div>
                    ) : null}

                    {!selected || payUnavailable || showForm ? (
                      <div className="mt-8">
                        <MarketingTrialForm
                          key={plan ?? "none"}
                          plan={selected?.name}
                          submitLabel={selected ? `Être rappelé pour ${selected.name}` : "Être recontacté"}
                        />
                      </div>
                    ) : null}

                    <p className="mt-8 text-[11px] leading-relaxed text-[#8a8175]">
                      En souscrivant, vous acceptez nos{" "}
                      <a href="/cgv" className="underline underline-offset-2">
                        conditions générales d’abonnement
                      </a>
                      . L’abonnement est mensuel, sans engagement ; les minutes d’appel sont facturées à l’usage en fin de mois.
                    </p>
                  </motion.aside>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </SubscribeContext.Provider>
  );
}
