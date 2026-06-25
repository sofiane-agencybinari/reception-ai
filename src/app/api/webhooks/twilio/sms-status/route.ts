import { NextResponse } from "next/server";

import { validateTwilioWebhook } from "@/lib/twilio";
import { getSupabaseAdminClient } from "@/lib/supabase";

const FAILURE_STATUSES = new Set(["failed", "undelivered"]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = String(value);
  });

  if (!validateTwilioWebhook(request, params)) {
    return NextResponse.json({ error: "Invalid Twilio signature" }, { status: 403 });
  }

  const messageSid = params.MessageSid ?? "";
  const messageStatus = params.MessageStatus ?? "";
  const errorCode = params.ErrorCode;
  const errorMessage = params.ErrorMessage;
  const orderId = new URL(request.url).searchParams.get("orderId");

  if (FAILURE_STATUSES.has(messageStatus) && orderId) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const detail = errorCode
        ? `SMS ${messageStatus} (${errorCode}: ${errorMessage ?? "erreur inconnue"})`
        : `SMS ${messageStatus}`;

      await supabase.from("call_logs").insert({
        order_id: orderId,
        call_id: messageSid || null,
        transcript: detail,
        success: false,
      });
    }
  }

  return new NextResponse(null, { status: 204 });
}
