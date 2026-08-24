#!/usr/bin/env node
/**
 * Configure l'outil webhook El Bahja (pickupTime, téléphone libre pour la démo web).
 *
 * Usage: npm run elevenlabs:configure-elbahja-webhook
 */

import { loadProjectEnv } from "./load-env.mjs";
import {
  EL_BAHJA_AGENT_ID,
  EL_BAHJA_RESTAURANT_ID,
  EL_BAHJA_TOOL_ID,
} from "./el-bahja-prompt.mjs";

loadProjectEnv();

const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
const webhookSecret = process.env.ORDERS_WEBHOOK_SECRET?.trim();
const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://reception-ai-zeta.vercel.app";
const restaurantId =
  process.env.NEXT_PUBLIC_ELBAHJA_RESTAURANT_ID?.trim() || EL_BAHJA_RESTAURANT_ID;
const toolId = process.env.ELBAHJA_ORDER_TOOL_ID?.trim() || EL_BAHJA_TOOL_ID;
const agentId = process.env.NEXT_PUBLIC_ELBAHJA_AGENT_ID?.trim() || EL_BAHJA_AGENT_ID;
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

console.log("\n🔧 ElevenLabs — webhook El Bahja\n");

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
    "Enregistrer la commande El Bahja après confirmation explicite. Appeler une seule fois. customerPhone obligatoire (+33…). Inclure pickupTime si heure connue.",
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
      description: "Payload commande El Bahja / ASTOR",
      properties: {
        restaurantId: {
          type: "string",
          constant_value: restaurantId,
        },
        // Libre : téléphone appelant OU demandé à l'oral (démo web)
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
          description: "Mode (emporter/sur place) + détails utiles",
        },
        pickupTime: {
          type: "string",
          description: 'Heure retrait : "19:30", "dans 20 min". Omettre si dès que possible.',
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

await api("PATCH", `/tools/${toolId}`, { tool_config: toolConfig });
console.log(`✅ Outil ${toolId} mis à jour`);

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

console.log("\nTest webhook…");
const testRes = await fetch(`${appUrl}/api/orders/from-call`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    ...(webhookSecret ? { "x-webhook-secret": webhookSecret } : {}),
  },
  body: JSON.stringify({
    callId: `elbahja_demo_${Date.now()}`,
    restaurantId,
    customerPhone: process.env.TEST_CUSTOMER_PHONE || "+33695846441",
    customerName: "Demo",
    notes: "emporter",
    pickupTime: "dans 20 min",
    items: [
      { name: "Formule Sandwich Merguez", quantity: 1, unitPrice: 6.5 },
      { name: "Sauce Algérienne", quantity: 1, unitPrice: 0 },
      { name: "Moyenne frite", quantity: 1, unitPrice: 4 },
    ],
  }),
});
const testBody = await testRes.json();
console.log(
  testRes.ok
    ? `✅ Webhook OK (${testBody.orderNumber})`
    : `❌ Webhook ${testRes.status}: ${JSON.stringify(testBody)}`,
);
console.log("");
