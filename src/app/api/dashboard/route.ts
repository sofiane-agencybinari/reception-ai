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
  if (!restaurantId) {
    return NextResponse.json(
      { error: "restaurantId est obligatoire" },
      { status: 400 },
    );
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, status, total_amount")
    .eq("restaurant_id", restaurantId);

  if (error) {
    return NextResponse.json(
      { error: "Impossible de calculer les indicateurs", details: error.message },
      { status: 500 },
    );
  }

  const totalOrders = orders?.length ?? 0;
  const activeOrders =
    orders?.filter((o) => ["new", "accepted", "preparing", "ready"].includes(o.status))
      .length ?? 0;
  const completedOrders =
    orders?.filter((o) => o.status === "picked_up").length ?? 0;
  const cancelledOrders =
    orders?.filter((o) => o.status === "cancelled").length ?? 0;
  const revenue = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0;
  const avgTicket = totalOrders > 0 ? revenue / totalOrders : 0;

  return NextResponse.json({
    metrics: {
      totalOrders,
      activeOrders,
      completedOrders,
      cancelledOrders,
      avgTicket,
    },
  });
}
