#!/usr/bin/env node
/**
 * Importe le numero Twilio dans ElevenLabs et assigne l'agent ASTOR.
 *
 * Prerequis : ELEVENLABS_API_KEY dans .env.local
 * Cle API : https://elevenlabs.io/app/settings/api-keys
 *
 * Usage:
 *   npm run elevenlabs:import-phone
 */

import { loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
const agentId =
  process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID?.trim() ||
  "agent_1301khmc2x71e30anhrycs0cqhky";
const phoneNumber = process.env.TWILIO_FROM_NUMBER?.trim();
const twilioSid = process.env.TWILIO_ACCOUNT_SID?.trim();
const twilioToken = process.env.TWILIO_AUTH_TOKEN?.trim();
const label = process.env.RESTAURANT_NAME?.trim() || "ASTOR Reception";

const baseUrl = "https://api.elevenlabs.io/v1/convai/phone-numbers";

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

if (!apiKey) {
  fail(
    "ELEVENLABS_API_KEY manquant dans .env.local\n" +
      "  → https://elevenlabs.io/app/settings/api-keys\n" +
      "  Ajoute : ELEVENLABS_API_KEY=sk_...",
  );
}

if (!phoneNumber || !twilioSid || !twilioToken) {
  fail("TWILIO_FROM_NUMBER, TWILIO_ACCOUNT_SID et TWILIO_AUTH_TOKEN requis dans .env.local");
}

async function elevenlabs(method, path, body) {
  const res = await fetch(`https://api.elevenlabs.io/v1/convai${path}`, {
    method,
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const detail = data.detail?.[0]?.msg ?? data.message ?? text.slice(0, 300);
    throw new Error(`${res.status}: ${detail}`);
  }
  return data;
}

console.log("\n📞 ElevenLabs — import numero Twilio ASTOR\n");
console.log(`  Numero : ${phoneNumber}`);
console.log(`  Agent  : ${agentId}`);
console.log(`  Label  : ${label}\n`);

const existing = await elevenlabs("GET", "/phone-numbers");
const normalized = phoneNumber.replace(/\s+/g, "");
const found = (Array.isArray(existing) ? existing : []).find(
  (entry) => entry.phone_number?.replace(/\s+/g, "") === normalized,
);

let phoneNumberId;

if (found) {
  phoneNumberId = found.phone_number_id;
  console.log(`ℹ️  Numero deja importe (${phoneNumberId})`);

  const assigned = found.assigned_agent?.agent_id;
  if (assigned === agentId) {
    console.log(`✅ Agent deja assigne : ${found.assigned_agent?.agent_name ?? agentId}`);
  } else {
    await elevenlabs("PATCH", `/phone-numbers/${phoneNumberId}`, { agent_id: agentId });
    console.log(`✅ Agent assigne → ${agentId}`);
  }
} else {
  const created = await elevenlabs("POST", "/phone-numbers", {
    provider: "twilio",
    phone_number: phoneNumber,
    label,
    sid: twilioSid,
    token: twilioToken,
    agent_id: agentId,
  });
  phoneNumberId = created.phone_number_id;
  console.log(`✅ Numero importe : ${phoneNumberId}`);
  console.log("   ElevenLabs a configure le webhook Voice sur Twilio.");
}

console.log("\nVerification Twilio (voice webhook)…");
const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
const twilioRes = await fetch(
  `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/IncomingPhoneNumbers.json?PhoneNumber=${encodeURIComponent(phoneNumber)}`,
  { headers: { Authorization: `Basic ${auth}` } },
);
const twilioData = await twilioRes.json();
const twilioNumber = twilioData.incoming_phone_numbers?.[0];
const voiceUrl = twilioNumber?.voice_url ?? "";
const isElevenLabs =
  voiceUrl.includes("elevenlabs") || voiceUrl.includes("convai");

if (isElevenLabs) {
  console.log(`✅ Voice webhook ElevenLabs : ${voiceUrl.slice(0, 80)}…`);
} else {
  console.log(`⚠️  Voice webhook : ${voiceUrl || "(vide)"}`);
  console.log("   Attends 30s et relance, ou verifie dans Twilio Console.");
}

console.log("\nProchaine etape : verifier l'outil webhook agent `create_order`");
console.log("  → docs/elevenlabs-setup.md section 2");
console.log("\nTest : appelle " + phoneNumber + " depuis ton mobile.\n");
