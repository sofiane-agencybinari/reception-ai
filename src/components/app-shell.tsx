import Link from "next/link";
import type { ReactNode } from "react";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const NAV = [
  { href: "/portal", label: "Hub" },
  { href: "/kitchen", label: "Cuisine" },
  { href: "/dashboard", label: "Analytics" },
  { href: "/clients", label: "Clients" },
  { href: "/settings/menu", label: "Menu" },
] as const;

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100">
      <header className="border-b border-white/5 bg-[#07080c]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/portal" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 text-xs font-bold text-black">
              A
            </div>
            <span className="font-bold tracking-tight">ASTOR</span>
          </Link>
          <nav className="hidden flex-wrap justify-end gap-1 sm:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <div className="mb-8 animate-fade-up">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-zinc-500">{subtitle}</p> : null}
        </div>
        {children}
      </main>
    </div>
  );
}
