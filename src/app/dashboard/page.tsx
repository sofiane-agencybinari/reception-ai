import Link from "next/link";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardClient } from "@/components/dashboard-client";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 animate-fade-up">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Manager</h1>
            <p className="mt-1 text-sm text-slate-600">
              Vision business en temps reel pour pilotage du service reception.
            </p>
          </div>
          <Link href="/portal" className="text-sm text-slate-600 underline">
            Retour accueil
          </Link>
        </div>
        <DashboardClient />
      </main>
    </AuthGuard>
  );
}
