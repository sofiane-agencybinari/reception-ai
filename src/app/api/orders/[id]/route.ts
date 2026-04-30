import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase";
import { updateOrderStatusSchema } from "@/lib/validators";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase non configure. Verifiez vos variables d'environnement." },
      { status: 500 },
    );
  }

  const body = await request.json();
  const parsed = updateOrderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload invalide", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const routeParams = await params;
  const { error } = await supabase
    .from("orders")
    .update({ status: parsed.data.status })
    .eq("id", routeParams.id);

  if (error) {
    return NextResponse.json(
      { error: "Impossible de mettre a jour le statut", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
