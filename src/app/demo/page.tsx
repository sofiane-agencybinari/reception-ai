import Link from "next/link";

import { ElevenLabsWidget } from "@/components/elevenlabs-widget";

export default function DemoPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-12 text-slate-100">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="relative mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-slate-400 transition hover:text-white">
          ← Retour au site
        </Link>
        <h1 className="mt-6 text-3xl font-bold">Demo vocale ASTOR</h1>
        <p className="mt-3 text-slate-400">
          Parlez avec le receptionniste IA comme le ferait un client au telephone.
          Dites par exemple : &quot;Je voudrais un burger et des frites.&quot;
        </p>
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <ElevenLabsWidget />
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Pret a l&apos;installer dans votre restaurant ?{" "}
          <a href="mailto:contact@agencybinari.com" className="text-indigo-300 hover:text-indigo-200">
            Contactez-nous
          </a>
        </p>
      </div>
    </main>
  );
}
