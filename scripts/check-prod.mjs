#!/usr/bin/env node
/**
 * Verifie l'etat de production ASTOR (health, webhook, gaps de config).
 *
 * Usage:
 *   npm run check:prod
 *   WEBHOOK_BASE_URL=https://reception-ai-zeta.vercel.app npm run check:prod
 */

import { loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const baseUrl =
  process.env.WEBHOOK_BASE_URL?.trim() ||
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  "https://reception-ai-zeta.vercel.app";

const secret = process.env.ORDERS_WEBHOOK_SECRET?.trim();
const testPhone = process.env.TEST_CUSTOMER_PHONE?.trim() || process.env.TEST_SMS_PHONE?.trim();

const checks = [];

function add(name, ok, detail, action) {
  checks.push({ name, ok, detail, action });
}

console.log(`\nASTOR — verification prod\n  URL: ${baseUrl}\n`);

let health;
try {
  const res = await fetch(`${baseUrl}/api/health`);
  health = await res.json();
  add("Health HTTP", res.ok, `status=${health.status}`, res.ok ? null : "Verifier le deploiement Vercel");
} catch (err) {
  add("Health HTTP", false, String(err.message ?? err), "L'app est-elle deployee ?");
  printReport();
  process.exit(1);
}

const h = health.checks ?? {};
add("Supabase", h.supabase === true, String(h.supabase));
add("Database", h.database === true, String(h.database), h.database ? null : "Reactiver le projet Supabase si pause");
add("Twilio", h.twilio === true, String(h.twilio), h.twilio ? null : "Ajouter TWILIO_* sur Vercel");
add(
  "Webhook secret (Vercel)",
  h.webhookSecret === true,
  h.webhookSecret ? "configure" : "absent — webhook ouvert",
  h.webhookSecret ? null : "vercel login puis npm run sync:vercel (ou VERCEL_TOKEN=... npm run sync:vercel)",
);
add(
  "URL stable",
  health.appUrl?.includes("reception-ai-zeta.vercel.app"),
  health.appUrl ?? "n/a",
);
add("SMS status webhook", Boolean(health.smsStatusWebhookUrl), health.smsStatusWebhookUrl ?? "n/a");

if (secret) {
  try {
    const phone = testPhone || "+33612345678";
    const res = await fetch(`${baseUrl}/api/orders/from-call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": secret,
      },
      body: JSON.stringify({
        callId: `check_${Date.now()}`,
        restaurantId: process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID ?? "11111111-1111-1111-1111-111111111111",
        customerPhone: phone,
        customerName: "Check Prod",
        items: [{ name: "Test", quantity: 1, unitPrice: 1 }],
      }),
    });
    const body = await res.json();
    const smsOk = body.sms?.sent === true;
    const smsTrial =
      body.sms?.reason?.includes("21608") || body.sms?.reason?.includes("unverified");
    add(
      "Webhook commande",
      res.status === 201,
      `HTTP ${res.status}`,
      res.status === 201 ? null : "Verifier ORDERS_WEBHOOK_SECRET et Supabase",
    );
    if (res.status === 201) {
      add(
        "SMS confirmation",
        smsOk,
        smsOk ? `sid ${body.sms?.messageSid ?? "ok"}` : (body.sms?.reason ?? "non envoye").slice(0, 120),
        smsTrial
          ? "Compte Twilio Trial : ajouter TEST_CUSTOMER_PHONE=+33... (numero verifie Twilio) dans .env.local"
          : h.twilio
            ? null
            : "Configurer Twilio sur Vercel",
      );
    }
  } catch (err) {
    add("Webhook commande", false, String(err.message ?? err));
  }
} else {
  add("Webhook commande", false, "ORDERS_WEBHOOK_SECRET absent en local", "Remplir .env.local");
}

printReport();

function printReport() {
  console.log("Resultats :\n");
  let failed = 0;
  for (const c of checks) {
    const icon = c.ok ? "✅" : "❌";
    console.log(`${icon} ${c.name}: ${c.detail}`);
    if (!c.ok && c.action) console.log(`   → ${c.action}`);
    if (!c.ok) failed++;
  }
  console.log(failed ? `\n${failed} point(s) a corriger.\n` : "\nTout est OK.\n");
  process.exit(failed ? 1 : 0);
}
