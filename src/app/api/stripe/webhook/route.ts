import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

import { brandedHtml, OWNER_EMAIL, sendMail } from "@/lib/mail";
import { SITE_URL } from "@/lib/site";
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
  await sendMail({ to: OWNER_EMAIL(), subject, text: lines.filter(Boolean).join("\n") });
}

const PLAN_NAMES: Record<string, string> = { essentiel: "Essentiel", pro: "Pro", business: "Business" };

/** E-mail de bienvenue au nouvel abonné, avec le lien vers son formulaire d'installation. */
async function welcome(email: string, sessionId: string, plan: string | null, restaurant: string | null) {
  const url = `${SITE_URL}/installation?session_id=${encodeURIComponent(sessionId)}`;
  const planName = plan ? PLAN_NAMES[plan] ?? plan : "";
  await sendMail({
    to: email,
    replyTo: OWNER_EMAIL(),
    subject: "Bienvenue dans l’équipe Ligne",
    text: [
      "Bonjour,",
      `Merci de faire partie de l’équipe Ligne${restaurant ? `, et bienvenue à ${restaurant}` : ""} ! Votre abonnement ${planName} est actif.`,
      `Dernière étape : remplissez votre formulaire d’installation (5 minutes) : ${url}`,
      "Dès réception, on configure votre agent sur votre carte et votre téléphone est pris en charge sous 24 h, sans rendez-vous.",
      "Sofiane, fondateur de Ligne · 06 95 84 64 41",
    ].join("\n\n"),
    html: brandedHtml({
      title: "Merci de faire partie de l’équipe Ligne.",
      paragraphs: [
        `Votre abonnement ${planName} est actif${restaurant ? ` pour ${restaurant}` : ""}. À partir de maintenant, plus aucun appel ne sonnera dans le vide.`,
        "Dernière étape : remplissez votre formulaire d’installation. Ça prend 5 minutes : votre carte, vos horaires et votre numéro.",
        "Dès réception, on configure votre agent et votre téléphone est pris en charge sous 24 h, entièrement à distance.",
      ],
      cta: { label: "Remplir mon formulaire d’installation", url },
    }),
  });
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
        "Le client a reçu l’e-mail de bienvenue avec son formulaire d’installation.",
      ]);
      if (s.customer_details?.email) await welcome(s.customer_details.email, s.id, plan, restaurant);
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
