import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase";
import { webhookOrderSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase non configure. Verifiez vos variables d'environnement." },
      { status: 500 },
    );
  }

  const body = await request.json();
  const parsed = webhookOrderSchema.safeParse(body);
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
