import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/app-shell";
import { ClientsTracker } from "@/components/clients-tracker";

export default function ClientsPage() {
  return (
    <AuthGuard>
      <AppShell
        title="Suivi clients"
        subtitle="Historique par telephone, fidelisation et export CSV."
      >
        <ClientsTracker />
      </AppShell>
    </AuthGuard>
  );
}
