import Link from "next/link";
import { ArrowUpRight, BarChart3, ChefHat, Settings, Users } from "lucide-react";

import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/app-shell";
import { ElevenLabsWidget } from "@/components/elevenlabs-widget";

const MODULES = [
  {
    href: "/kitchen",
    icon: ChefHat,
    title: "Cuisine",
    description: "Commandes en direct et gestion des statuts.",
    tag: "Live",
  },
  {
    href: "/dashboard",
    icon: BarChart3,
    title: "Analytics",
    description: "CA, top produits et exports compta.",
    tag: "Stats",
  },
  {
    href: "/clients",
    icon: Users,
    title: "Clients",
    description: "Historique, fidelite et export CSV.",
    tag: "CRM",
  },
  {
    href: "/settings/menu",
    icon: Settings,
    title: "Menu",
    description: "Carte, prix et disponibilite des produits.",
    tag: "Catalogue",
  },
] as const;

export default function PortalPage() {
  return (
    <AuthGuard>
      <AppShell
        title="Cockpit ASTOR"
        subtitle="Pilotez vos commandes telephoniques depuis un seul endroit."
      >
        <section className="grid gap-4 sm:grid-cols-2">
          {MODULES.map(({ href, icon: Icon, title, description, tag }) => (
            <Link
              key={href}
              href={href}
              className="group glass-card rounded-2xl p-6 transition hover:border-amber-500/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                  {tag}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
              <p className="mt-1 text-sm text-zinc-500">{description}</p>
              <ArrowUpRight className="mt-4 h-4 w-4 text-zinc-600 transition group-hover:text-amber-400" />
            </Link>
          ))}
        </section>

        <section className="glass-card mt-8 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white">Test agent vocal</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Simulez un appel client avant le service ou pour former l&apos;equipe.
          </p>
          <div className="mt-6 rounded-xl border border-white/5 bg-black/30 p-4">
            <ElevenLabsWidget />
          </div>
        </section>
      </AppShell>
    </AuthGuard>
  );
}
