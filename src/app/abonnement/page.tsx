import type { Metadata } from "next";
import { Suspense } from "react";

import { SubscribePage } from "@/components/abonnement/subscribe-page";

export const metadata: Metadata = {
  title: "S’abonner à Ligne",
  description:
    "Choisissez votre formule Ligne : standard téléphonique IA pour restaurant, installé en 24 h, sans engagement. Abonnement mensuel + minutes d’appel.",
  alternates: { canonical: "/abonnement" },
};

export default function AbonnementPage() {
  return (
    <Suspense>
      <SubscribePage />
    </Suspense>
  );
}
