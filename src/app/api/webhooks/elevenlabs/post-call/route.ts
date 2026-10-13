import { NextRequest, NextResponse } from "next/server";

import { verifyElevenLabsSignature } from "@/lib/elevenlabs-webhook";
import { reportCallMinutes } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";

type PostCallEvent = {
  type?: string;
  data?: {
    agent_id?: string;
    conversation_id?: string;
    metadata?: { call_duration_secs?: number; start_time_unix_secs?: number };
  };
};

/**
 * Webhook « post-call » ElevenLabs : à la fin de chaque appel, déclare à Stripe les minutes consommées
 * par le restaurant propriétaire de l'agent (minute entamée = minute due).
 * Les appels des agents de démonstration, ou d'un restaurant sans client Stripe, sont ignorés.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET?.trim();
  if (!secret) return NextResponse.json({ ok: false }, { status: 503 });

  const rawBody = await req.text();
  if (!verifyElevenLabsSignature(rawBody, req.headers.get("elevenlabs-signature"), secret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as PostCallEvent;
  const agentId = event.data?.agent_id;
  const conversationId = event.data?.conversation_id;
  const durationSecs = Math.round(event.data?.metadata?.call_duration_secs ?? 0);
  if (event.type !== "post_call_transcription" || !agentId || !conversationId || durationSecs <= 0) {
    return NextResponse.json({ received: true, billed: false });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, stripe_customer_id")
    .eq("elevenlabs_agent_id", agentId)
    .maybeSingle();
  if (!restaurant?.stripe_customer_id) {
    return NextResponse.json({ received: true, billed: false });
  }

  const { data: existing } = await supabase
    .from("billed_calls")
    .select("reported_at")
    .eq("conversation_id", conversationId)
    .maybeSingle();
  if (existing?.reported_at) return NextResponse.json({ received: true, billed: true });

  const minutes = Math.ceil(durationSecs / 60);
  const startedAt = event.data?.metadata?.start_time_unix_secs;
  await supabase.from("billed_calls").upsert({
    conversation_id: conversationId,
    restaurant_id: restaurant.id,
    agent_id: agentId,
    stripe_customer_id: restaurant.stripe_customer_id,
    duration_secs: durationSecs,
    minutes,
    started_at: startedAt ? new Date(startedAt * 1000).toISOString() : null,
  });

  try {
    await reportCallMinutes(restaurant.stripe_customer_id, minutes, conversationId);
  } catch (err) {
    // ElevenLabs renvoie le webhook en cas d'échec ; Stripe ignore les doublons (même identifiant d'appel).
    console.error("[post-call] déclaration Stripe échouée", conversationId, err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  await supabase.from("billed_calls").update({ reported_at: new Date().toISOString() }).eq("conversation_id", conversationId);
  return NextResponse.json({ received: true, billed: true, minutes });
}
