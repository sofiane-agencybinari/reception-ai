#!/usr/bin/env node
/**
 * Configure l'agent Bella Napoli : create si besoin, sinon PATCH unique + publish.
 *
 * Usage: npm run elevenlabs:configure-bella-napoli
 *
 * Token budget (config API only — no conversation / TTS tests):
 * - GET agents (reuse check)
 * - POST tool once if missing (or reuse)
 * - POST agent create OR PATCH once
 * - POST deploy once (optional)
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadProjectEnv } from "./load-env.mjs";
import {
  BELLA_NAPOLI_AGENT_ID,
  BELLA_NAPOLI_BRANCH_ID,
  BELLA_NAPOLI_FIRST_MESSAGE,
  BELLA_NAPOLI_PROMPT,
  BELLA_NAPOLI_RESTAURANT_ID,
  BELLA_NAPOLI_TOOL_ID,
  BELLA_NAPOLI_VOICE_ID,
} from "./bella-napoli-prompt.mjs";

loadProjectEnv();

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
const webhookSecret = process.env.ORDERS_WEBHOOK_SECRET?.trim();
const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://reception-ai-zeta.vercel.app";
const restaurantId =
  process.env.NEXT_PUBLIC_BELLA_NAPOLI_RESTAURANT_ID?.trim() || BELLA_NAPOLI_RESTAURANT_ID;
const voiceId = process.env.BELLA_NAPOLI_VOICE_ID?.trim() || BELLA_NAPOLI_VOICE_ID;
const contentTypeSecretId =
  process.env.ELEVENLABS_CONTENT_TYPE_SECRET_ID?.trim() || "8yQvSrjQyu1yIOlhI89n";

let agentId =
  process.env.NEXT_PUBLIC_BELLA_NAPOLI_AGENT_ID?.trim() || BELLA_NAPOLI_AGENT_ID || "";
let branchId = process.env.BELLA_NAPOLI_BRANCH_ID?.trim() || BELLA_NAPOLI_BRANCH_ID || "";
let orderToolId =
  process.env.BELLA_NAPOLI_ORDER_TOOL_ID?.trim() || BELLA_NAPOLI_TOOL_ID || "";

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

async function ensureWebhookSecretId() {
  const { secrets = [] } = await api("GET", "/secrets");
  const existing = secrets.find((s) => s.name === "astor_webhook_secret");
  if (existing?.secret_id) return existing.secret_id;
  if (!webhookSecret) return null;
  const created = await api("POST", "/secrets", {
    type: "new",
    name: "astor_webhook_secret",
    value: webhookSecret,
  });
  return created.secret_id ?? created.id;
}

function buildToolConfig(secretId) {
  const requestHeaders = {
    "Content-Type": { secret_id: contentTypeSecretId },
  };
  if (secretId) {
    requestHeaders["x-webhook-secret"] = { secret_id: secretId };
  }

  return {
    type: "webhook",
    name: "create_order_webhook",
    description:
      "Enregistrer la commande Bella Napoli après confirmation explicite. Appeler une seule fois. customerPhone obligatoire (+33…). Inclure pickupTime si heure connue. notes = mode emporter/livraison + adresse si livraison.",
    response_timeout_secs: 20,
    execution_mode: "immediate",
    api_schema: {
      url: `${appUrl}/api/orders/from-call`,
      method: "POST",
      content_type: "application/json",
      request_headers: requestHeaders,
      request_body_schema: {
        type: "object",
        required: ["customerPhone", "items"],
        description: "Payload commande Bella Napoli / ASTOR",
        properties: {
          restaurantId: {
            type: "string",
            constant_value: restaurantId,
          },
          customerPhone: {
            type: "string",
            description: "Mobile client au format +33… (appelant ou demandé à l'oral)",
          },
          customerName: {
            type: "string",
            description: "Prénom du client",
          },
          callId: {
            type: "string",
            dynamic_variable: "system__call_sid",
          },
          notes: {
            type: "string",
            description:
              "Mode (emporter/livraison) + adresse si livraison + détails utiles",
          },
          pickupTime: {
            type: "string",
            description:
              'Heure retrait/livraison : "19:30", "dans 20 min". Omettre si dès que possible.',
          },
          items: {
            type: "array",
            description: "Lignes de commande",
            items: {
              type: "object",
              required: ["name", "quantity", "unitPrice"],
              description: "Article",
              properties: {
                name: { type: "string", description: "Nom exact carte" },
                quantity: { type: "number", description: "Quantité" },
                unitPrice: { type: "number", description: "Prix unitaire EUR" },
              },
            },
          },
        },
      },
    },
  };
}

function conversationConfig(toolIds) {
  return {
    agent: {
      language: "fr",
      first_message: BELLA_NAPOLI_FIRST_MESSAGE,
      prompt: {
        prompt: BELLA_NAPOLI_PROMPT,
        tool_ids: toolIds,
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
      model_id: "eleven_flash_v2_5",
      voice_id: voiceId,
      speed: 1.05,
      stability: 0.62,
      similarity_boost: 0.8,
      optimize_streaming_latency: 4,
    },
  };
}

function writePromptConstants({ agentId: aid, branchId: bid, toolId: tid }) {
  const promptPath = join(__dirname, "bella-napoli-prompt.mjs");
  let src = readFileSync(promptPath, "utf8");
  src = src.replace(
    /export const BELLA_NAPOLI_AGENT_ID = "[^"]*";/,
    `export const BELLA_NAPOLI_AGENT_ID = "${aid}";`,
  );
  src = src.replace(
    /export const BELLA_NAPOLI_BRANCH_ID = "[^"]*";/,
    `export const BELLA_NAPOLI_BRANCH_ID = "${bid ?? ""}";`,
  );
  src = src.replace(
    /export const BELLA_NAPOLI_TOOL_ID = "[^"]*";/,
    `export const BELLA_NAPOLI_TOOL_ID = "${tid}";`,
  );
  writeFileSync(promptPath, src);
}

function upsertEnvLocal(agentIdValue) {
  const envPath = join(root, ".env.local");
  if (!existsSync(envPath)) {
    writeFileSync(
      envPath,
      `NEXT_PUBLIC_BELLA_NAPOLI_AGENT_ID=${agentIdValue}\nNEXT_PUBLIC_BELLA_NAPOLI_RESTAURANT_ID=${restaurantId}\n`,
    );
    return;
  }
  let env = readFileSync(envPath, "utf8");
  if (/^NEXT_PUBLIC_BELLA_NAPOLI_AGENT_ID=/m.test(env)) {
    env = env.replace(
      /^NEXT_PUBLIC_BELLA_NAPOLI_AGENT_ID=.*$/m,
      `NEXT_PUBLIC_BELLA_NAPOLI_AGENT_ID=${agentIdValue}`,
    );
  } else {
    env += `\nNEXT_PUBLIC_BELLA_NAPOLI_AGENT_ID=${agentIdValue}\n`;
  }
  if (/^NEXT_PUBLIC_BELLA_NAPOLI_RESTAURANT_ID=/m.test(env)) {
    env = env.replace(
      /^NEXT_PUBLIC_BELLA_NAPOLI_RESTAURANT_ID=.*$/m,
      `NEXT_PUBLIC_BELLA_NAPOLI_RESTAURANT_ID=${restaurantId}`,
    );
  } else {
    env += `NEXT_PUBLIC_BELLA_NAPOLI_RESTAURANT_ID=${restaurantId}\n`;
  }
  writeFileSync(envPath, env);
}

console.log("\n🍕 ElevenLabs — Bella Napoli (pro / flash / structuré)\n");

// 1) Reuse existing pizzeria agent if present
if (!agentId) {
  const listed = await api("GET", "/agents");
  const agents = listed.agents ?? listed ?? [];
  const found = (Array.isArray(agents) ? agents : []).find((a) => {
    const n = (a.name ?? "").toLowerCase();
    return n.includes("bella napoli") || n.includes("pizzeria");
  });
  if (found) {
    agentId = found.agent_id ?? found.id;
    console.log(`♻️  Agent existant réutilisé: ${agentId}`);
  }
}

// 2) Ensure dedicated webhook tool (create once OR patch existing)
const secretId = await ensureWebhookSecretId();
const toolConfig = buildToolConfig(secretId);

if (orderToolId) {
  await api("PATCH", `/tools/${orderToolId}`, { tool_config: toolConfig });
  console.log(`✅ Webhook tool OK: ${orderToolId}`);
} else {
  const { tools = [] } = await api("GET", "/tools");
  const existing = tools.find((t) => {
    const rid =
      t.tool_config?.api_schema?.request_body_schema?.properties?.restaurantId
        ?.constant_value;
    return rid === restaurantId;
  });
  if (existing) {
    orderToolId = existing.id ?? existing.tool_id;
    await api("PATCH", `/tools/${orderToolId}`, { tool_config: toolConfig });
    console.log(`♻️  Webhook tool réutilisé: ${orderToolId}`);
  } else {
    const created = await api("POST", "/tools", { tool_config: toolConfig });
    orderToolId = created.id ?? created.tool_id;
    console.log(`✅ Webhook tool créé: ${orderToolId}`);
  }
}

const cfg = conversationConfig([orderToolId]);

// 3) Create OR single PATCH
if (!agentId) {
  const created = await api("POST", "/agents/create", {
    name: "Bella Napoli Reception",
    conversation_config: cfg,
  });
  agentId = created.agent_id ?? created.id;
  branchId = created.branch_id ?? created.main_branch_id ?? branchId;
  console.log(`✅ Agent créé: ${agentId}`);
} else {
  await api("PATCH", `/agents/${agentId}`, {
    name: "Bella Napoli Reception",
    conversation_config: cfg,
  });
  console.log(`✅ Agent mis à jour (prompt + Emilie + flash): ${agentId}`);
}

// Resolve branch if still unknown
if (!branchId) {
  try {
    const agent = await api("GET", `/agents/${agentId}`);
    branchId =
      agent.branch_id ??
      agent.main_branch_id ??
      agent.platform_settings?.branch_id ??
      "";
  } catch {
    /* ignore */
  }
}

// 4) Publish once
if (branchId) {
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
} else {
  console.log("⚠️  Pas de branch_id — skip publish (config déjà sur l'agent)");
}

writePromptConstants({ agentId, branchId, toolId: orderToolId });
upsertEnvLocal(agentId);

const updated = await api("GET", `/agents/${agentId}`);
const tts = updated.conversation_config?.tts ?? {};
console.log(`   Langue      : ${updated.conversation_config?.agent?.language}`);
console.log(`   LLM         : ${updated.conversation_config?.agent?.prompt?.llm}`);
console.log(`   TTS         : ${tts.model_id} · speed ${tts.speed}`);
console.log(`   Voix        : ${tts.voice_id}`);
console.log(`   1er message : ${updated.conversation_config?.agent?.first_message}`);
console.log(`   restaurantId: ${restaurantId}`);
console.log("\nTest : /demo-pizza\n");
console.log(`NEXT_PUBLIC_BELLA_NAPOLI_AGENT_ID=${agentId}`);
