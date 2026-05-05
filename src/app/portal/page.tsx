import Link from "next/link";

import { AuthGuard } from "@/components/auth-guard";

export default function PortalPage() {
  return (
    <AuthGuard>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12">
        <section className="rounded-2xl border border-indigo-200 bg-white/85 p-8 shadow-sm backdrop-blur">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Reception AI - Commandes telephoniques
          </h1>
          <p className="mt-3 text-slate-700">
            MVP pour restaurants fast-food: l&apos;agent vocal recoit la commande,
            puis l&apos;equipe cuisine la traite en temps reel.
          </p>
        </section>
        <section className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/kitchen"
            className="rounded-xl border border-indigo-200 bg-white/85 p-5 shadow-sm transition hover:border-indigo-400"
          >
            <h2 className="font-semibold text-slate-900">Cuisine</h2>
            <p className="mt-1 text-sm text-slate-600">
              Voir les commandes en direct et changer le statut.
            </p>
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-indigo-200 bg-white/85 p-5 shadow-sm transition hover:border-indigo-400"
          >
            <h2 className="font-semibold text-slate-900">Dashboard</h2>
            <p className="mt-1 text-sm text-slate-600">
              Historique des commandes et indicateurs de base.
            </p>
          </Link>
          <Link
            href="/settings/menu"
            className="rounded-xl border border-indigo-200 bg-white/85 p-5 shadow-sm transition hover:border-indigo-400"
          >
            <h2 className="font-semibold text-slate-900">Parametres menu</h2>
            <p className="mt-1 text-sm text-slate-600">
              Ajouter des produits et gerer la disponibilite.
            </p>
          </Link>
        </section>
      </main>
    </AuthGuard>
  );
}
