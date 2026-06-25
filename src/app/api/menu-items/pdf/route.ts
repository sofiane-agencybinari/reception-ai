import { NextResponse } from "next/server";

import { buildMenuPdfBuffer, buildMenuPdfFilename } from "@/lib/menu-pdf";
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
    return NextResponse.json({ error: "restaurantId est obligatoire" }, { status: 400 });
  }

  const [{ data: restaurant, error: restaurantError }, { data: items, error: itemsError }] =
    await Promise.all([
      supabase
        .from("restaurants")
        .select("name, phone, address")
        .eq("id", restaurantId)
        .maybeSingle(),
      supabase
        .from("menu_items")
        .select("id, name, price, is_available")
        .eq("restaurant_id", restaurantId)
        .order("name", { ascending: true }),
    ]);

  if (restaurantError || itemsError) {
    return NextResponse.json(
      {
        error: "Impossible de generer le menu PDF",
        details: restaurantError?.message ?? itemsError?.message,
      },
      { status: 500 },
    );
  }

  const restaurantName =
    restaurant?.name?.trim() || process.env.RESTAURANT_NAME?.trim() || "Restaurant";

  const pdf = await buildMenuPdfBuffer({
    restaurantName,
    restaurantPhone: restaurant?.phone ?? null,
    restaurantAddress: restaurant?.address ?? null,
    items: items ?? [],
  });

  const filename = buildMenuPdfFilename(restaurantName);

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
