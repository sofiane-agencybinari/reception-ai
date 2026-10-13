#!/usr/bin/env node
/**
 * Relie un restaurant client à son agent ElevenLabs et à son client Stripe, pour facturer ses minutes d'appel.
 * À lancer une fois à l'installation d'un nouveau client, après son paiement sur le site.
 *
 * Usage : node scripts/link-restaurant-billing.mjs <restaurant_id> <agent_id ElevenLabs> <e-mail du client OU cus_…>
 * (lit NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY et STRIPE_SECRET_KEY dans .env.local)
 */

import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

import { loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const [restaurantId, agentId, customerRef] = process.argv.slice(2);
if (!restaurantId || !agentId || !customerRef) {
  console.error("\nUsage : node scripts/link-restaurant-billing.mjs <restaurant_id> <agent_id> <e-mail ou cus_…>\n");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY?.trim() ?? "");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "", {
  auth: { persistSession: false },
});

let customerId = customerRef;
if (!customerRef.startsWith("cus_")) {
  const found = await stripe.customers.list({ email: customerRef, limit: 2 });
  if (found.data.length !== 1) {
    console.error(`\n❌ ${found.data.length} client(s) Stripe avec l'e-mail ${customerRef}. Passez l'identifiant cus_… directement.\n`);
    process.exit(1);
  }
  customerId = found.data[0].id;
}

const subs = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1 });
if (!subs.data.length) console.warn("⚠️  Ce client n'a pas d'abonnement actif : ses minutes seront déclarées mais pas facturées.");

const { data, error } = await supabase
  .from("restaurants")
  .update({ elevenlabs_agent_id: agentId, stripe_customer_id: customerId })
  .eq("id", restaurantId)
  .select("name")
  .single();
if (error) {
  console.error(`\n❌ ${error.message}\n(La table restaurants a-t-elle les colonnes de supabase/billing.sql ?)\n`);
  process.exit(1);
}

console.log(`\n✅ ${data.name} : agent ${agentId} → client Stripe ${customerId}. Ses minutes d'appel seront facturées.\n`);
