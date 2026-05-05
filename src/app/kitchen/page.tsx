import Link from "next/link";

import { AuthGuard } from "@/components/auth-guard";
import { KitchenBoard } from "@/components/kitchen-board";

export default function KitchenPage() {
  return (
    <AuthGuard>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 animate-fade-up">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Interface Cuisine (temps reel)</h1>
            <p className="mt-1 text-sm text-slate-600">
              Pilotage live des commandes avec priorites et suivi de traitement.
            </p>
          </div>
          <Link href="/portal" className="text-sm text-slate-600 underline">
            Retour accueil
          </Link>
        </div>
        <KitchenBoard />
      </main>
    </AuthGuard>
  );
}
