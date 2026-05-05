import Link from "next/link";

import { AuthGuard } from "@/components/auth-guard";
import { ClientsTracker } from "@/components/clients-tracker";

export default function ClientsPage() {
  return (
    <AuthGuard>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8 animate-fade-up">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Suivi clients</h1>
            <p className="mt-1 text-sm text-slate-600">
              Historique par telephone, pret pour campagnes et fidelisation.
            </p>
          </div>
          <Link href="/portal" className="text-sm text-slate-600 underline">
            Retour accueil
          </Link>
        </div>
        <ClientsTracker />
      </main>
    </AuthGuard>
  );
}
