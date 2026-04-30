import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase";
import { menuItemSchema } from "@/lib/validators";

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

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Impossible de recuperer le menu", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ menuItems: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase non configure. Verifiez vos variables d'environnement." },
      { status: 500 },
    );
  }

  const body = await request.json();
  const parsed = menuItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload invalide", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const { data, error } = await supabase
    .from("menu_items")
    .insert({
      restaurant_id: payload.restaurantId,
      name: payload.name,
      price: payload.price,
      is_available: payload.isAvailable,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Impossible d'ajouter le produit", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ menuItem: data }, { status: 201 });
}
