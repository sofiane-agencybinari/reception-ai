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
      className={`marketing-btn marketing-btn-lift group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold ${
        isPrimary
          ? "bg-astor-accent text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_12px_36px_-10px_rgba(22,22,21,0.2)] hover:bg-astor-accent-soft"
          : "border border-white/12 bg-white/[0.03] text-zinc-200 hover:border-astor-accent/30 hover:bg-white/[0.05] hover:text-white"
      } ${className}`}
    >
      {isPrimary ? (
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/18 to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-full"
          aria-hidden
        />
      ) : null}
      <span className="relative">{children}</span>
    </Link>
  );
}
