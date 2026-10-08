import type { Metadata } from "next";

import { CONTACT_EMAIL, LegalPage, LegalSection, ToFill } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      updated="7 octobre 2026"
      intro={
        <p>
          Cette page explique quelles données Ligne traite, pourquoi, combien de temps et comment exercer vos droits, conformément au
          Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.
        </p>
      }
    >
      <LegalSection title="Responsable du traitement">
        <p>
          <ToFill>raison sociale et adresse</ToFill>, joignable à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Données traitées et finalités">
        <p>
          <strong>Demande de contact ou de souscription</strong> (formulaire du site) : nom du restaurant, ville, téléphone, e-mail,
          type de cuisine, formule souhaitée et message éventuel. Finalité : vous recontacter et préparer l’installation. Base
          légale : mesures précontractuelles prises à votre demande.
        </p>
        <p>
          <strong>Démonstration vocale ou écrite</strong> : votre voix (le temps de l’appel) et la transcription de la conversation
          avec l’agent de démonstration. Finalité : faire fonctionner la démonstration et en améliorer la qualité. Base légale :
          votre consentement, exprimé en lançant la démonstration. Aucun nom de famille, numéro de téléphone, adresse ou moyen de
          paiement n’est demandé pendant la démonstration ; merci de ne pas en communiquer.
        </p>
        <p>
          <strong>Limitation d’usage de la démonstration</strong> : une empreinte chiffrée et non réversible de votre adresse IP est
          conservée 24 heures pour limiter le nombre d’essais par visiteur. Base légale : intérêt légitime (prévention des abus).
        </p>
        <p>
          <strong>Clients du service</strong> (restaurants abonnés) : données de compte, menus, commandes reçues par téléphone et
          numéros des clients finaux nécessaires à l’envoi des SMS de confirmation. Finalité : exécution du contrat d’abonnement.
        </p>
      </LegalSection>

      <LegalSection title="Durées de conservation">
        <ul>
          <li>Demandes de contact sans suite : 3 ans à compter du dernier échange.</li>
          <li>Empreinte IP de la démonstration : 24 heures.</li>
          <li>
            Transcriptions de la démonstration : <ToFill>durée de rétention configurée chez ElevenLabs</ToFill>.
          </li>
          <li>Données des clients abonnés : durée du contrat, puis archivage selon les obligations légales (comptables : 10 ans).</li>
        </ul>
      </LegalSection>

      <LegalSection title="Destinataires et sous-traitants">
        <p>Vos données ne sont jamais vendues. Elles sont accessibles à l’équipe Ligne et aux prestataires techniques suivants :</p>
        <ul>
          <li>Vercel (hébergement du site) — États-Unis ;</li>
          <li>
            Supabase (base de données) — <ToFill>région</ToFill> ;
          </li>
          <li>ElevenLabs (agent vocal : voix, transcription) — <ToFill>région / transfert</ToFill> ;</li>
          <li>Twilio (envoi des SMS de confirmation aux clients des restaurants) — <ToFill>région / transfert</ToFill> ;</li>
          <li>Resend (envoi des e-mails de notification) — <ToFill>région / transfert</ToFill>.</li>
        </ul>
        <p>
          Lorsque des données sont transférées hors de l’Union européenne, ces transferts sont encadrés par les clauses
          contractuelles types de la Commission européenne ou le Data Privacy Framework.
        </p>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de portabilité, ainsi que
          du droit de retirer votre consentement à tout moment. Écrivez à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ;
          nous répondons sous un mois.
        </p>
        <p>
          Vous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr).
        </p>
      </LegalSection>

      <LegalSection title="Sécurité">
        <p>
          Les échanges sont chiffrés (HTTPS), les accès aux données sont restreints et les clés d’accès aux services techniques ne
          sont jamais exposées dans le navigateur.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
