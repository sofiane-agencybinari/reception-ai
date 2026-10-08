#!/usr/bin/env node
/**
 * Prépare le catalogue Stripe de Ligne (idempotent : relançable sans doublons).
 *
 * - Un compteur (Billing Meter) « ligne_call_minutes » : minutes d'appel traitées par l'agent.
 * - Pour chaque formule : un produit, un prix mensuel fixe et un prix à la minute (métré).
 *   Les prix sont retrouvés par lookup_key : ligne_<formule>_monthly / ligne_<formule>_minutes.
 *
 * Usage : node scripts/setup-stripe.mjs   (lit STRIPE_SECRET_KEY dans .env.local)
 * Mode test d'abord (sk_test_…), puis relancer avec la clé live pour la production.
 */

import Stripe from "stripe";

import { loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const key = process.env.STRIPE_SECRET_KEY?.trim();
if (!key) {
  console.error("\n❌ STRIPE_SECRET_KEY manquant dans .env.local\n");
  process.exit(1);
}

const stripe = new Stripe(key);
const METER_EVENT = "ligne_call_minutes";

/** Doit rester aligné avec PRICING_PLANS (src/components/marketing/marketing-data.ts). */
const PLANS = [
  { id: "essentiel", name: "Ligne Essentiel", monthlyCents: 4900, perMinuteCents: "19" },
  { id: "pro", name: "Ligne Pro", monthlyCents: 9900, perMinuteCents: "17" },
  { id: "business", name: "Ligne Business", monthlyCents: 19900, perMinuteCents: "15" },
];

console.log(`\n💳 Stripe — catalogue Ligne (${key.startsWith("sk_live") ? "LIVE" : "test"})\n`);

// 1) Compteur de minutes
const meters = await stripe.billing.meters.list({ status: "active", limit: 100 });
let meter = meters.data.find((m) => m.event_name === METER_EVENT);
if (!meter) {
  meter = await stripe.billing.meters.create({
    display_name: "Minutes d’appel Ligne",
    event_name: METER_EVENT,
    default_aggregation: { formula: "sum" },
    customer_mapping: { type: "by_id", event_payload_key: "stripe_customer_id" },
    value_settings: { event_payload_key: "value" },
  });
  console.log(`✅ Compteur créé : ${meter.id}`);
} else {
  console.log(`♻️  Compteur existant : ${meter.id}`);
}

// 2) Produits et prix
for (const plan of PLANS) {
  const monthlyKey = `ligne_${plan.id}_monthly`;
  const minutesKey = `ligne_${plan.id}_minutes`;
  const existing = await stripe.prices.list({ lookup_keys: [monthlyKey, minutesKey], active: true, expand: ["data.product"] });
  const byKey = Object.fromEntries(existing.data.map((p) => [p.lookup_key, p]));

  let productId =
    (typeof byKey[monthlyKey]?.product === "object" ? byKey[monthlyKey].product.id : byKey[monthlyKey]?.product) ?? null;
  if (!productId) {
    const product = await stripe.products.create({
      name: plan.name,
      description: "Réceptionniste téléphonique IA pour restaurants — abonnement mensuel sans engagement.",
      metadata: { ligne_plan: plan.id },
      unit_label: "minute",
    });
    productId = product.id;
    console.log(`✅ Produit créé : ${plan.name} (${productId})`);
  }

  // Libellé des quantités métrées sur la page de paiement et les factures (« 0,17 € par minute »).
  await stripe.products.update(productId, { unit_label: "minute" });

  if (!byKey[monthlyKey]) {
    const price = await stripe.prices.create({
      product: productId,
      currency: "eur",
      unit_amount: plan.monthlyCents,
      recurring: { interval: "month" },
      lookup_key: monthlyKey,
      nickname: `${plan.name} — mensuel`,
    });
    console.log(`   ✅ Prix mensuel : ${price.id}`);
  } else {
    console.log(`   ♻️  Prix mensuel existant : ${byKey[monthlyKey].id}`);
  }

  if (!byKey[minutesKey]) {
    const price = await stripe.prices.create({
      product: productId,
      currency: "eur",
      unit_amount_decimal: plan.perMinuteCents,
      recurring: { interval: "month", usage_type: "metered", meter: meter.id },
      lookup_key: minutesKey,
      nickname: `${plan.name} — minute d’appel`,
    });
    console.log(`   ✅ Prix à la minute : ${price.id}`);
  } else {
    console.log(`   ♻️  Prix à la minute existant : ${byKey[minutesKey].id}`);
  }
}

console.log("\nCatalogue prêt. Les formules sont retrouvées par lookup_key côté site.\n");
