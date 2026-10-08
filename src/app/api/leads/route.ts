import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase";
import { trialLeadSchema } from "@/lib/validators";

export const runtime = "nodejs";

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;

type RateEntry = { count: number; resetAt: number };

const rateLimitStore = new Map<string, RateEntry>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (entry.count > RATE_MAX) return true;
  return false;
}

type LeadPayload = {
  restaurantName: string;
  city: string;
  phone: string;
  email: string;
  cuisineType: string;
  message?: string;
};

async function storeInSupabase(lead: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return { ok: false, error: "supabase_unavailable" };

  const { error } = await supabase.from("leads").insert({
    restaurant_name: lead.restaurantName,
    city: lead.city,
    phone: lead.phone,
    email: lead.email,
    cuisine_type: lead.cuisineType,
    message: lead.message ?? null,
    source: "marketing_trial",
  });

  if (error) {
    console.error("[leads] supabase insert failed:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

async function postWebhook(lead: LeadPayload): Promise<boolean> {
  const url = process.env.LEADS_WEBHOOK_URL?.trim();
  if (!url) return false;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "astor_trial_lead",
        receivedAt: new Date().toISOString(),
        ...lead,
      }),
    });
    if (!res.ok) {
      console.error("[leads] webhook failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[leads] webhook error:", err);
    return false;
  }
}

async function sendResendEmail(lead: LeadPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_EMAIL?.trim() || "contact@agencybinari.com";
  if (!apiKey) return false;

  const from = process.env.RESEND_FROM_EMAIL?.trim() || "LIGNE Leads <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email,
        subject: `[LIGNE essai] ${lead.restaurantName} — ${lead.city}`,
        text: [
          "Nouvelle demande d'essai LIGNE",
          "",
          `Restaurant : ${lead.restaurantName}`,
          `Ville : ${lead.city}`,
          `Cuisine : ${lead.cuisineType}`,
          `Téléphone : ${lead.phone}`,
          `E-mail : ${lead.email}`,
          lead.message ? `Message : ${lead.message}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    });

    if (!res.ok) {
      console.error("[leads] resend failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[leads] resend error:", err);
    return false;
  }
}

function logLead(lead: LeadPayload) {
  console.info(
    "[leads] captured",
    JSON.stringify({
      at: new Date().toISOString(),
      restaurantName: lead.restaurantName,
      city: lead.city,
      cuisineType: lead.cuisineType,
      phone: lead.phone,
      email: lead.email,
      message: lead.message ?? null,
    }),
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Trop de demandes. Réessayez dans une minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalide." }, { status: 400 });
  }

  const parsed = trialLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Champs invalides.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Honeypot filled → pretend success
  if (parsed.data.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const lead: LeadPayload = {
    restaurantName: parsed.data.restaurantName,
    city: parsed.data.city,
    phone: parsed.data.phone,
    email: parsed.data.email,
    cuisineType: parsed.data.cuisineType,
    message: parsed.data.message,
  };

  const [supabaseResult, webhookOk, emailOk] = await Promise.all([
    storeInSupabase(lead),
    postWebhook(lead),
    sendResendEmail(lead),
  ]);

  logLead(lead);

  const delivered = supabaseResult.ok || webhookOk || emailOk;

  return NextResponse.json({
    ok: true,
    delivered,
    channels: {
      supabase: supabaseResult.ok,
      webhook: webhookOk,
      email: emailOk,
    },
    // Client can offer mailto if nothing was delivered remotely
    mailtoHint: delivered
      ? undefined
      : `mailto:contact@agencybinari.com?subject=${encodeURIComponent(`Essai LIGNE — ${lead.restaurantName}`)}&body=${encodeURIComponent(
          `Restaurant: ${lead.restaurantName}\nVille: ${lead.city}\nCuisine: ${lead.cuisineType}\nTél: ${lead.phone}\nEmail: ${lead.email}\n${lead.message ? `Message: ${lead.message}` : ""}`,
        )}`,
  });
}
