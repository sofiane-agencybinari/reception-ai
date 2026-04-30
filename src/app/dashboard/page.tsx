import Link from "next/link";

import { DashboardClient } from "@/components/dashboard-client";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Manager</h1>
        <Link href="/" className="text-sm text-zinc-600 underline">
          Retour accueil
        </Link>
      </div>
      <DashboardClient />
    </main>
  );
}
