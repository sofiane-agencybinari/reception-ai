import { NextResponse } from "next/server";

import { elevenLabsFetch, sessionAgentId } from "@/lib/elevenlabs-calls";

type Conversation = {
  conversation_id: string;
  start_time_unix_secs: number;
  call_duration_secs: number;
  call_successful?: string;
  call_summary_title?: string | null;
  transcript_summary?: string | null;
  status?: string;
};

export async function GET(request: Request) {
  const agentId = await sessionAgentId();
  if (!agentId) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const cursor = new URL(request.url).searchParams.get("cursor");
  const query = new URLSearchParams({ agent_id: agentId, page_size: "30" });
  if (cursor) query.set("cursor", cursor);

  const res = await elevenLabsFetch(`/conversations?${query}`);
  if (!res) return NextResponse.json({ error: "ElevenLabs non configuré" }, { status: 500 });
  if (!res.ok) return NextResponse.json({ error: "Impossible de récupérer les appels" }, { status: 502 });

  const data = (await res.json()) as { conversations?: Conversation[]; has_more?: boolean; next_cursor?: string | null };
  return NextResponse.json({
    calls: (data.conversations ?? []).map((c) => ({
      id: c.conversation_id,
      startedAt: new Date(c.start_time_unix_secs * 1000).toISOString(),
      durationSecs: c.call_duration_secs,
      successful: c.call_successful ?? null,
      title: c.call_summary_title ?? null,
      summary: c.transcript_summary ?? null,
    })),
    nextCursor: data.has_more ? (data.next_cursor ?? null) : null,
  });
}
