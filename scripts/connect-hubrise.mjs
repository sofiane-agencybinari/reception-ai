#!/usr/bin/env node
/**
 * Relie un restaurant à sa caisse via HubRise (à faire une fois, avec le restaurateur).
 *
 * Prérequis : un client OAuth HubRise (back-office HubRise → Developer → Create an OAuth 2.0 client),
 * HUBRISE_CLIENT_ID et HUBRISE_CLIENT_SECRET dans .env.local.
 *
 * 1) node scripts/connect-hubrise.mjs <restaurant_id>
 *    → affiche un lien : le restaurateur s'y connecte avec SON compte HubRise et choisit son point de vente.
 *    HubRise affiche alors un code.
 * 2) node scripts/connect-hubrise.mjs <restaurant_id> <code>
 *    → échange le code contre un jeton (permanent) et l'enregistre pour ce restaurant.
 */

import { createClient } from "@supabase/supabase-js";

import { loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const [restaurantId, code] = process.argv.slice(2);
const clientId = process.env.HUBRISE_CLIENT_ID?.trim();
const clientSecret = process.env.HUBRISE_CLIENT_SECRET?.trim();
if (!restaurantId || !clientId || !clientSecret) {
  console.error("\nUsage : node scripts/connect-hubrise.mjs <restaurant_id> [code]");
  console.error("(HUBRISE_CLIENT_ID et HUBRISE_CLIENT_SECRET requis dans .env.local)\n");
  process.exit(1);
}

const REDIRECT = "urn:ietf:wg:oauth:2.0:oob";
const SCOPE = "location[orders.read,orders.write]";

if (!code) {
  const url = new URL("https://manager.hubrise.com/oauth2/v1/authorize");
  url.search = new URLSearchParams({ redirect_uri: REDIRECT, client_id: clientId, scope: SCOPE }).toString();
  console.log("\n1) Ouvrez ce lien avec le restaurateur, connecté à SON compte HubRise, et choisissez son point de vente :\n");
  console.log(url.toString());
  console.log(`\n2) Puis : node scripts/connect-hubrise.mjs ${restaurantId} <code affiché par HubRise>\n`);
  process.exit(0);
}

const res = await fetch("https://manager.hubrise.com/oauth2/v1/token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({ code }).toString(),
});
const token = await res.json().catch(() => ({}));
if (!res.ok || !token.access_token || !token.location_id) {
  console.error(`\n❌ Échange du code refusé (${res.status}) : ${JSON.stringify(token).slice(0, 300)}\n`);
  process.exit(1);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "", {
  auth: { persistSession: false },
});
const { error } = await supabase.from("restaurant_integrations").upsert({
  restaurant_id: restaurantId,
  hubrise_location_id: token.location_id,
  hubrise_access_token: token.access_token,
  updated_at: new Date().toISOString(),
});
if (error) {
  console.error(`\n❌ ${error.message}\n(La table a-t-elle été créée avec supabase/hubrise.sql ?)\n`);
  process.exit(1);
}
console.log(`\n✅ Restaurant relié à HubRise (point de vente ${token.location_id}${token.location_name ? ` — ${token.location_name}` : ""}).`);
console.log("   Les prochaines commandes téléphoniques partiront en caisse, et le temps d'attente tiendra compte des autres commandes.\n");
