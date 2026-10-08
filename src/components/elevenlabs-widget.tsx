"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, Mic } from "lucide-react";

import { useRestaurantOptional } from "@/lib/restaurant-context";

type Status = "loading" | "ready" | "error";

type Props = {
  agentId?: string;
  /** Show loading / error chrome around the widget (demo, marketing). */
  showStatus?: boolean;
};

export function ElevenLabsWidget({ agentId, showStatus = false }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const restaurant = useRestaurantOptional();
  const resolvedAgentId =
    agentId ??
    restaurant?.agentId ??
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ??
    "agent_1301khmc2x71e30anhrycs0cqhky";

  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    const host = containerRef.current;

    async function mount() {
      if (!resolvedAgentId) {
        if (!cancelled) setStatus("error");
        return;
      }

      try {
        if (!customElements.get("elevenlabs-convai")) {
          await Promise.race([
            customElements.whenDefined("elevenlabs-convai"),
            new Promise<never>((_, reject) => {
              window.setTimeout(() => reject(new Error("timeout")), 12_000);
            }),
          ]);
        }

        if (cancelled || !host) return;

        const element = document.createElement("elevenlabs-convai");
        element.setAttribute("agent-id", resolvedAgentId);
        element.setAttribute("language", "fr");
        host.innerHTML = "";
        host.appendChild(element);
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void mount();

    return () => {
      cancelled = true;
      host.innerHTML = "";
    };
  }, [resolvedAgentId]);

  if (!showStatus) {
    return <div ref={containerRef} />;
  }

  return (
    <div className="relative min-h-[140px]">
      {status === "loading" && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/40 px-6 text-center backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-6 w-6 animate-spin text-astor-accent-soft" />
          <p className="text-sm font-medium text-zinc-200">Préparation de l&apos;agent vocal…</p>
          <p className="text-xs text-zinc-500">Autorisez le micro quand le navigateur le demande.</p>
        </div>
      )}

      {status === "error" && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl border border-red-500/20 bg-red-950/40 px-6 text-center backdrop-blur-sm"
          role="alert"
        >
          <AlertCircle className="h-6 w-6 text-red-300" />
          <p className="text-sm font-medium text-zinc-100">Impossible de charger l&apos;agent</p>
          <p className="max-w-xs text-xs text-zinc-400">
            Vérifiez votre connexion, autorisez le micro, puis rechargez la page.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-1 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]"
          >
            Recharger
          </button>
        </div>
      )}

      {status === "ready" && (
        <p className="mb-4 flex items-center justify-center gap-2 text-xs font-medium text-astor-accent-bright">
          <Mic className="h-3.5 w-3.5" />
          Agent prêt — appuyez pour parler
        </p>
      )}

      <div
        ref={containerRef}
        className={status === "ready" ? "flex justify-center" : "pointer-events-none opacity-0"}
        aria-hidden={status !== "ready"}
      />
    </div>
  );
}
