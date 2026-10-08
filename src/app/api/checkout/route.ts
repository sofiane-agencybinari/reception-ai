import { NextRequest, NextResponse } from "next/server";

import { getStripe, PLAN_IDS, priceKeys, type PlanId } from "@/lib/stripe";

export const runtime = "nodejs";

/** En local, retour vers le serveur de dev ; en production, vers l'adresse officielle du site. */
function siteUrl(req: NextRequest) {
  if (process.env.NODE_ENV !== "production") return req.nextUrl.origin;
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || req.nextUrl.origin;
}

/**
 * Crée une session Stripe Checkout (abonnement) pour une formule :
 * prix mensuel fixe + minutes d'appel facturées à l'usage. Page de paiement hébergée par Stripe.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ ok: false, error: "Le paiement en ligne n’est pas encore activé." }, { status: 503 });
  }

  const body = (await req.json().catch(() => ({}))) as { plan?: string };
  const plan = PLAN_IDS.find((p) => p === body.plan) as PlanId | undefined;
  if (!plan) return NextResponse.json({ ok: false, error: "Formule inconnue." }, { status: 400 });

  const keys = priceKeys(plan);
  const prices = await stripe.prices.list({ lookup_keys: [keys.monthly, keys.minutes], active: true });
  const monthly = prices.data.find((p) => p.lookup_key === keys.monthly);
  const minutes = prices.data.find((p) => p.lookup_key === keys.minutes);
  if (!monthly || !minutes) {
    console.error("[checkout] prix introuvables — lancer scripts/setup-stripe.mjs", keys);
    return NextResponse.json({ ok: false, error: "Le paiement en ligne n’est pas encore activé." }, { status: 503 });
  }

  const base = siteUrl(req);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: monthly.id, quantity: 1 }, { price: minutes.id }],
      success_url: `${base}/abonnement/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/#tarifs`,
      locale: "fr",
      allow_promotion_codes: true,
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      phone_number_collection: { enabled: true },
      custom_fields: [
        { key: "restaurant", label: { type: "custom", custom: "Nom du restaurant" }, type: "text" },
      ],
      subscription_data: { metadata: { ligne_plan: plan } },
      metadata: { ligne_plan: plan },
      consent_collection: { terms_of_service: "required" },
      custom_text: {
        terms_of_service_acceptance: {
          message: `J’accepte les [conditions générales d’abonnement](${base}/cgv). Abonnement mensuel sans engagement, minutes d’appel facturées à l’usage.`,
        },
      },
    });
    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("[checkout] création de session échouée", err);
    return NextResponse.json({ ok: false, error: "Impossible d’ouvrir le paiement. Réessayez dans un instant." }, { status: 502 });
  }
}
