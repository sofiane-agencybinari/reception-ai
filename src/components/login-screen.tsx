"use client";

import { FormEvent, useState } from "react";
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
    <main className="flex min-h-screen flex-1 items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <section className="w-full max-w-md">
        <p className="text-center text-xs uppercase tracking-[0.28em] text-slate-500">
          Dashboard - Receptionniste - Telephone
        </p>
        <h1 className="mt-4 text-center text-3xl font-semibold">Logiciel de gestion</h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Connectez-vous pour acceder au tableau de bord.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/85 p-6 shadow-2xl">
          <form className="space-y-3" onSubmit={onSubmit}>
            <label className="block text-xs font-medium uppercase tracking-widest text-slate-400">
              Identifiant
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="manager"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-500"
            />
            <label className="mt-4 block text-xs font-medium uppercase tracking-widest text-slate-400">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="1234"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
            >
              Connexion
            </button>
          </form>
          {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          Acces reserve au personnel autorise.
        </p>
      </section>
    </main>
  );
}
