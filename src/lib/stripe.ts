import Stripe from "stripe";

let client: Stripe | null = null;

/** Client Stripe côté serveur (clé secrète). Null si non configuré : le site retombe sur le formulaire de contact. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  client ??= new Stripe(key);
  return client;
}

export const PLAN_IDS = ["essentiel", "pro", "business"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export const priceKeys = (plan: PlanId) => ({
  monthly: `ligne_${plan}_monthly`,
  minutes: `ligne_${plan}_minutes`,
});

/** Nom de l'événement du compteur Stripe des minutes d'appel (voir scripts/setup-stripe.mjs). */
export const CALL_MINUTES_EVENT = "ligne_call_minutes";

/**
 * Déclare des minutes d'appel consommées par un client abonné (facturées en fin de mois).
 * À appeler à la fin de chaque appel traité, avec l'identifiant d'appel pour éviter les doublons.
 */
export async function reportCallMinutes(stripeCustomerId: string, minutes: number, callId: string) {
  const stripe = getStripe();
  if (!stripe || minutes <= 0) return;
  await stripe.billing.meterEvents.create({
    event_name: CALL_MINUTES_EVENT,
    identifier: `call_${callId}`,
    payload: { stripe_customer_id: stripeCustomerId, value: String(Math.ceil(minutes)) },
  });
}
