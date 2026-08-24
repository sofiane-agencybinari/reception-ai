#!/usr/bin/env node
/**
 * Configure l'agent El Bahja : prompt structure, voix Emilie pro, TTS flash rapide.
 *
 * Usage: npm run elevenlabs:configure-elbahja
 */

import { loadProjectEnv } from "./load-env.mjs";
import {
  EL_BAHJA_AGENT_ID,
  EL_BAHJA_BRANCH_ID,
  EL_BAHJA_FIRST_MESSAGE,
  EL_BAHJA_PROMPT,
  EL_BAHJA_TOOL_ID,
  EL_BAHJA_VOICE_ID,
} from "./el-bahja-prompt.mjs";

loadProjectEnv();

const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
const agentId = process.env.NEXT_PUBLIC_ELBAHJA_AGENT_ID?.trim() || EL_BAHJA_AGENT_ID;
const branchId = process.env.ELBAHJA_BRANCH_ID?.trim() || EL_BAHJA_BRANCH_ID;
const orderToolId = process.env.ELBAHJA_ORDER_TOOL_ID?.trim() || EL_BAHJA_TOOL_ID;
const voiceId = process.env.ELBAHJA_VOICE_ID?.trim() || EL_BAHJA_VOICE_ID;

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
    const detail = data.detail?.[0]?.msg ?? data.message ?? text.slice(0, 500);
    throw new Error(`${res.status}: ${detail}`);
  }
  return data;
}

console.log("\n🔥 ElevenLabs — El Bahja (pro / rapide / structuré)\n");

await api("PATCH", `/agents/${agentId}`, {
  name: "El Bahja Reception",
  conversation_config: {
    agent: {
      language: "fr",
      first_message: EL_BAHJA_FIRST_MESSAGE,
      prompt: {
        prompt: EL_BAHJA_PROMPT,
        tool_ids: [orderToolId],
        llm: "gemini-2.5-flash",
        temperature: 0.25,
      },
    },
    turn: {
      turn_timeout: 7,
      mode: "turn",
      turn_eagerness: "eager",
      speculative_turn: true,
      turn_model: "turn_v3",
      soft_timeout_config: {
        timeout_seconds: 1.8,
        message: "Un instant…",
        use_llm_generated_message: false,
        max_soft_timeouts_per_generation: 1,
      },
    },
    tts: {
      // Flash = latence minimale (~75ms) vs turbo (~250ms)
      model_id: "eleven_flash_v2_5",
      voice_id: voiceId,
      speed: 1.05,
      stability: 0.62,
      similarity_boost: 0.8,
      optimize_streaming_latency: 4,
    },
  },
});
console.log("✅ Agent El Bahja mis à jour (prompt + Emilie + flash)");

try {
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
  console.log(`✅ Publié en prod (${livePct ?? 100}% trafic Main)`);
} catch (err) {
  console.log(`⚠️  Déploiement branch: ${err.message}`);
  console.log("   (la config agent est déjà appliquée — vérifier dans le dashboard)");
}

const updated = await api("GET", `/agents/${agentId}`);
const tts = updated.conversation_config?.tts ?? {};
console.log(`   Langue      : ${updated.conversation_config?.agent?.language}`);
console.log(`   LLM         : ${updated.conversation_config?.agent?.prompt?.llm}`);
console.log(`   TTS         : ${tts.model_id} · speed ${tts.speed}`);
console.log(`   Voix        : ${tts.voice_id}`);
console.log(`   1er message : ${updated.conversation_config?.agent?.first_message}`);
console.log("\nTest : /demo ou widget El Bahja dans le cockpit.\n");
