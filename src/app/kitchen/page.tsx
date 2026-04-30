import Link from "next/link";

import { KitchenBoard } from "@/components/kitchen-board";

export default function KitchenPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Interface Cuisine (temps reel)</h1>
        <Link href="/" className="text-sm text-zinc-600 underline">
          Retour accueil
        </Link>
      </div>
      <KitchenBoard />
    </main>
  );
}
