#!/usr/bin/env node
/**
 * Configure un numero Twilio pour ASTOR (API).
 *
 * - Lit le numero et met a jour le friendly name
 * - Affiche l'etat Voice/SMS
 * - N'ecrase PAS le webhook Voice si deja configure (ElevenLabs)
 *
 * Usage:
 *   npm run twilio:configure
 *   TWILIO_PHONE_NUMBER_SID=PN... npm run twilio:configure
 *
 * Phone SID par defaut (ton numero) :
 *   PN1d3ad87af5108c6376a9fea95daac442
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loadProjectEnv, projectRoot } from "./load-env.mjs";

loadProjectEnv();

const __dirname = dirname(fileURLToPath(import.meta.url));

const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
const phoneSid =
  process.env.TWILIO_PHONE_NUMBER_SID?.trim() ||
  "PN1d3ad87af5108c6376a9fea95daac442";

const friendlyName = process.env.RESTAURANT_NAME?.trim() || "ASTOR Reception";

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

if (!accountSid || !authToken) {
  fail(
    "Renseigne TWILIO_ACCOUNT_SID et TWILIO_AUTH_TOKEN dans .env.local\n" +
      "  https://console.twilio.com → Account Info",
  );
}

const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

async function twilio(method, path, body) {
  const res = await fetch(`https://api.twilio.com/2010-04-01${path}`, {
    method,
    headers: {
      Authorization: `Basic ${auth}`,
      ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: body ? new URLSearchParams(body).toString() : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!res.ok) throw new Error(data.message ?? text.slice(0, 300));
  return data;
}

function patchEnvLocal(phoneNumber) {
  const envPath = resolve(projectRoot, ".env.local");
  let content;
  try {
    content = readFileSync(envPath, "utf8");
  } catch {
    return;
  }

  const e164 = phoneNumber.replace(/\s+/g, "");
  const lines = content.split("\n");
  let changed = false;

  const upsert = (key, value) => {
    const idx = lines.findIndex((l) => l.startsWith(`${key}=`));
    if (idx >= 0) {
      if (!lines[idx].slice(key.length + 1).trim()) {
        lines[idx] = `${key}=${value}`;
        changed = true;
      }
    } else {
      lines.push(`${key}=${value}`);
      changed = true;
    }
  };

  upsert("TWILIO_ACCOUNT_SID", accountSid);
  upsert("TWILIO_FROM_NUMBER", e164);
  if (!lines.some((l) => l.startsWith("TEST_CUSTOMER_PHONE=") && l.slice(20).trim())) {
    upsert("TEST_CUSTOMER_PHONE", "+33695846441");
  }

  if (changed) {
    writeFileSync(envPath, lines.join("\n"), "utf8");
    console.log("\n📝 .env.local mis a jour : TWILIO_FROM_NUMBER (+ TEST_CUSTOMER_PHONE si vide)");
  }
}

console.log("\n🔧 Configuration Twilio ASTOR\n");

const current = await twilio(
  "GET",
  `/Accounts/${accountSid}/IncomingPhoneNumbers/${phoneSid}.json`,
);

console.log("Numero actuel :");
console.log(`  Phone     : ${current.phone_number}`);
console.log(`  SID       : ${current.sid}`);
console.log(`  Nom       : ${current.friendly_name ?? "—"}`);
console.log(`  Voice URL : ${current.voice_url || "(vide)"}`);
console.log(`  SMS URL   : ${current.sms_url || "(vide)"}`);
console.log(`  Capacites : voice=${current.capabilities?.voice ? "oui" : "non"}, sms=${current.capabilities?.sms ? "oui" : "non"}`);

const isElevenLabsVoice =
  (current.voice_url ?? "").includes("elevenlabs") ||
  (current.voice_url ?? "").includes("convai");

const updates = { FriendlyName: friendlyName };

if (!current.voice_url?.trim()) {
  console.log(
    "\n⚠️  Voice webhook vide — les appels entrants ne rejoindront pas l'agent.",
  );
  console.log(
    "    → Importe ce numero dans ElevenLabs (integration native, recommande) :",
  );
  console.log(
    "      https://elevenlabs.io/app/conversational-ai/phone-numbers",
  );
  console.log("      Agent → Phone numbers → Import Twilio → SID + Token + ce numero");
  console.log("      ElevenLabs configure automatiquement le Voice webhook Twilio.\n");
} else if (isElevenLabsVoice) {
  console.log("\n✅ Voice webhook deja pointe vers ElevenLabs — on ne touche pas.");
} else {
  console.log(`\n⚠️  Voice webhook actuel : ${current.voice_url}`);
  console.log("    Si ce n'est pas ElevenLabs, importe le numero dans ElevenLabs pour ASTOR.\n");
}

// SMS entrant : retirer la demo Twilio (ASTOR = SMS sortants uniquement)
if ((current.sms_url ?? "").includes("demo.twilio.com")) {
  updates.SmsUrl = "";
  updates.SmsMethod = "POST";
  console.log("\n🧹 Retrait du webhook SMS demo Twilio (inutile pour ASTOR).");
} else if (current.sms_url?.trim()) {
  console.log("ℹ️  SMS entrant configure — ASTOR n'en a pas besoin (SMS de confirmation sortants).");
}

const updated = await twilio(
  "POST",
  `/Accounts/${accountSid}/IncomingPhoneNumbers/${phoneSid}.json`,
  updates,
);

console.log(`\n✅ Friendly name → "${updated.friendly_name}"`);

patchEnvLocal(updated.phone_number);

console.log("\nProchaines etapes :");
console.log("  1. ElevenLabs : importer ce numero Twilio (voice auto-configure)");
console.log("  2. npm run test:sms -- +33695846441");
console.log("  3. npm run sync:vercel  (si pas deja fait)\n");
