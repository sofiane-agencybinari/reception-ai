"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LOGIN_ID = process.env.NEXT_PUBLIC_APP_LOGIN_ID ?? "manager";
const LOGIN_PASSWORD = process.env.NEXT_PUBLIC_APP_LOGIN_PASSWORD ?? "1234";
const AUTH_STORAGE_KEY = "reception_ai_authenticated";

export function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (identifier === LOGIN_ID && password === LOGIN_PASSWORD) {
      window.sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      router.push("/portal");
      return;
    }

    setError("Identifiant ou mot de passe incorrect.");
  }

  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#07080c] px-6 py-12 text-zinc-100">
      <div className="marketing-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[100px]" />

      <section className="animate-fade-up relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-sm font-bold text-black">
              A
            </div>
            <span className="text-xl font-bold tracking-tight">ASTOR</span>
          </Link>
          <p className="mt-4 text-sm text-zinc-500">Cockpit restaurant — acces personnel</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h1 className="text-lg font-semibold text-white">Connexion</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Cuisine, analytics et gestion des commandes telephoniques.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Identifiant
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="manager"
                className="cockpit-input mt-1 w-full px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="cockpit-input mt-1 w-full px-3 py-2.5 text-sm"
              />
            </div>
            <button type="submit" className="cockpit-btn-primary w-full px-4 py-2.5 text-sm">
              Acceder au cockpit
            </button>
          </form>
          {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Acces reserve au personnel autorise.
        </p>
      </section>
    </main>
  );
}
