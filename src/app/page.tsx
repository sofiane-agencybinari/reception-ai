import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12">
      <section className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">
          Reception AI - Commandes telephoniques
        </h1>
        <p className="mt-3 text-zinc-700">
          MVP pour restaurants fast-food: l&apos;agent vocal recoit la commande,
          puis l&apos;equipe cuisine la traite en temps reel.
        </p>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/kitchen"
          className="rounded-xl border border-black/10 bg-white p-5 transition hover:border-black/30"
        >
          <h2 className="font-semibold">Cuisine</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Voir les commandes en direct et changer le statut.
          </p>
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl border border-black/10 bg-white p-5 transition hover:border-black/30"
        >
          <h2 className="font-semibold">Dashboard</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Historique des commandes et indicateurs de base.
          </p>
        </Link>
        <Link
          href="/settings/menu"
          className="rounded-xl border border-black/10 bg-white p-5 transition hover:border-black/30"
        >
          <h2 className="font-semibold">Parametres menu</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Ajouter des produits et gerer la disponibilite.
          </p>
        </Link>
      </section>
    </main>
  );
}
