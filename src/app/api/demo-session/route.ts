import { NextRequest, NextResponse } from "next/server";

import { DEMO_DAILY_MAX, DEMO_PER_IP, getDemoUsage, hashIp, recordDemoSession, type DemoMode } from "@/lib/demo-limits";

export const runtime = "nodejs";

const AGENT_ID = process.env.NEXT_PUBLIC_ASTOR_DEMO_AGENT_ID?.trim() || "agent_3201m4b6a39afkqvaxh5s904q5h5";

function clientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Autorise une session de démo : vérifie les limites (par IP et globale),
 * puis demande à ElevenLabs un jeton WebRTC (voix) ou une URL signée (texte).
 * La clé API ne quitte jamais le serveur ; l'agent est privé.
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "Démo indisponible pour le moment." }, { status: 503 });
  }

  const body = (await req.json().catch(() => ({}))) as { mode?: string };
  const mode: DemoMode = body.mode === "text" ? "text" : "voice";

  const ipHash = hashIp(clientIp(req));
  const usage = await getDemoUsage(ipHash);

  if (usage.perIp >= DEMO_PER_IP) {
    return NextResponse.json(
      {
        ok: false,
        reason: "per_ip",
        error: `Vous avez déjà utilisé vos ${DEMO_PER_IP} essais. Laissez vos coordonnées : on vous fait une démo sur votre propre carte.`,
      },
      { status: 429 },
    );
  }
  if (usage.total >= DEMO_DAILY_MAX) {
    return NextResponse.json(
      {
        ok: false,
        reason: "daily",
        error: "La démo est très demandée aujourd’hui. Laissez vos coordonnées, on vous rappelle pour vous la faire en direct.",
      },
      { status: 429 },
    );
  }

  const endpoint =
    mode === "voice"
      ? `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${AGENT_ID}`
      : `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`;
  const res = await fetch(endpoint, { headers: { "xi-api-key": apiKey }, cache: "no-store" });
  if (!res.ok) {
    console.error("[demo-session] ElevenLabs", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ ok: false, error: "La démo ne répond pas. Réessayez dans un instant." }, { status: 502 });
  }
  const data = (await res.json()) as { token?: string; signed_url?: string };

  await recordDemoSession(ipHash, mode);

  return NextResponse.json({
    ok: true,
    remaining: Math.max(0, DEMO_PER_IP - usage.perIp - 1),
    ...(mode === "voice" ? { conversationToken: data.token } : { signedUrl: data.signed_url }),
  });
}
