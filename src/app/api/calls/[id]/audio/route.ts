import { NextResponse } from "next/server";

import { elevenLabsFetch, sessionAgentId } from "@/lib/elevenlabs-calls";

/** Enregistrement audio d'un appel, après vérification qu'il appartient à l'agent du restaurant connecté. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const agentId = await sessionAgentId();
  if (!agentId) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { id } = await params;
  const detail = await elevenLabsFetch(`/conversations/${encodeURIComponent(id)}`);
  if (!detail?.ok) return NextResponse.json({ error: "Appel introuvable" }, { status: 404 });
  const { agent_id } = (await detail.json()) as { agent_id: string };
  if (agent_id !== agentId) return NextResponse.json({ error: "Appel introuvable" }, { status: 404 });

  const audio = await elevenLabsFetch(`/conversations/${encodeURIComponent(id)}/audio`);
  if (!audio?.ok || !audio.body) return NextResponse.json({ error: "Audio indisponible" }, { status: 404 });

  return new Response(audio.body, {
    headers: { "Content-Type": audio.headers.get("content-type") ?? "audio/mpeg", "Cache-Control": "private, max-age=3600" },
  });
}
