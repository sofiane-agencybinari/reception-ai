import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/app-shell";
import { DashboardClient } from "@/components/dashboard-client";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <AppShell
        title="Analytics & compta"
        subtitle="Chiffre d'affaires, top produits et exports pour votre comptable."
      >
        <DashboardClient />
      </AppShell>
    </AuthGuard>
  );
}
