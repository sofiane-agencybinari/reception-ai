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
  const limit = Math.min(Number(searchParams.get("limit") ?? "10"), 50);

  if (!restaurantId) {
    return NextResponse.json({ error: "restaurantId est obligatoire" }, { status: 400 });
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id")
    .eq("restaurant_id", restaurantId);

  if (ordersError) {
    return NextResponse.json(
      { error: "Impossible de recuperer les commandes", details: ordersError.message },
      { status: 500 },
    );
  }

  const orderIds = (orders ?? []).map((o) => o.id);
  if (orderIds.length === 0) {
    return NextResponse.json({ callLogs: [] });
  }

  const { data, error } = await supabase
    .from("call_logs")
    .select("id, call_id, transcript, success, created_at, order_id")
    .in("order_id", orderIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json(
      { error: "Impossible de recuperer les appels", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ callLogs: data ?? [] });
}
