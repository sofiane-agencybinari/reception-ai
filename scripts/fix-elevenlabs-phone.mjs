#!/usr/bin/env node
/**
 * Assigne l'agent + branche live au numero Twilio dans ElevenLabs.
 *
 * Usage: npm run elevenlabs:fix-phone
 */

import { loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
const agentId =
  process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID?.trim() ||
  "agent_1301khmc2x71e30anhrycs0cqhky";
const branchId =
  process.env.ELEVENLABS_BRANCH_ID?.trim() || "agtbrch_0301khmc2z38fknr0fby60tjm3k4";
const phoneNumber = process.env.TWILIO_FROM_NUMBER?.trim();

if (!apiKey) {
  console.error("\n❌ ELEVENLABS_API_KEY manquant\n");
  process.exit(1);
}
if (!phoneNumber) {
  console.error("\n❌ TWILIO_FROM_NUMBER manquant\n");
  process.exit(1);
}

const headers = { "xi-api-key": apiKey, "Content-Type": "application/json" };

const phones = await fetch("https://api.elevenlabs.io/v1/convai/phone-numbers", { headers }).then(
  (r) => r.json(),
);
const normalized = phoneNumber.replace(/\s+/g, "");
const phone = (Array.isArray(phones) ? phones : []).find(
  (p) => p.phone_number?.replace(/\s+/g, "") === normalized,
);

if (!phone?.phone_number_id) {
  console.error(`\n❌ Numero ${phoneNumber} non trouve — lance npm run elevenlabs:import-phone\n`);
  process.exit(1);
}

await fetch(`https://api.elevenlabs.io/v1/convai/phone-numbers/${phone.phone_number_id}`, {
  method: "PATCH",
  headers,
  body: JSON.stringify({ agent_id: agentId, branch_id: branchId }),
}).then(async (r) => {
  if (!r.ok) throw new Error(`${r.status}: ${await r.text()}`);
});

await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}/deployments`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    deployment_request: {
      requests: [
        {
          branch_id: branchId,
          deployment_strategy: { type: "percentage", traffic_percentage: 100 },
        },
      ],
    },
  }),
}).then(async (r) => {
  if (!r.ok) throw new Error(`${r.status}: ${await r.text()}`);
});

console.log("\n✅ Numero lie a Shake Beef Reception (branche Main, 100% live)\n");
console.log(`   ${phoneNumber} → ${agentId}\n`);
