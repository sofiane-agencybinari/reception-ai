import Link from "next/link";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardClient } from "@/components/dashboard-client";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Manager</h1>
          <Link href="/portal" className="text-sm text-slate-600 underline">
            Retour accueil
          </Link>
        </div>
        <DashboardClient />
      </main>
    </AuthGuard>
  );
}
