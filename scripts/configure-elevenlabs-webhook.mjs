#!/usr/bin/env node
/**
 * Corrige l'outil webhook ElevenLabs create_order pour ASTOR.
 *
 * Usage: npm run elevenlabs:configure-webhook
 */

import { loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
const webhookSecret = process.env.ORDERS_WEBHOOK_SECRET?.trim();
const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://reception-ai-zeta.vercel.app";
const restaurantId =
  process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID?.trim() ||
  "11111111-1111-1111-1111-111111111111";
const toolId = process.env.ELEVENLABS_ORDER_TOOL_ID?.trim() || "tool_3301kqj2kvqjegcv47ycvw8qqzbk";
const agentId =
  process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID?.trim() ||
  "agent_1301khmc2x71e30anhrycs0cqhky";
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

  if (!webhookSecret) {
    console.log("⚠️  ORDERS_WEBHOOK_SECRET absent — header x-webhook-secret non configure.");
    return null;
  }

  const created = await api("POST", "/secrets", {
    type: "new",
    name: "astor_webhook_secret",
    value: webhookSecret,
  });
  return created.secret_id ?? created.id;
}

console.log("\n🔧 ElevenLabs — configuration webhook create_order\n");

const secretId = await ensureWebhookSecretId();
const requestHeaders = {
  "Content-Type": { secret_id: contentTypeSecretId },
};
if (secretId) {
  requestHeaders["x-webhook-secret"] = { secret_id: secretId };
}

const toolConfig = {
  type: "webhook",
  name: "create_order_webhook",
  description:
    "Creer la commande client apres confirmation explicite. Utiliser le numero appelant, les articles du menu et les prix.",
  response_timeout_secs: 25,
  api_schema: {
    url: `${appUrl}/api/orders/from-call`,
    method: "POST",
    content_type: "application/json",
    request_headers: requestHeaders,
    request_body_schema: {
      type: "object",
      required: ["customerPhone", "items"],
      description: "Payload commande restaurant ASTOR",
      properties: {
        restaurantId: {
          type: "string",
          constant_value: restaurantId,
        },
        customerPhone: {
          type: "string",
          dynamic_variable: "system__caller_id",
        },
        customerName: { type: "string", description: "Prenom du client" },
        callId: {
          type: "string",
          dynamic_variable: "system__call_sid",
        },
        notes: { type: "string", description: "Notes de commande" },
        items: {
          type: "array",
          description: "Articles commandes",
          items: {
            type: "object",
            required: ["name", "quantity", "unitPrice"],
            description: "Ligne de commande",
            properties: {
              name: { type: "string", description: "Nom du produit" },
              quantity: { type: "number", description: "Quantite" },
              unitPrice: { type: "number", description: "Prix unitaire EUR" },
            },
          },
        },
      },
    },
  },
};

await api("PATCH", `/tools/${toolId}`, { tool_config: toolConfig });
console.log(`✅ Outil webhook mis a jour (${toolId})`);

const agent = await api("GET", `/agents/${agentId}`);
const toolIds = agent?.conversation_config?.agent?.prompt?.tool_ids ?? [];
if (!toolIds.includes(toolId)) {
  await api("PATCH", `/agents/${agentId}`, {
    conversation_config: {
      agent: {
        prompt: {
          tool_ids: [...toolIds, toolId],
        },
      },
    },
  });
  console.log(`✅ Outil attache a l'agent ${agentId}`);
} else {
  console.log("✅ Outil deja attache a l'agent");
}

console.log("\nTest webhook prod…");
const testRes = await fetch(`${appUrl}/api/orders/from-call`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    ...(webhookSecret ? { "x-webhook-secret": webhookSecret } : {}),
  },
  body: JSON.stringify({
    callId: `el_test_${Date.now()}`,
    restaurantId,
    customerPhone: process.env.TEST_CUSTOMER_PHONE || "+33695846441",
    customerName: "Test ElevenLabs",
    items: [{ name: "Burger Classique", quantity: 1, unitPrice: 8.9 }],
  }),
});
const testBody = await testRes.json();
console.log(testRes.ok ? `✅ Webhook OK (${testBody.orderNumber})` : `❌ Webhook ${testRes.status}: ${JSON.stringify(testBody)}`);

console.log("\nProchain test : appelle +19716266228 et passe une commande.\n");
