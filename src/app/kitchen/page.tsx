import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/app-shell";
import { KitchenBoard } from "@/components/kitchen-board";

export default function KitchenPage() {
  return (
    <AuthGuard>
      <AppShell
        title="Écran cuisine"
        subtitle="Commandes en temps réel — validez, préparez, marquez prêt."
      >
        <KitchenBoard />
      </AppShell>
    </AuthGuard>
  );
}
