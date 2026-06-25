import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdminClient();
  const twilioConfigured = Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER,
  );
  const webhookSecretConfigured = Boolean(process.env.ORDERS_WEBHOOK_SECRET?.trim());
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? "agent_1301khmc2x71e30anhrycs0cqhky";

  let databaseOk = false;
  let databaseError: string | undefined;

  if (supabase) {
    const { error } = await supabase.from("restaurants").select("id").limit(1);
    databaseOk = !error;
    databaseError = error?.message;
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const status = databaseOk ? "ok" : "degraded";

  return NextResponse.json(
    {
      status,
      appUrl,
      webhookUrl: `${appUrl}/api/orders/from-call`,
      checks: {
        supabase: Boolean(supabase),
        database: databaseOk,
        twilio: twilioConfigured,
        webhookSecret: webhookSecretConfigured,
        elevenLabsAgentId: agentId,
      },
      databaseError,
      notes: [
        !twilioConfigured ? "Twilio non configure: SMS desactives." : null,
        !webhookSecretConfigured
          ? "ORDERS_WEBHOOK_SECRET absent: webhook ouvert (OK en dev, a securiser en prod)."
          : null,
      ].filter(Boolean),
    },
    { status: databaseOk ? 200 : 503 },
  );
}
