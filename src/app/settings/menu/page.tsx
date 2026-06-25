import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/app-shell";
import { MenuSettings } from "@/components/menu-settings";

export default function MenuSettingsPage() {
  return (
    <AuthGuard>
      <AppShell
        title="Parametres menu"
        subtitle="Carte, prix et disponibilite des produits pour l'agent vocal."
      >
        <MenuSettings />
      </AppShell>
    </AuthGuard>
  );
}
