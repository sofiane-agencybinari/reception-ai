import type { ReactNode } from "react";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  glow?: "accent" | "warm" | "none";
  padding?: boolean;
};

export function GlowCard({
  children,
  className = "",
  innerClassName = "",
  glow = "accent",
  padding = true,
}: GlowCardProps) {
  const glowClass =
    glow === "accent"
      ? "before:from-astor-accent/40 before:via-teal-600/20"
      : glow === "warm"
        ? "before:from-astor-warm/40 before:via-amber-600/15"
        : "before:from-white/10 before:via-white/5";

  return (
    <div className={`gradient-border rounded-2xl ${className}`}>
      <div
        className={`relative rounded-[calc(1rem-1px)] bg-astor-surface-elevated/95 backdrop-blur-xl ${
          padding ? "p-6" : ""
        } ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
