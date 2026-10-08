import { createHash } from "node:crypto";

import { getSupabaseAdminClient } from "@/lib/supabase";

/** Tests de démo autorisés par adresse IP sur une fenêtre glissante. */
export const DEMO_PER_IP = 2;
/** Plafond global de sessions de démo sur la même fenêtre (≈ 100 min à 3 min par appel). */
export const DEMO_DAILY_MAX = 35;
const WINDOW_MS = 24 * 60 * 60 * 1000;

export type DemoMode = "voice" | "text";

/** L'IP n'est jamais stockée en clair : seulement une empreinte salée. */
export function hashIp(ip: string) {
  const salt = process.env.DEMO_IP_SALT?.trim() || "ligne-demo";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/* ─── Stockage ───
 * Supabase (table demo_sessions, voir supabase/demo-sessions.sql) si elle existe :
 * indispensable en production, où plusieurs instances serverless coexistent.
 * Sinon repli en mémoire (suffisant en local, remis à zéro au redémarrage). */

const memory: { ipHash: string; at: number }[] = [];

/** Après un échec Supabase (table absente, réseau, projet en pause), on l'ignore 5 min. */
let supabaseDownUntil = 0;
const SUPABASE_TIMEOUT_MS = 1500;

function withTimeout<T>(promise: PromiseLike<T>): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), SUPABASE_TIMEOUT_MS)),
  ]);
}

function markSupabaseDown() {
  supabaseDownUntil = Date.now() + 5 * 60 * 1000;
}

function memoryCounts(ipHash: string) {
  const since = Date.now() - WINDOW_MS;
  while (memory.length && memory[0].at < since) memory.shift();
  return { perIp: memory.filter((s) => s.ipHash === ipHash).length, total: memory.length };
}

async function supabaseCounts(ipHash: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase || Date.now() < supabaseDownUntil) return null;
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  try {
    const [perIp, total] = await withTimeout(
      Promise.all([
        supabase.from("demo_sessions").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since),
        supabase.from("demo_sessions").select("id", { count: "exact", head: true }).gte("created_at", since),
      ]),
    );
    // Table absente (pas encore créée) → repli mémoire.
    if (perIp.error || total.error) {
      markSupabaseDown();
      return null;
    }
    return { perIp: perIp.count ?? 0, total: total.count ?? 0 };
  } catch {
    markSupabaseDown();
    return null;
  }
}

export async function getDemoUsage(ipHash: string) {
  return (await supabaseCounts(ipHash)) ?? memoryCounts(ipHash);
}

export async function recordDemoSession(ipHash: string, mode: DemoMode) {
  const supabase = getSupabaseAdminClient();
  if (supabase && Date.now() >= supabaseDownUntil) {
    try {
      const { error } = await withTimeout(supabase.from("demo_sessions").insert({ ip_hash: ipHash, mode }));
      if (!error) return;
    } catch {
      /* repli mémoire ci-dessous */
    }
    markSupabaseDown();
  }
  memory.push({ ipHash, at: Date.now() });
}
