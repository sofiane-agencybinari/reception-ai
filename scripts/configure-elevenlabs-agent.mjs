#!/usr/bin/env node
/**
 * Force l'agent ElevenLabs en francais et publie la version live (appels telephoniques).
 *
 * Usage: npm run elevenlabs:configure-agent
 */

import { loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
const agentId =
  process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID?.trim() ||
  "agent_1301khmc2x71e30anhrycs0cqhky";
const branchId =
  process.env.ELEVENLABS_BRANCH_ID?.trim() || "agtbrch_0301khmc2z38fknr0fby60tjm3k4";
const orderToolId =
  process.env.ELEVENLABS_ORDER_TOOL_ID?.trim() || "tool_3301kqj2kvqjegcv47ycvw8qqzbk";
const voiceId =
  process.env.ELEVENLABS_VOICE_ID?.trim() || "HuLbOdhRlvQQN8oPP0AJ";
const restaurantName = process.env.RESTAURANT_NAME?.trim() || "Shake Beef";

const FRENCH_RULE =
  "REGLE ABSOLUE — LANGUE : Tu parles UNIQUEMENT en francais. Jamais en anglais. " +
  "Toutes tes reponses sont en francais, meme si le client melange les langues.\n\n";

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

if (!apiKey) fail("ELEVENLABS_API_KEY manquant dans .env.local");

const headers = {
  "xi-api-key": apiKey,
  "Content-Type": "application/json",
};

async function api(method, path, body) {
  const res = await fetch(`https://api.elevenlabs.io/v1/convai${path}`, {
    method,
    headers,
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
    const detail = data.detail?.[0]?.msg ?? data.message ?? text.slice(0, 400);
    throw new Error(`${res.status}: ${detail}`);
  }
  return data;
}

console.log("\n🇫🇷 ElevenLabs — configuration agent francais\n");

const current = await api("GET", `/agents/${agentId}`);
const existingPrompt = current.conversation_config?.agent?.prompt?.prompt ?? "";
const prompt = existingPrompt.startsWith("REGLE ABSOLUE") ? existingPrompt : FRENCH_RULE + existingPrompt;

await api("PATCH", `/agents/${agentId}`, {
  name: `${restaurantName} Reception`,
  conversation_config: {
    agent: {
      language: "fr",
      first_message: `Bonjour, bienvenue chez ${restaurantName}. Souhaitez-vous passer une commande ?`,
      prompt: {
        prompt,
        tool_ids: [orderToolId],
        llm: current.conversation_config?.agent?.prompt?.llm ?? "qwen3-30b-a3b",
      },
    },
    turn: {
      soft_timeout_config: {
        timeout_seconds: -1,
        message: "Euh... un instant.",
        use_llm_generated_message: false,
      },
    },
    tts: {
      model_id: "eleven_turbo_v2_5",
      voice_id: voiceId,
    },
  },
});
console.log("✅ Agent configure en francais");

const deployment = await api("POST", `/agents/${agentId}/deployments`, {
  deployment_request: {
    requests: [
      {
        branch_id: branchId,
        deployment_strategy: { type: "percentage", traffic_percentage: 100 },
      },
    ],
  },
});
const livePct = deployment.traffic_percentage_branch_id_map?.[branchId];
console.log(`✅ Version publiee en prod (${livePct}% trafic sur Main)`);

const updated = await api("GET", `/agents/${agentId}`);
console.log(`   Langue      : ${updated.conversation_config?.agent?.language}`);
console.log(`   1er message : ${updated.conversation_config?.agent?.first_message}`);
console.log("\nRappelle +19716266228 pour tester.\n");
