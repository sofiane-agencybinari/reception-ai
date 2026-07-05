import Link from "next/link";
import { Headphones } from "lucide-react";

import { ElevenLabsWidget } from "@/components/elevenlabs-widget";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="marketing-grid pointer-events-none fixed inset-0 opacity-30" />
      <MarketingHeader />
      <main className="relative z-10 mx-auto max-w-2xl px-6 py-16">
        <Link href="/" className="text-sm text-zinc-500 transition hover:text-white">
          ← Retour au site
        </Link>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-astor-accent/20 bg-astor-accent/10 px-4 py-1.5 text-xs font-medium text-teal-100">
          <Headphones className="h-3.5 w-3.5" />
          Demo interactive
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">
          Parlez avec <span className="text-gradient">ASTOR</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Testez le receptionniste IA comme un vrai client. Essayez par exemple :
        </p>
        <ul className="mt-4 space-y-2 text-sm text-zinc-500">
          <li>&quot;Bonjour, je voudrais un burger classique et des frites.&quot;</li>
          <li>&quot;C&apos;est pour dans 20 minutes, au nom de Sophie.&quot;</li>
          <li>&quot;Qu&apos;est-ce que vous avez comme boissons ?&quot;</li>
        </ul>
        <div className="glass-card mt-10 rounded-2xl p-6">
          <ElevenLabsWidget />
        </div>
        <p className="mt-8 text-center text-sm text-zinc-500">
          Convaincu ?{" "}
          <a
            href="mailto:contact@agencybinari.com?subject=Demo%20ASTOR"
            className="font-medium text-astor-accent-soft hover:text-astor-accent-bright"
          >
            Demandez votre essai gratuit →
          </a>
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
