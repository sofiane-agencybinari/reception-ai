import { getSession } from "@/lib/server-auth";

/** Appels de l'agent du restaurant connecté, lus directement chez ElevenLabs (durée, résumé, transcription, audio). */
const API = "https://api.elevenlabs.io/v1/convai";

export function elevenLabsKey() {
  return process.env.ELEVENLABS_API_KEY?.trim() || null;
}

export async function elevenLabsFetch(path: string) {
  const key = elevenLabsKey();
  if (!key) return null;
  return fetch(`${API}${path}`, { headers: { "xi-api-key": key }, cache: "no-store" });
}

/** Agent du restaurant connecté, ou null si non connecté. */
export async function sessionAgentId() {
  const session = await getSession();
  return session?.agentId ?? null;
}
