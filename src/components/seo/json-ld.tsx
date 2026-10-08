import { FAQ, PRICING_PLANS } from "@/components/marketing/marketing-data";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://reception-ai-zeta.vercel.app";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ligne",
  url: SITE_URL,
  logo: `${SITE_URL}/ligne-icon.png`,
  description:
    "Réceptionniste téléphonique IA pour restaurants : prise de commandes, réservations et suivi des appels 24h/24.",
  email: "contact@agencybinari.com",
  areaServed: {
    "@type": "Country",
    name: "France",
  },
  sameAs: [] as string[],
};

const softwareApplication = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Ligne",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Restaurant phone AI receptionist",
  operatingSystem: "Web",
  url: SITE_URL,
  description:
    "Agent vocal IA qui décroche les appels restaurant, prend les commandes et les envoie en cuisine. Réceptionniste téléphonique automatisé 24h/24.",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    lowPrice: Math.min(...PRICING_PLANS.map((p) => p.price)),
    highPrice: Math.max(...PRICING_PLANS.map((p) => p.price)),
    offerCount: PRICING_PLANS.length,
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/#tarifs`,
  },
  inLanguage: "fr-FR",
  featureList: [
    "Décroché d’appels 24h/24",
    "Prise de commande téléphonique",
    "Envoi en cuisine",
    "Dashboard des ventes",
    "SMS de confirmation client",
    "Jusqu’à 10 appels simultanés",
  ],
  provider: {
    "@type": "Organization",
    name: "Ligne",
    url: SITE_URL,
  },
};

/** FAQ de l'accueil : éligible aux résultats enrichis Google. */
const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

type Props = {
  /** Extra schemas to merge (e.g. Article on content pages). */
  extra?: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ extra }: Props = {}) {
  const schemas: Record<string, unknown>[] = [organization, softwareApplication, faqPage];
  if (extra) {
    schemas.push(...(Array.isArray(extra) ? extra : [extra]));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}
