"use client";

import { useEffect, useRef } from "react";

const AGENT_ID =
  process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? "agent_1301khmc2x71e30anhrycs0cqhky";

export function ElevenLabsWidget() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const element = document.createElement("elevenlabs-convai");
    element.setAttribute("agent-id", AGENT_ID);
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(element);
  }, []);

  return <div ref={containerRef} />;
}
