import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase";

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
  const view = searchParams.get("view");

  if (!restaurantId) {
    return NextResponse.json(
      { error: "restaurantId est obligatoire" },
      { status: 400 },
    );
  }

  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (view === "active") {
    query = query.in("status", ["new", "accepted", "preparing", "ready"]);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "Impossible de recuperer les commandes", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ orders: data ?? [] });
}
