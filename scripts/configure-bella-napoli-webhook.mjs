#!/usr/bin/env node
/**
 * Configure l'outil webhook Bella Napoli (restaurantId dédié).
 *
 * Usage: npm run elevenlabs:configure-bella-napoli-webhook
 *
 * Token budget: create tool OR patch existing — no conversation/TTS calls.
 */

import { loadProjectEnv } from "./load-env.mjs";
import {
  BELLA_NAPOLI_AGENT_ID,
  BELLA_NAPOLI_RESTAURANT_ID,
  BELLA_NAPOLI_TOOL_ID,
} from "./bella-napoli-prompt.mjs";

loadProjectEnv();

const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
const webhookSecret = process.env.ORDERS_WEBHOOK_SECRET?.trim();
const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://reception-ai-zeta.vercel.app";
const restaurantId =
  process.env.NEXT_PUBLIC_BELLA_NAPOLI_RESTAURANT_ID?.trim() || BELLA_NAPOLI_RESTAURANT_ID;
const toolIdEnv = process.env.BELLA_NAPOLI_ORDER_TOOL_ID?.trim() || BELLA_NAPOLI_TOOL_ID;
const agentId =
  process.env.NEXT_PUBLIC_BELLA_NAPOLI_AGENT_ID?.trim() || BELLA_NAPOLI_AGENT_ID;
const contentTypeSecretId =
  process.env.ELEVENLABS_CONTENT_TYPE_SECRET_ID?.trim() || "8yQvSrjQyu1yIOlhI89n";

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

console.log("\n🔧 ElevenLabs — webhook Bella Napoli\n");

const secretId = await ensureWebhookSecretId();
const toolConfig = buildToolConfig(secretId);

let toolId = toolIdEnv;
if (toolId) {
  await api("PATCH", `/tools/${toolId}`, { tool_config: toolConfig });
  console.log(`✅ Outil existant mis à jour: ${toolId}`);
} else {
  // Cherche un outil déjà nommé pour Bella (évite les doublons)
  const { tools = [] } = await api("GET", "/tools");
  const existing = tools.find((t) => {
    const name = t.tool_config?.name ?? t.name ?? "";
    const url = t.tool_config?.api_schema?.url ?? "";
    const rid =
      t.tool_config?.api_schema?.request_body_schema?.properties?.restaurantId
        ?.constant_value;
    return (
      name === "create_order_webhook" &&
      (rid === restaurantId ||
        (typeof url === "string" && url.includes("from-call") && rid === restaurantId))
    );
  });
  if (existing) {
    toolId = existing.id ?? existing.tool_id;
    await api("PATCH", `/tools/${toolId}`, { tool_config: toolConfig });
    console.log(`✅ Outil Bella Napoli réutilisé: ${toolId}`);
  } else {
    const created = await api("POST", "/tools", { tool_config: toolConfig });
    toolId = created.id ?? created.tool_id;
    console.log(`✅ Outil créé: ${toolId}`);
  }
}

if (agentId) {
  const agent = await api("GET", `/agents/${agentId}`);
  const toolIds = agent?.conversation_config?.agent?.prompt?.tool_ids ?? [];
  if (!toolIds.includes(toolId)) {
    await api("PATCH", `/agents/${agentId}`, {
      conversation_config: {
        agent: { prompt: { tool_ids: [...toolIds, toolId] } },
      },
    });
    console.log("✅ Outil attaché à l'agent");
  } else {
    console.log("✅ Outil déjà attaché");
  }
} else {
  console.log("ℹ️  Pas d'agent_id encore — attache via configure-bella-napoli-agent");
}

console.log(`\nBELLA_NAPOLI_TOOL_ID=${toolId}`);
console.log(`restaurantId=${restaurantId}\n`);
