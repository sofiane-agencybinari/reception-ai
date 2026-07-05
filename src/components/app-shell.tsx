"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";

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

const AUTH_STORAGE_KEY = "reception_ai_authenticated";

export function AppShell({ title, subtitle, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/portal" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-astor-accent-soft to-teal-800 text-xs font-bold text-white">
              A
            </div>
            <div>
              <span className="font-bold tracking-tight">ASTOR</span>
              <span className="ml-2 hidden items-center gap-1.5 text-[10px] text-zinc-500 sm:inline-flex">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-live-dot" />
                En ligne
              </span>
            </div>
          </Link>
          <nav className="hidden flex-wrap justify-end gap-1 sm:flex">
            {NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/portal" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-astor-accent/15 text-astor-accent-bright"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={logout}
            className="cockpit-btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Deconnexion</span>
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-white/5 px-6 py-2 sm:hidden">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
                  active ? "bg-astor-accent/15 text-astor-accent-bright" : "text-zinc-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
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
