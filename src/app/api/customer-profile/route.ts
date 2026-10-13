import { NextResponse } from "next/server";
import { z } from "zod";

import { isValidCustomerLink } from "@/lib/customer-link";
import { getSupabaseAdminClient } from "@/lib/supabase";

const schema = z.object({
  orderId: z.string().uuid(),
  s: z.string().min(10),
  firstName: z.string().trim().max(60).optional(),
  lastName: z.string().trim().max(60).optional(),
  email: z.union([z.literal(""), z.string().trim().email().max(120)]).optional(),
  birthday: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).optional(),
  marketingConsent: z.boolean().optional(),
});

/** Enregistre la fiche complétée par un client final depuis le lien de son SMS de confirmation. */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Informations invalides." }, { status: 400 });
  const input = parsed.data;
  if (!isValidCustomerLink(input.orderId, input.s)) return NextResponse.json({ ok: false }, { status: 403 });

  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });

  const { data: order } = await supabase
    .from("orders")
    .select("restaurant_id, customer_phone")
    .eq("id", input.orderId)
    .maybeSingle();
  if (!order) return NextResponse.json({ ok: false }, { status: 404 });

  const now = new Date().toISOString();
  const { error } = await supabase.from("customer_profiles").upsert(
    {
      restaurant_id: order.restaurant_id,
      phone: order.customer_phone,
      first_name: input.firstName || null,
      last_name: input.lastName || null,
      email: input.email || null,
      birthday: input.birthday || null,
      marketing_consent: Boolean(input.marketingConsent),
      consent_at: input.marketingConsent ? now : null,
      source_order_id: input.orderId,
      updated_at: now,
    },
    { onConflict: "restaurant_id,phone" },
  );
  if (error) {
    console.error("[customer-profile]", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
