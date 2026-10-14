import { NextResponse } from "next/server";

import { requireRestaurant } from "@/lib/server-auth";
import { getSupabaseAdminClient } from "@/lib/supabase";

/** Rupture / remise en vente d'un produit : { isAvailable: boolean }. Limité au restaurant connecté. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRestaurant();
  if ("error" in auth) return auth.error;

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase non configure." }, { status: 500 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { isAvailable?: unknown } | null;
  if (typeof body?.isAvailable !== "boolean") {
    return NextResponse.json({ error: "isAvailable (booléen) est obligatoire" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("menu_items")
    .update({ is_available: body.isAvailable })
    .eq("id", id)
    .eq("restaurant_id", auth.restaurantId)
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Impossible de modifier le produit", details: error.message }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });

  return NextResponse.json({ menuItem: data });
}
