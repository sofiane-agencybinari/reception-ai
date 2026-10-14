import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/app-shell";
import { CallsList } from "@/components/calls-list";

export default function CallsPage() {
  return (
    <AuthGuard>
      <AppShell title="Appels" subtitle="Chaque appel décroché par Ligne : résumé, conversation et enregistrement.">
        <CallsList />
      </AppShell>
    </AuthGuard>
  );
}
