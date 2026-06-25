#!/usr/bin/env node
/**
 * Teste l'envoi SMS Twilio avec les variables de .env.local
 *
 * Usage:
 *   node scripts/test-sms.mjs +33612345678
 *   TEST_SMS_PHONE=+33612345678 npm run test:sms
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvFile(path) {
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      const value = trimmed.slice(eq + 1);
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // fichier absent
  }
}

loadEnvFile(resolve(root, ".env.local"));

const to =
  process.argv[2]?.trim() ||
  process.env.TEST_SMS_PHONE?.trim() ||
  "";

const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
const fromNumber = process.env.TWILIO_FROM_NUMBER?.trim();
const restaurantName = process.env.RESTAURANT_NAME?.trim() || "Restaurant Pilote";

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

if (!to) {
  fail(
    "Numero destinataire manquant.\n" +
      "  node scripts/test-sms.mjs +33612345678\n" +
      "Format international obligatoire (E.164), ex: +33612345678",
  );
}

if (!to.startsWith("+")) {
  fail("Le numero doit commencer par + (format international E.164). Ex: +33612345678");
}

if (!accountSid || !authToken || !fromNumber) {
  fail(
    "Variables Twilio manquantes dans .env.local :\n" +
      "  TWILIO_ACCOUNT_SID\n" +
      "  TWILIO_AUTH_TOKEN\n" +
      "  TWILIO_FROM_NUMBER\n\n" +
      "Voir docs/twilio-setup.md",
  );
}

const body = `Test ASTOR — SMS de confirmation OK chez ${restaurantName}. Si vous recevez ce message, Twilio est bien configure.`;

const payload = new URLSearchParams({ To: to, From: fromNumber, Body: body });
const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

console.log("Envoi SMS test…");
console.log(`  De   : ${fromNumber}`);
console.log(`  Vers : ${to}`);

const res = await fetch(
  `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
  {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  },
);

const text = await res.text();
let data;
try {
  data = JSON.parse(text);
} catch {
  data = { raw: text };
}

if (!res.ok) {
  console.error("\n❌ Echec Twilio\n");
  console.error(JSON.stringify(data, null, 2));
  console.error(
    "\nCauses frequentes :\n" +
      "  • Compte Trial : le numero destinataire doit etre verifie dans Twilio\n" +
      "  • TWILIO_FROM_NUMBER incorrect (doit etre un numero Twilio avec SMS)\n" +
      "  • Numero sans indicatif +33\n",
  );
  process.exit(1);
}

console.log("\n✅ SMS envoye avec succes");
console.log(`  SID : ${data.sid}`);
console.log(`  Statut : ${data.status}`);
console.log("\nVerifiez votre telephone dans les 30 secondes.");
