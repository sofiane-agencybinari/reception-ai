import { getAppUrl } from "@/lib/app-url";
import { parseTwilioApiError } from "@/lib/twilio";

type SmsOrderItem = {
  name: string;
  quantity: number;
};

type SmsOrderSummaryInput = {
  orderId: string;
  customerPhone: string;
  customerName?: string | null;
  items: SmsOrderItem[];
  estimatedReadyAt: Date;
};

export type SmsSendResult = {
  attempted: boolean;
  sent: boolean;
  reason?: string;
  messageSid?: string;
  status?: string;
};

function toOrderNumber(orderId: string): string {
  return `SB-${orderId.slice(0, 8).toUpperCase()}`;
}

function formatEta(date: Date): string {
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildMessage(input: SmsOrderSummaryInput): string {
  const orderNumber = toOrderNumber(input.orderId);
  const customer = input.customerName?.trim() || "Client";
  const itemsLabel = input.items
    .map((item) => `${item.quantity}x ${item.name}`)
    .join(", ");

  const restaurantName = process.env.RESTAURANT_NAME ?? "votre restaurant";

  return `Bonjour ${customer}, votre commande ${orderNumber} est confirmee chez ${restaurantName}. Pret vers ${formatEta(input.estimatedReadyAt)}. Detail: ${itemsLabel}. Merci !`;
}

function canSendSms(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, "");
  if (cleaned.length < 6) return false;
  if (cleaned.includes("000000")) return false;
  return true;
}

export async function sendOrderSummarySms(
  input: SmsOrderSummaryInput,
): Promise<SmsSendResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!canSendSms(input.customerPhone)) {
    return { attempted: false, sent: false, reason: "invalid_customer_phone" };
  }

  if (!accountSid || !authToken || !fromNumber) {
    return { attempted: false, sent: false, reason: "missing_twilio_env" };
  }

  const body = buildMessage(input);
  const encodedAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const payload = new URLSearchParams({
    To: input.customerPhone,
    From: fromNumber,
    Body: body,
  });

  const statusCallbackUrl = new URL(
    "/api/webhooks/twilio/sms-status",
    getAppUrl(),
  );
  statusCallbackUrl.searchParams.set("orderId", input.orderId);
  payload.set("StatusCallback", statusCallbackUrl.toString());

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
    },
  );

  if (!res.ok) {
    const details = await res.text();
    return { attempted: true, sent: false, reason: parseTwilioApiError(details) };
  }

  const data = (await res.json()) as { sid?: string; status?: string };
  return {
    attempted: true,
    sent: true,
    messageSid: data.sid,
    status: data.status ?? "queued",
  };
}
