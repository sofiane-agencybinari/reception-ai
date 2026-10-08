import type { Metadata } from "next";

import { CONTACT_EMAIL, LegalPage, LegalSection, ToFill } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales" updated="7 octobre 2026">
      <LegalSection title="Éditeur du site">
        <p>
          Le site et le service Ligne sont édités par <ToFill>raison sociale</ToFill>, <ToFill>forme juridique et capital social</ToFill>,
          dont le siège social est situé <ToFill>adresse complète</ToFill>.
        </p>
        <ul>
          <li>
            Immatriculation : <ToFill>RCS ou RNE + numéro SIREN</ToFill>
          </li>
          <li>
            Numéro de TVA intracommunautaire : <ToFill>numéro de TVA</ToFill>
          </li>
          <li>
            Contact : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </li>
          <li>
            Directeur de la publication : <ToFill>nom et qualité</ToFill>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com.
        </p>
        <p>
          Les données du service (commandes, comptes restaurants, demandes de contact) sont stockées chez Supabase{" "}
          <ToFill>région d’hébergement de la base Supabase</ToFill>.
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          La marque Ligne, son logo, les textes, visuels, animations et le code du site sont protégés par le droit de la propriété
          intellectuelle. Toute reproduction ou réutilisation, totale ou partielle, sans autorisation écrite de l’éditeur est
          interdite.
        </p>
        <p>
          Les photographies d’ambiance et les données affichées dans les démonstrations (restaurant « Le Comptoir », journée type,
          tableaux de bord) sont illustratives.
        </p>
      </LegalSection>

      <LegalSection title="Démonstration vocale">
        <p>
          La démonstration du site met en relation le visiteur avec un agent vocal d’intelligence artificielle jouant le rôle du
          restaurant fictif « Le Comptoir ». Aucune commande réelle n’est passée et aucun paiement n’est demandé. Le traitement des
          données de cette démonstration est décrit dans la <a href="/confidentialite">politique de confidentialité</a>.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilité">
        <p>
          L’éditeur s’efforce d’assurer l’exactitude des informations publiées mais ne peut garantir l’absence d’erreurs. Les
          chiffres présentés à titre d’illustration ne constituent pas un engagement de résultat.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
