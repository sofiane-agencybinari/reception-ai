import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase";
import { webhookOrderSchema } from "@/lib/validators";

function pickFirstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

function safeObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parsePossiblyJsonObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value !== "string") return {};
  try {
    const parsed = JSON.parse(value);
    return safeObject(parsed);
  } catch {
    return {};
  }
}

async function parseRequestBody(request: Request): Promise<Record<string, unknown>> {
  // Read the raw body once to avoid "body stream already used" errors.
  const rawBody = await request.text();
  if (!rawBody || rawBody.trim().length === 0) return {};

  const asJson = parsePossiblyJsonObject(rawBody);
  if (Object.keys(asJson).length > 0) {
    return asJson;
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const formData = new URLSearchParams(rawBody);
    const entries = Object.fromEntries(formData.entries());
    return safeObject(entries);
  }

  return {};
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase non configure. Verifiez vos variables d'environnement." },
      { status: 500 },
    );
  }

  const body = await parseRequestBody(request);
  const nestedData = safeObject(body.data);
  const nestedPayload = safeObject(body.payload);
  const nestedOrder = safeObject(body.order);
  const toolArguments = parsePossiblyJsonObject(body.arguments);

  const mergedBody: Record<string, unknown> = {
    ...nestedPayload,
    ...nestedData,
    ...nestedOrder,
    ...toolArguments,
    ...body,
  };

  const normalizedItemsInput = Array.isArray(mergedBody.items)
    ? mergedBody.items
    : Array.isArray(mergedBody.orderItems)
      ? mergedBody.orderItems
      : Array.isArray(mergedBody.order_items)
        ? mergedBody.order_items
        : mergedBody.item
          ? [mergedBody.item]
          : [];

  const normalizedBody = {
    ...mergedBody,
    callId: pickFirstString(mergedBody.callId, mergedBody.call_id, mergedBody.id),
    transcript: pickFirstString(mergedBody.transcript, mergedBody.call_transcript),
    restaurantId:
      pickFirstString(mergedBody.restaurantId, mergedBody.restaurant_id) ??
      "11111111-1111-1111-1111-111111111111",
    customerPhone:
      pickFirstString(
        mergedBody.customerPhone,
        mergedBody.customer_phone,
        mergedBody.phone,
      ) ?? "+33000000000",
    customerName: pickFirstString(mergedBody.customerName, mergedBody.customer_name),
    pickupTime: pickFirstString(mergedBody.pickupTime, mergedBody.pickup_time),
    notes: pickFirstString(mergedBody.notes, mergedBody.comment),
    items: normalizedItemsInput.map((item) => {
      const normalizedItem = safeObject(item);
      return {
        name: normalizedItem.name ?? normalizedItem.item_name ?? normalizedItem.product ?? "",
        quantity: normalizedItem.quantity ?? normalizedItem.qty ?? 1,
        unitPrice: normalizedItem.unitPrice ?? normalizedItem.unit_price ?? normalizedItem.price ?? 0,
      };
    }),
  };

  // If no items are extracted by the agent tool, create a safe fallback line.
  if (!Array.isArray(normalizedBody.items) || normalizedBody.items.length === 0) {
    normalizedBody.items = [
      {
        name: "Commande vocale",
        quantity: 1,
        unitPrice: 0,
      },
    ];
  }

  const parsed = webhookOrderSchema.safeParse(normalizedBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload invalide", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const totalAmount = payload.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      restaurant_id: payload.restaurantId,
      customer_phone: payload.customerPhone,
      customer_name: payload.customerName ?? null,
      pickup_time: payload.pickupTime ?? null,
      notes: payload.notes ?? null,
      source: "phone",
      status: "new",
      total_amount: totalAmount,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: "Impossible de creer la commande", details: orderError?.message },
      { status: 500 },
    );
  }

  const orderItems = payload.items.map((item) => ({
    order_id: order.id,
    item_name: item.name,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    line_total: item.quantity * item.unitPrice,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) {
    return NextResponse.json(
      { error: "Commande creee mais items invalides", details: itemsError.message },
      { status: 500 },
    );
  }

  await supabase.from("call_logs").insert({
    order_id: order.id,
    call_id: payload.callId ?? null,
    transcript: payload.transcript ?? null,
    success: true,
  });

  return NextResponse.json({ ok: true, orderId: order.id }, { status: 201 });
}
