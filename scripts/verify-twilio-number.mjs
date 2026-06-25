#!/usr/bin/env node
/**
 * Aide a la verification Twilio (compte Trial).
 *
 * Usage:
 *   npm run twilio:verified          # liste les numeros verifies
 *   npm run twilio:verified -- +33612345678   # lance la verification par appel
 *
 * Compte Trial : les SMS ne partent que vers des numeros verifies.
 * Console : https://console.twilio.com/us1/develop/phone-numbers/verified-caller-ids
 */

import { loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
const phoneToVerify = process.argv[2]?.trim();

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

if (!accountSid || !authToken) {
  fail(
    "Credentials Twilio manquantes dans .env.local :\n" +
      "  TWILIO_ACCOUNT_SID\n" +
      "  TWILIO_AUTH_TOKEN\n\n" +
      "Recupere-les sur https://console.twilio.com (Dashboard)\n" +
      "En prod ils sont deja sur Vercel — copie-les en local pour tester.",
  );
}

const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

async function twilioGet(path) {
  const res = await fetch(`https://api.twilio.com/2010-04-01${path}`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!res.ok) throw new Error(data.message ?? text.slice(0, 200));
  return data;
}

async function twilioPost(path, body) {
  const res = await fetch(`https://api.twilio.com/2010-04-01${path}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!res.ok) throw new Error(data.message ?? text.slice(0, 200));
  return data;
}

console.log("\n📱 Twilio — numeros verifies (Trial)\n");

try {
  const list = await twilioGet(`/Accounts/${accountSid}/OutgoingCallerIds.json`);
  const numbers = list.outgoing_caller_ids ?? [];

  if (numbers.length === 0) {
    console.log("Aucun numero verifie pour le moment.\n");
  } else {
    console.log(`${numbers.length} numero(s) verifie(s) :\n`);
    for (const entry of numbers) {
      console.log(`  ✅ ${entry.phone_number}  (${entry.friendly_name ?? "sans nom"})`);
    }
    console.log();
  }
} catch (err) {
  fail(`Impossible de lister les numeros : ${err.message}`);
}

if (!phoneToVerify) {
  console.log("Pour verifier un nouveau numero :\n");
  console.log("  Option A (recommandee) — Console Twilio :");
  console.log("    https://console.twilio.com/us1/develop/phone-numbers/verified-caller-ids");
  console.log("    → Add a new Caller ID → entre +33... → code SMS\n");
  console.log("  Option B — via ce script (appel vocal Twilio) :");
  console.log("    npm run twilio:verified -- +33612345678\n");
  console.log("Puis teste l'envoi SMS :");
  console.log("  TEST_CUSTOMER_PHONE=+33... npm run test:sms\n");
  process.exit(0);
}

if (!phoneToVerify.startsWith("+")) {
  fail("Format international obligatoire : +33612345678");
}

console.log(`Demande de verification pour ${phoneToVerify}…\n`);

try {
  const result = await twilioPost(`/Accounts/${accountSid}/ValidationRequests.json`, {
    PhoneNumber: phoneToVerify,
    FriendlyName: "ASTOR test",
  });

  console.log("✅ Demande envoyee.\n");
  console.log(`  Code de validation : ${result.validation_code}`);
  console.log("\nTwilio va appeler ce numero sous peu.");
  console.log("Reponds et entre le code ci-dessus au clavier.\n");
  console.log("Alternative plus simple : verification par SMS dans la Console Twilio");
  console.log("  https://console.twilio.com/us1/develop/phone-numbers/verified-caller-ids\n");
} catch (err) {
  console.error(`\n❌ ${err.message}\n`);
  console.log("Utilise la Console Twilio (verification par SMS) :");
  console.log("  https://console.twilio.com/us1/develop/phone-numbers/verified-caller-ids\n");
  process.exit(1);
}
