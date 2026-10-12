import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseAdminClient } from "@/lib/supabase";
import { parseTwilioApiError } from "@/lib/twilio";

export const runtime = "nodejs";

/** Numéro qui reçoit un SMS à chaque nouvelle demande de contact. */
const NOTIFY_TO = process.env.CONTACT_SMS_TO?.trim() || "+33695846441";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  restaurant: z.string().trim().max(120).optional().default(""),
  city: z.string().trim().max(80).optional().default(""),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(30)
    .refine((v) => v.replace(/[\s.-]/g, "").length >= 8, "phone_too_short"),
  email: z.string().trim().email().max(160),
  message: z.string().trim().max(1500).optional().default(""),
  website: z.string().max(200).optional(), // pot de miel anti-robots
});

type Contact = z.infer<typeof contactSchema>;

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 4;
const rate = new Map<string, { count: number; resetAt: number }>();

function limited(ip: string) {
  const now = Date.now();
  const e = rate.get(ip);
  if (!e || now > e.resetAt) {
    rate.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  e.count += 1;
  return e.count > RATE_MAX;
}

async function store(c: Contact) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return false;
  const { error } = await supabase.from("leads").insert({
    restaurant_name: c.restaurant || c.name,
    city: c.city || "—",
    phone: c.phone,
    email: c.email,
    cuisine_type: "autre",
    message: [`Contact : ${c.name}`, c.message].filter(Boolean).join("\n"),
    source: "contact_form",
  });
  if (error) console.error("[contact] supabase:", error.message);
  return !error;
}

async function notifyBySms(c: Contact) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) return false;
  const body = [
    "Nouveau contact ligne-ai.com",
    `${c.name}${c.restaurant ? ` — ${c.restaurant}` : ""}${c.city ? ` (${c.city})` : ""}`,
    `Tél : ${c.phone}`,
    `Mail : ${c.email}`,
    c.message ? `« ${c.message.slice(0, 220)} »` : null,
  ]
    .filter(Boolean)
    .join("\n");
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: NOTIFY_TO, From: from, Body: body }).toString(),
  });
  if (!res.ok) console.error("[contact] sms:", parseTwilioApiError(await res.text()));
  return res.ok;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true }); // robot : on ignore sans le dire

  const [stored, notified] = await Promise.all([store(parsed.data).catch(() => false), notifyBySms(parsed.data).catch(() => false)]);
  // Trace complète dans les journaux du serveur : aucune demande n'est perdue, même si la base est indisponible.
  const { website: _honeypot, ...contact } = parsed.data;
  void _honeypot;
  console.info("[contact] reçu", JSON.stringify({ at: new Date().toISOString(), stored, notified, contact }));
  if (!stored && !notified) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  return NextResponse.json({ ok: true });
}
