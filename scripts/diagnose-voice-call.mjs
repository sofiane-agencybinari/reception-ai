#!/usr/bin/env node
/**
 * Diagnostique pourquoi l'appel telephonique n'utilise pas l'agent Shake Beef.
 *
 * Usage: npm run diagnose:voice
 */

import { loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
const agentId =
  process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID?.trim() ||
  "agent_1301khmc2x71e30anhrycs0cqhky";
const branchId =
  process.env.ELEVENLABS_BRANCH_ID?.trim() || "agtbrch_0301khmc2z38fknr0fby60tjm3k4";
const twilioSid = process.env.TWILIO_ACCOUNT_SID?.trim();
const twilioToken = process.env.TWILIO_AUTH_TOKEN?.trim();
const phoneNumber = process.env.TWILIO_FROM_NUMBER?.trim();

const issues = [];
const ok = [];

function printList(title, items) {
  if (items.length === 0) return;
  console.log(`\n${title}`);
  for (const item of items) console.log(`  ${item}`);
}

console.log("\n📞 ASTOR — diagnostic appels vocaux\n");

if (!apiKey) issues.push("❌ ELEVENLABS_API_KEY manquant");
if (!twilioSid || !twilioToken) issues.push("❌ Credentials Twilio manquants");

if (twilioSid && twilioToken) {
  const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
  const account = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}.json`, {
    headers: { Authorization: `Basic ${auth}` },
  }).then((r) => r.json());

  if (account.type === "Trial") {
    issues.push(
      "❌ Twilio en mode TRIAL — message automatique en anglais sur chaque appel (« trial account »)",
    );
    issues.push("   → Upgrade : https://console.twilio.com/us1/billing/manage-billing/upgrade");
  } else {
    ok.push("✅ Twilio : compte payant (pas de message trial)");
  }

  if (phoneNumber) {
    const numbers = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/IncomingPhoneNumbers.json?PhoneNumber=${encodeURIComponent(phoneNumber)}`,
      { headers: { Authorization: `Basic ${auth}` } },
    ).then((r) => r.json());
    const entry = numbers.incoming_phone_numbers?.[0];
    if (!entry) {
      issues.push(`❌ Numero ${phoneNumber} introuvable dans Twilio`);
    } else {
      const voiceUrl = entry.voice_url ?? "";
      if (voiceUrl.includes("elevenlabs")) {
        ok.push(`✅ Twilio Voice → ElevenLabs (${voiceUrl})`);
      } else {
        issues.push(`❌ Voice webhook incorrect : ${voiceUrl || "(vide)"}`);
        issues.push("   → npm run elevenlabs:import-phone");
      }
    }
  }
}

if (apiKey) {
  const sub = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
    headers: { "xi-api-key": apiKey },
  }).then((r) => r.json());

  if (sub.tier === "free" || sub.status === "free") {
    issues.push(
      "❌ ElevenLabs plan FREE — quotas limites (~15 min appels/mois, pas de licence commerciale)",
    );
    issues.push("   → Upgrade Starter (6 $/mois) : https://elevenlabs.io/app/subscription");
  } else {
    ok.push(`✅ ElevenLabs : plan ${sub.tier}`);
  }

  const agent = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
    headers: { "xi-api-key": apiKey },
  }).then((r) => r.json());

  const lang = agent.conversation_config?.agent?.language;
  const first = agent.conversation_config?.agent?.first_message ?? "";
  if (lang === "fr") ok.push("✅ Agent configure en francais");
  else issues.push(`❌ Langue agent : ${lang ?? "inconnue"} → npm run elevenlabs:configure-agent`);

  if (first.toLowerCase().includes("bonjour")) ok.push(`✅ Message d'accueil : « ${first.slice(0, 60)}… »`);
  else issues.push(`❌ Message d'accueil inattendu : ${first.slice(0, 80)}`);

  const phones = await fetch("https://api.elevenlabs.io/v1/convai/phone-numbers", {
    headers: { "xi-api-key": apiKey },
  }).then((r) => r.json());

  const phone = (Array.isArray(phones) ? phones : []).find(
    (p) => p.phone_number?.replace(/\s+/g, "") === phoneNumber?.replace(/\s+/g, ""),
  );

  if (!phone) {
    issues.push("❌ Numero non importe dans ElevenLabs → npm run elevenlabs:import-phone");
  } else {
    const assigned = phone.assigned_agent?.agent_id;
    if (assigned === agentId) {
      ok.push(`✅ Agent assigne au numero (${phone.assigned_agent?.agent_name})`);
    } else {
      issues.push(`❌ Agent assigne : ${assigned ?? "aucun"} (attendu ${agentId})`);
    }
    if (!phone.assigned_agent?.branch_id) {
      issues.push("⚠️  Branche live non assignee au numero");
      issues.push("   → npm run elevenlabs:fix-phone");
    } else if (phone.assigned_agent.branch_id === branchId) {
      ok.push("✅ Branche Main assignee au numero");
    }
  }

  let twilioInbound = 0;
  let cursor = null;
  for (let page = 0; page < 5; page++) {
    const url =
      "https://api.elevenlabs.io/v1/convai/conversations?page_size=50" +
      (cursor ? `&cursor=${encodeURIComponent(cursor)}` : "");
    const data = await fetch(url, { headers: { "xi-api-key": apiKey } }).then((r) => r.json());
    for (const conv of data.conversations ?? []) {
      if (conv.conversation_initiation_source === "twilio" && conv.direction === "inbound") {
        twilioInbound++;
      }
    }
    if (!data.has_more) break;
    cursor = data.next_cursor;
  }

  if (twilioInbound === 0) {
    issues.push(
      "❌ Aucun appel entrant enregistre dans ElevenLabs — l'agent Shake Beef ne demarre pas au telephone",
    );
    issues.push("   (Si tu entends « Sam » en anglais, c'est le demo / message trial, pas ton agent)");
  } else {
    ok.push(`✅ ${twilioInbound} appel(s) entrant(s) enregistre(s) dans ElevenLabs`);
  }
}

printList("OK :", ok);
printList("A corriger :", issues);

if (issues.some((i) => i.includes("Twilio en mode TRIAL") || i.includes("ElevenLabs plan FREE"))) {
  console.log("\n--- Solution recommandee ---\n");
  console.log("1. Upgrade Twilio (supprime le message « trial account » en anglais)");
  console.log("   https://console.twilio.com/us1/billing/manage-billing/upgrade\n");
  console.log("2. Upgrade ElevenLabs Starter 6 $/mois (active l'agent custom au telephone)");
  console.log("   https://elevenlabs.io/app/subscription\n");
  console.log("3. Puis relance :");
  console.log("   npm run elevenlabs:configure-agent");
  console.log("   npm run elevenlabs:fix-phone");
  console.log("   npm run diagnose:voice\n");
} else if (issues.length > 0) {
  console.log("\nRelance les scripts de configuration ci-dessus puis rappelle le numero.\n");
} else {
  console.log("\nConfiguration OK — rappelle le numero pour tester.\n");
}

process.exit(issues.length > 0 ? 1 : 0);
