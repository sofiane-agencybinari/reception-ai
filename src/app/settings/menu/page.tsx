import Link from "next/link";

import { AuthGuard } from "@/components/auth-guard";
import { MenuSettings } from "@/components/menu-settings";

export default function MenuSettingsPage() {
  return (
    <AuthGuard>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8 animate-fade-up">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Parametres Menu</h1>
            <p className="mt-1 text-sm text-slate-600">
              Catalogue structure par categories avec gestion rapide des references.
            </p>
          </div>
          <Link href="/portal" className="text-sm text-slate-600 underline">
            Retour accueil
          </Link>
        </div>
        <MenuSettings />
      </main>
    </AuthGuard>
  );
}
