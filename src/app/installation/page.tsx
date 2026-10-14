import type { Metadata } from "next";
import Link from "next/link";

import { AstorLogo } from "@/components/astor-logo";
import { InstallationForm } from "@/components/abonnement/installation-form";
import { paidCheckout } from "@/lib/installation";

export const metadata: Metadata = {
  title: "Installation de Ligne",
  robots: { index: false, follow: false },
};

export default async function InstallationPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const checkout = await paidCheckout(session_id);

  return (
    <div className="lx min-h-screen bg-[#ebe6de] text-[#1a1816]">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
        <Link href="/" aria-label="Ligne — accueil">
          <AstorLogo size={30} />
        </Link>
        <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-[#5c2a36]">
          3. Installation
        </span>
      </header>
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-8">
        {checkout ? (
          <InstallationForm
            sessionId={checkout.id}
            defaults={{ email: checkout.email ?? "", mobile: checkout.phone ?? "", restaurantName: checkout.restaurant ?? "" }}
          />
        ) : (
          <div className="rounded-[22px] bg-[#f3f0ed] p-8">
            <h1 className="text-2xl font-medium">Lien d’installation invalide</h1>
            <p className="mt-3 text-[15px] text-[#5c574f]">
              Utilisez le lien reçu dans l’e-mail « Bienvenue dans l’équipe Ligne », ou appelez-nous au 06 95 84 64 41.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
