import type { Metadata } from "next";
import Link from "next/link";

import { AstorLogo } from "@/components/astor-logo";
import { CONTACT_EMAIL } from "@/components/legal/legal-page";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Abonnement confirmé",
  robots: { index: false, follow: false },
};

const PLAN_NAMES: Record<string, string> = { essentiel: "Essentiel", pro: "Pro", business: "Business" };

const STEPS = [
  ["Aujourd’hui", "Vous recevez la confirmation et la facture par e-mail."],
  ["Sous 24 h", "On vous appelle pour importer votre carte et configurer l’agent sur votre restaurant."],
  ["Jour 1", "Votre numéro est branché, l’écran cuisine installé : Ligne décroche."],
] as const;

export default async function MerciPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let plan: string | null = null;
  let email: string | null = null;
  let paid = false;

  const stripe = getStripe();
  if (stripe && session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      plan = session.metadata?.ligne_plan ?? null;
      email = session.customer_details?.email ?? null;
      paid = session.status === "complete";
    } catch {
      /* identifiant invalide : on affiche la version générique */
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#120a0c] text-[#f2efe8]">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-5">
        <Link href="/" aria-label="Ligne — accueil">
          <AstorLogo size={30} wordmarkClassName="text-[#f2efe8]" />
        </Link>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-16">
        <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.22em] text-[#d9a3b0]">
          {paid ? "Paiement confirmé" : "Merci"}
        </p>
        <h1 className="mt-4 font-sans text-[clamp(2.2rem,5vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.045em]">
          Bienvenue chez Ligne{plan && PLAN_NAMES[plan] ? <span className="text-[#d9a3b0]"> {PLAN_NAMES[plan]}</span> : null}.
        </h1>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/65">
          Votre abonnement est actif{email ? ` — la confirmation part à ${email}` : ""}. On s’occupe de tout pour que votre
          téléphone soit pris en charge dès demain.
        </p>

        <ol className="mt-12 space-y-6 border-l border-white/15 pl-6">
          {STEPS.map(([when, what]) => (
            <li key={when} className="relative">
              <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full bg-[#d9a3b0]" />
              <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-white/45">{when}</p>
              <p className="mt-1 text-[15px] text-white/80">{what}</p>
            </li>
          ))}
        </ol>

        <p className="mt-14 text-[14px] text-white/55">
          Une question ? <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#f2efe8] underline underline-offset-4">{CONTACT_EMAIL}</a>
        </p>
        <Link href="/" className="mt-6 inline-flex h-11 items-center rounded-full border border-white/20 px-5 text-[13px] hover:border-white/50">
          Retour au site
        </Link>
      </main>
    </div>
  );
}
