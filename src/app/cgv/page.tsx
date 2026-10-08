import type { Metadata } from "next";

import { PRICING_PLANS } from "@/components/marketing/marketing-data";
import { CONTACT_EMAIL, LegalPage, LegalSection, ToFill } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Conditions générales d’abonnement",
  alternates: { canonical: "/cgv" },
};

const eur = (v: number) => v.toFixed(2).replace(".", ",");

export default function CgvPage() {
  return (
    <LegalPage
      title="Conditions générales d’abonnement"
      updated="7 octobre 2026"
      intro={
        <p>
          Les présentes conditions régissent l’abonnement au service Ligne, réceptionniste téléphonique par intelligence
          artificielle destiné aux professionnels de la restauration.
        </p>
      }
    >
      <LegalSection title="1. Parties et objet">
        <p>
          Le service est fourni par <ToFill>raison sociale</ToFill> (« Ligne ») à tout professionnel de la restauration (« le
          Client ») ayant souscrit une formule. Il comprend la prise d’appels par un agent vocal, la transmission des commandes en
          cuisine, l’envoi de SMS de confirmation et un tableau de bord, selon la formule choisie.
        </p>
        <p>Le service est réservé aux professionnels ; le droit de rétractation des consommateurs ne s’applique pas.</p>
      </LegalSection>

      <LegalSection title="2. Formules et prix">
        <ul>
          {PRICING_PLANS.map((p) => (
            <li key={p.id}>
              {p.name} : {p.price} € par mois, plus {eur(p.perMinute)} € par minute d’appel traitée{" "}
              <ToFill>préciser HT ou TTC</ToFill>.
            </li>
          ))}
        </ul>
        <p>Le détail des fonctionnalités de chaque formule figure sur la page Tarifs du site au jour de la souscription.</p>
      </LegalSection>

      <LegalSection title="3. Souscription et mise en service">
        <p>
          La souscription s’effectue via le formulaire du site puis est confirmée par écrit (e-mail) par Ligne. L’installation
          (import de la carte, configuration de l’agent, branchement téléphonique, écran cuisine) intervient en principe sous 24 h
          ouvrées. L’abonnement démarre à la mise en service.
        </p>
      </LegalSection>

      <LegalSection title="4. Facturation et paiement">
        <p>
          L’abonnement est facturé mensuellement, à terme à échoir ; les minutes d’appel sont facturées à terme échu.
          Modalités de paiement : <ToFill>prélèvement / carte bancaire / virement</ToFill>. Tout retard de paiement entraîne des
          pénalités au taux légal et une indemnité forfaitaire de 40 € pour frais de recouvrement.
        </p>
      </LegalSection>

      <LegalSection title="5. Durée et résiliation">
        <p>
          L’abonnement est sans engagement de durée et se renouvelle chaque mois. Il est résiliable à tout moment par e-mail à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, avec effet à la fin du mois en cours.
        </p>
      </LegalSection>

      <LegalSection title="6. Obligations de Ligne">
        <p>
          Ligne met en œuvre les moyens raisonnables pour assurer la disponibilité du service 24 h/24 et le support selon la
          formule. Il s’agit d’une obligation de moyens : l’agent vocal peut, exceptionnellement, mal interpréter une demande.
        </p>
      </LegalSection>

      <LegalSection title="7. Obligations du Client">
        <p>
          Le Client fournit une carte (produits, prix, allergènes) exacte et à jour, vérifie les commandes reçues avant
          préparation et informe ses clients que les appels sont traités par un assistant vocal.
        </p>
      </LegalSection>

      <LegalSection title="8. Données personnelles">
        <p>
          Pour les données des clients finaux du restaurant, le Client est responsable du traitement et Ligne agit en qualité de
          sous-traitant, conformément à l’article 28 du RGPD. Voir la <a href="/confidentialite">politique de confidentialité</a>.
        </p>
      </LegalSection>

      <LegalSection title="9. Responsabilité">
        <p>
          La responsabilité de Ligne est limitée aux dommages directs et plafonnée aux sommes versées par le Client au cours des
          trois derniers mois.
        </p>
      </LegalSection>

      <LegalSection title="10. Droit applicable">
        <p>
          Les présentes conditions sont soumises au droit français. À défaut d’accord amiable, tout litige relève des tribunaux
          compétents de <ToFill>ville du siège</ToFill>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
