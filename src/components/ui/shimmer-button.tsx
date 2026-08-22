import Link from "next/link";
import type { ReactNode } from "react";

type ShimmerButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function ShimmerButton({
  href,
  children,
  variant = "primary",
  className = "",
}: ShimmerButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold transition ${
        isPrimary
          ? "bg-astor-accent text-white shadow-lg shadow-astor-accent/20 hover:bg-astor-accent-soft"
          : "border border-white/12 bg-white/[0.03] text-zinc-200 hover:border-astor-accent/30 hover:text-white"
      } ${className}`}
    >
      {isPrimary ? (
        <span className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      ) : null}
      <span className="relative">{children}</span>
    </Link>
  );
}
