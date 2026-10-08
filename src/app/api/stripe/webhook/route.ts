import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";

/** Enregistre / met à jour l'abonnement (table subscriptions, voir supabase/subscriptions.sql). */
async function upsertSubscription(row: Record<string, unknown>) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;
  const { error } = await supabase.from("subscriptions").upsert(row, { onConflict: "stripe_subscription_id" });
  if (error) console.error("[stripe-webhook] supabase:", error.message);
}

async function notify(subject: string, lines: (string | null | undefined)[]) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return;
  const to = process.env.CONTACT_EMAIL?.trim() || "contact@agencybinari.com";
  const from = process.env.RESEND_FROM_EMAIL?.trim() || "LIGNE <onboarding@resend.dev>";
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text: lines.filter(Boolean).join("\n") }),
  }).catch((e) => console.error("[stripe-webhook] resend:", e));
}

/**
 * Webhook Stripe : nouvel abonné, changements et résiliations.
 * Configurer dans Stripe : événements checkout.session.completed, customer.subscription.updated,
 * customer.subscription.deleted, invoice.payment_failed → URL /api/stripe/webhook.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripe || !secret) return NextResponse.json({ ok: false }, { status: 503 });

  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature ?? "", secret);
  } catch (err) {
    console.error("[stripe-webhook] signature invalide", err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object;
      const restaurant = s.custom_fields?.find((f) => f.key === "restaurant")?.text?.value ?? null;
      const plan = s.metadata?.ligne_plan ?? null;
      await upsertSubscription({
        stripe_subscription_id: typeof s.subscription === "string" ? s.subscription : s.subscription?.id,
        stripe_customer_id: typeof s.customer === "string" ? s.customer : s.customer?.id,
        plan,
        status: "active",
        restaurant_name: restaurant,
        email: s.customer_details?.email ?? null,
        phone: s.customer_details?.phone ?? null,
        updated_at: new Date().toISOString(),
      });
      await notify(`[LIGNE] Nouvel abonné ${plan ?? ""} — ${restaurant ?? "restaurant"}`, [
        "Nouvel abonnement payé sur le site.",
        `Formule : ${plan}`,
        `Restaurant : ${restaurant}`,
        `E-mail : ${s.customer_details?.email}`,
        `Téléphone : ${s.customer_details?.phone}`,
        "À faire : planifier l’installation sous 24 h.",
      ]);
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      await upsertSubscription({
        stripe_subscription_id: sub.id,
        stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
        plan: sub.metadata?.ligne_plan ?? null,
        status: sub.status,
        updated_at: new Date().toISOString(),
      });
      if (event.type === "customer.subscription.deleted") {
        await notify("[LIGNE] Résiliation d’abonnement", [`Abonnement : ${sub.id}`, `Client Stripe : ${String(sub.customer)}`]);
      }
      break;
    }
    case "invoice.payment_failed": {
      const inv = event.data.object;
      await notify("[LIGNE] Paiement échoué", [`Facture : ${inv.id}`, `Client : ${inv.customer_email ?? String(inv.customer)}`]);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
