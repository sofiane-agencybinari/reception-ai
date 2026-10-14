import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/app-shell";
import { MenuSettings } from "@/components/menu-settings";

export default function MenuSettingsPage() {
  return (
    <AuthGuard>
      <AppShell
        title="Paramètres menu"
        subtitle="Carte, prix et disponibilité des produits pour l'agent vocal."
      >
        <MenuSettings />
      </AppShell>
    </AuthGuard>
  );
}
