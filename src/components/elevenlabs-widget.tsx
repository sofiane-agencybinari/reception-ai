"use client";

import { useEffect, useRef } from "react";

import { useRestaurantOptional } from "@/lib/restaurant-context";

export function ElevenLabsWidget({ agentId }: { agentId?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const restaurant = useRestaurantOptional();
  const resolvedAgentId =
    agentId ??
    restaurant?.agentId ??
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ??
    "agent_1301khmc2x71e30anhrycs0cqhky";

  useEffect(() => {
    if (!containerRef.current) return;

    const element = document.createElement("elevenlabs-convai");
    element.setAttribute("agent-id", resolvedAgentId);
    element.setAttribute("language", "fr");
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(element);
  }, [resolvedAgentId]);

  return <div ref={containerRef} />;
}
