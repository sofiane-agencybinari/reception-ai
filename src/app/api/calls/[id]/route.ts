import { NextResponse } from "next/server";

import { elevenLabsFetch, sessionAgentId } from "@/lib/elevenlabs-calls";

type Detail = {
  agent_id: string;
  transcript?: { role: string; message: string | null; time_in_call_secs?: number }[];
  analysis?: { transcript_summary?: string | null };
  metadata?: { phone_call?: { external_number?: string } | null };
};

/** Détail d'un appel : uniquement s'il appartient à l'agent du restaurant connecté. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const agentId = await sessionAgentId();
  if (!agentId) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { id } = await params;
  const res = await elevenLabsFetch(`/conversations/${encodeURIComponent(id)}`);
  if (!res) return NextResponse.json({ error: "ElevenLabs non configuré" }, { status: 500 });
  if (!res.ok) return NextResponse.json({ error: "Appel introuvable" }, { status: 404 });

  const data = (await res.json()) as Detail;
  if (data.agent_id !== agentId) return NextResponse.json({ error: "Appel introuvable" }, { status: 404 });

  return NextResponse.json({
    summary: data.analysis?.transcript_summary ?? null,
    caller: data.metadata?.phone_call?.external_number ?? null,
    transcript: (data.transcript ?? [])
      .filter((t) => t.message)
      .map((t) => ({ role: t.role === "agent" ? "agent" : "client", text: t.message, at: t.time_in_call_secs ?? null })),
  });
}
