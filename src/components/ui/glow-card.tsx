"use client";

import type { ReactNode } from "react";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  glow?: "accent" | "warm" | "none";
  padding?: boolean;
  interactive?: boolean;
};

export function GlowCard({
  children,
  className = "",
  innerClassName = "",
  glow = "accent",
  padding = true,
  interactive = true,
}: GlowCardProps) {
  const tone =
    glow === "warm"
      ? "shadow-[0_12px_40px_-20px_rgba(166,124,82,0.25)]"
      : glow === "accent"
        ? "shadow-[0_12px_40px_-20px_rgba(47,127,118,0.28)]"
        : "shadow-[0_8px_28px_-18px_rgba(26,29,33,0.15)]";

  return (
    <div
      className={`rounded-2xl border border-zinc-200/90 bg-white ${tone} ${
        interactive ? "glow-card-shell" : ""
      } ${className}`}
    >
      <div className={`relative overflow-hidden rounded-2xl ${padding ? "p-6" : ""} ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}
