import { NextResponse } from "next/server";

import { buildCustomerProfiles } from "@/lib/customers";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { Order } from "@/lib/types";

export async function GET(request: Request) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase non configure. Verifiez vos variables d'environnement." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurantId");

  if (!restaurantId) {
    return NextResponse.json({ error: "restaurantId est obligatoire" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Impossible de recuperer les clients", details: error.message },
      { status: 500 },
    );
  }

  const orders = (data ?? []) as Order[];
  const customers = buildCustomerProfiles(orders);

  return NextResponse.json({ customers });
}
