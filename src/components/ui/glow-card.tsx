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
  const tone =
    glow === "warm"
      ? "shadow-[0_0_40px_-18px_rgba(212,184,150,0.35)]"
      : glow === "accent"
        ? "shadow-[0_0_40px_-18px_rgba(61,155,143,0.4)]"
        : "";

  return (
    <div className={`gradient-border rounded-2xl ${tone} ${className}`}>
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
