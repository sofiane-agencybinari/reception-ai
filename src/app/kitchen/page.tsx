import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/app-shell";
import { KitchenBoard } from "@/components/kitchen-board";

export default function KitchenPage() {
  return (
    <AuthGuard>
      <AppShell
        title="Ecran cuisine"
        subtitle="Commandes en temps reel — validez, preparez, marquez pret."
      >
        <KitchenBoard />
      </AppShell>
    </AuthGuard>
  );
}
