import { NextResponse } from "next/server";

import { findAccount, startSession } from "@/lib/server-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { loginId?: string; password?: string };
  const session = findAccount(body.loginId ?? "", body.password ?? "");
  if (!session) {
    // Petit délai pour freiner les essais de mots de passe à répétition.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, error: "Identifiant ou mot de passe incorrect." }, { status: 401 });
  }
  await startSession(session);
  return NextResponse.json({ ok: true, session });
}
