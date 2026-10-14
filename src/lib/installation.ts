import { getStripe } from "@/lib/stripe";

/** Session Stripe payée : seul un abonné ayant payé accède au formulaire d'installation. */
export async function paidCheckout(sessionId: string | null | undefined) {
  const stripe = getStripe();
  if (!stripe || !sessionId) return null;
  try {
    const s = await stripe.checkout.sessions.retrieve(sessionId);
    if (s.status !== "complete") return null;
    return {
      id: s.id,
      plan: s.metadata?.ligne_plan ?? null,
      email: s.customer_details?.email ?? null,
      phone: s.customer_details?.phone ?? null,
      restaurant: s.custom_fields?.find((f) => f.key === "restaurant")?.text?.value ?? null,
    };
  } catch {
    return null;
  }
}

/** Champs du formulaire, dans l'ordre où ils sont envoyés par e-mail. */
export const INSTALLATION_FIELDS = [
  ["restaurantName", "Nom du restaurant"],
  ["contactName", "Responsable"],
  ["mobile", "Portable du responsable"],
  ["email", "E-mail"],
  ["address", "Adresse"],
  ["restaurantPhone", "Numéro que les clients appellent"],
  ["phoneType", "Type de ligne"],
  ["operator", "Opérateur"],
  ["forwarding", "Renvoi souhaité"],
  ["hours", "Horaires d’ouverture"],
  ["services", "Services"],
  ["deliveryZone", "Zone et frais de livraison"],
  ["prepTime", "Temps de préparation habituel"],
  ["menuText", "Carte (texte)"],
  ["menuLink", "Lien vers la carte"],
  ["bestSellers", "Plats et menus phares"],
  ["options", "Cuissons, sauces, suppléments"],
  ["pos", "Logiciel de caisse"],
  ["voice", "Voix de l’agent"],
  ["notes", "Remarques"],
] as const;

export type InstallationKey = (typeof INSTALLATION_FIELDS)[number][0];
