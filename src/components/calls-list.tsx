"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Phone } from "lucide-react";

type Call = {
  id: string;
  startedAt: string;
  durationSecs: number;
  successful: string | null;
  title: string | null;
  summary: string | null;
};

type Detail = {
  summary: string | null;
  caller: string | null;
  transcript: { role: "agent" | "client"; text: string; at: number | null }[];
};

const RESULT: Record<string, { label: string; className: string }> = {
  success: { label: "Réussi", className: "bg-emerald-500/15 text-emerald-300" },
  failure: { label: "Échec", className: "bg-rose-500/15 text-rose-300" },
  unknown: { label: "À vérifier", className: "bg-white/10 text-zinc-300" },
};

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  return m > 0 ? `${m} min ${String(secs % 60).padStart(2, "0")}` : `${secs} s`;
}

export function CallsList() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, Detail | "loading" | "error">>({});

  const load = useCallback(async (from: string | null) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/calls${from ? `?cursor=${encodeURIComponent(from)}` : ""}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setCalls((prev) => (from ? [...prev, ...data.calls] : data.calls));
      setCursor(data.nextCursor);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(() => void load(null), 0);
    return () => clearTimeout(first);
  }, [load]);

  async function toggle(id: string) {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    if (details[id] && details[id] !== "error") return;
    setDetails((d) => ({ ...d, [id]: "loading" }));
    const res = await fetch(`/api/calls/${id}`).catch(() => null);
    const data = res?.ok ? ((await res.json()) as Detail) : null;
    setDetails((d) => ({ ...d, [id]: data ?? "error" }));
  }

  if (error) {
    return <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>;
  }

  if (!loading && calls.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center">
        <Phone className="mx-auto h-10 w-10 text-zinc-600" />
        <p className="mt-4 text-lg font-medium text-white">Aucun appel pour le moment</p>
        <p className="mt-1 text-sm text-zinc-500">Les appels décrochés par Ligne apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {calls.map((call) => {
        const result = RESULT[call.successful ?? "unknown"] ?? RESULT.unknown;
        const detail = details[call.id];
        const open = openId === call.id;
        return (
          <article key={call.id} className="glass-card rounded-xl">
            <button type="button" onClick={() => void toggle(call.id)} className="flex w-full items-start gap-3 p-4 text-left">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-astor-accent-soft" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{call.title ?? "Appel"}</p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {new Date(call.startedAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })} ·{" "}
                  {formatDuration(call.durationSecs)}
                </p>
                {call.summary && !open ? <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{call.summary}</p> : null}
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${result.className}`}>{result.label}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-500 transition ${open ? "rotate-180" : ""}`} />
            </button>

            {open ? (
              <div className="space-y-4 border-t border-white/5 p-4">
                {detail === "loading" || !detail ? (
                  <p className="text-sm text-zinc-500">Chargement…</p>
                ) : detail === "error" ? (
                  <p className="text-sm text-rose-300">Impossible de charger cet appel.</p>
                ) : (
                  <>
                    {detail.caller ? <p className="text-sm text-zinc-400">Appelant : {detail.caller}</p> : null}
                    {detail.summary ? <p className="text-sm text-zinc-200">{detail.summary}</p> : null}
                    <audio controls preload="none" src={`/api/calls/${call.id}/audio`} className="w-full" />
                    <div className="max-h-96 space-y-2 overflow-y-auto rounded-lg bg-black/30 p-3">
                      {detail.transcript.map((line, index) => (
                        <p key={index} className="text-sm">
                          <span className={line.role === "agent" ? "font-medium text-astor-accent-soft" : "font-medium text-zinc-300"}>
                            {line.role === "agent" ? "Ligne" : "Client"} :
                          </span>{" "}
                          <span className="text-zinc-300">{line.text}</span>
                        </p>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </article>
        );
      })}

      {loading ? <p className="text-sm text-zinc-500">Chargement des appels…</p> : null}
      {cursor && !loading ? (
        <button type="button" onClick={() => void load(cursor)} className="cockpit-btn-ghost px-4 py-2 text-xs">
          Voir plus d&apos;appels
        </button>
      ) : null}
    </div>
  );
}
