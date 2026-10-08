import type { Metadata } from "next";

import { CONTACT_EMAIL, LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Cookies",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookies et traceurs"
      updated="7 octobre 2026"
      intro={<p>Le site Ligne n’utilise ni cookies publicitaires, ni outils de mesure d’audience tiers.</p>}
    >
      <LegalSection title="Ce que le site utilise">
        <ul>
          <li>
            <strong>Session de connexion</strong> à l’espace restaurant (tableau de bord) : stockage strictement nécessaire au
            fonctionnement, exempté de consentement.
          </li>
          <li>
            <strong>Démonstration vocale</strong> : les services ElevenLabs et LiveKit établissent la connexion audio le temps de
            l’appel. Aucun traceur publicitaire n’est déposé.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Votre choix">
        <p>
          Aucun bandeau de consentement n’est nécessaire tant que le site n’utilise que des traceurs strictement nécessaires. Si des
          outils de mesure d’audience ou publicitaires sont ajoutés, votre consentement sera recueilli au préalable.
        </p>
        <p>
          Vous pouvez à tout moment supprimer les données stockées par votre navigateur depuis ses paramètres. Pour toute question :{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
