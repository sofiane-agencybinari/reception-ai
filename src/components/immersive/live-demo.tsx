"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { AnimatePresence, motion } from "motion/react";
import { Keyboard, Mic, Phone, PhoneOff, Send } from "lucide-react";

import { CharReveal } from "./char-reveal";
import type { OrbPose } from "./orb-canvas";
import { EASE } from "./reveal";
import { useSubscribe } from "./subscribe-panel";

const OrbCanvas = dynamic(() => import("./orb-canvas"), { ssr: false });

/**
 * Agent ElevenLabs dédié à la démo du site (scripts/configure-site-demo-agent.mjs) :
 * restaurant fictif « Le Comptoir », aucun outil branché — un test ne crée jamais de commande réelle.
 * Agent privé : chaque session est autorisée par /api/demo-session (limites par visiteur).
 */
const DEMO_AGENT = {
  restaurant: "Le Comptoir",
  menu: "Burgers, tacos, pizzas · emporter et livraison",
  prompts: [
    "Deux burgers Classique, un à point, un bien cuit.",
    "Une reine sans champignons, en livraison.",
    "Je suis allergique aux noix, c’est possible ?",
  ],
} as const;

type Line = { id: number; role: "user" | "agent"; text: string };

function useCallTimer(running: boolean) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!running) return;
    const start = Date.now();
    const id = window.setInterval(
      () => setSecs(Math.floor((Date.now() - start) / 1000)),
      500,
    );
    return () => {
      window.clearInterval(id);
      setSecs(0);
    };
  }, [running]);
  return `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
}

function Demo() {
  const pose = useRef<OrbPose>({ x: 0.62, y: 0.42, s: 0.95, energy: 0.35 });
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState<string | null>(null);
  const subscribe = useSubscribe();
  const [called, setCalled] = useState(false);
  /** Mode de la session : voix (micro) ou texte (visiteurs sans micro). */
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [draft, setDraft] = useState("");
  const [micWaiting, setMicWaiting] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limited, setLimited] = useState(false);
  const lastAgentAt = useRef(0);
  const modeRef = useRef<"voice" | "text">("voice");

  const conversation = useConversation({
    onMessage: (m) => {
      const text = m.message?.trim();
      if (!text) return;
      const role = m.source === "user" ? "user" : "agent";
      if (role === "agent") lastAgentAt.current = performance.now();
      // En mode texte, les messages du visiteur sont déjà affichés à l'envoi.
      if (role === "user" && modeRef.current === "text") return;
      setLines((prev) => [
        ...prev.slice(modeRef.current === "text" ? -5 : -1),
        {
          id: m.event_id ?? Date.now(),
          role,
          text,
        },
      ]);
    },
    onError: (message) =>
      setError(
        typeof message === "string"
          ? message
          : "La connexion a échoué. Réessayez.",
      ),
    onDisconnect: () => setCalled(true),
  });
  const { status, isSpeaking } = conversation;
  const live = status === "connected";
  const connecting = status === "connecting";
  const timer = useCallTimer(live);

  // L'orbe vit au rythme de la conversation : volume de Ligne et du client à chaque image.
  const getOut = conversation.getOutputVolume;
  const getIn = conversation.getInputVolume;
  useEffect(() => {
    const mobile = () => window.matchMedia("(max-width: 1023px)").matches;
    let raf = 0;
    const tick = () => {
      const m = mobile();
      const base = {
        x: m ? 0.5 : 0.64,
        y: m ? 0.36 : 0.42,
        s: m ? 0.62 : 0.95,
      };
      if (live) {
        let vol = 0;
        if (modeRef.current === "voice") {
          try {
            vol = Math.max(getOut() * 1.4, getIn());
          } catch {
            vol = 0;
          }
        } else {
          // Mode texte : l'orbe s'anime brièvement à chaque réponse de Ligne.
          vol = Math.max(0, 1 - (performance.now() - lastAgentAt.current) / 1400) * 0.5;
        }
        pose.current = {
          ...base,
          s: base.s * (1 + vol * 0.18),
          energy: 0.45 + vol * 2.2,
        };
      } else {
        pose.current = { ...base, energy: connecting ? 0.9 : 0.35 };
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, connecting, getOut, getIn]);

  async function startCall() {
    setError(null);
    setLines([]);
    setMode("voice");
    modeRef.current = "voice";
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError("Ce navigateur ne donne pas accès au micro. Ouvrez la page dans Chrome, Safari ou Edge, ou testez par écrit.");
      return;
    }
    // Certains navigateurs intégrés n'affichent jamais la demande d'autorisation :
    // sans réponse au bout de 8 s, on l'explique au lieu de rester bloqué.
    setMicWaiting(true);
    const result = await Promise.race([
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          stream.getTracks().forEach((t) => t.stop());
          return "ok" as const;
        })
        .catch(() => "denied" as const),
      new Promise<"timeout">((resolve) => window.setTimeout(() => resolve("timeout"), 8000)),
    ]);
    setMicWaiting(false);
    if (result === "denied") {
      setError("Le micro a été refusé. Autorisez-le dans la barre d’adresse, ou testez par écrit.");
      return;
    }
    if (result === "timeout") {
      setError("Le micro ne répond pas dans ce navigateur. Ouvrez la page dans Chrome, Safari ou Edge, ou testez par écrit.");
      return;
    }
    const session = await requestSession("voice");
    if (!session?.conversationToken) return;
    conversation.startSession({
      conversationToken: session.conversationToken,
      connectionType: "webrtc",
    });
  }

  /** Autorisation serveur : limite par visiteur + plafond journalier, agent privé. */
  async function requestSession(kind: "voice" | "text") {
    try {
      const res = await fetch("/api/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: kind }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        remaining?: number;
        conversationToken?: string;
        signedUrl?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "La démo ne répond pas. Réessayez dans un instant.");
        if (res.status === 429) {
          setLimited(true);
          setCalled(true);
        }
        return null;
      }
      setRemaining(data.remaining ?? null);
      return data;
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau et réessayez.");
      return null;
    }
  }

  async function startText() {
    setError(null);
    setLines([]);
    setMode("text");
    modeRef.current = "text";
    const session = await requestSession("text");
    if (!session?.signedUrl) return;
    conversation.startSession({
      signedUrl: session.signedUrl,
      textOnly: true,
      connectionType: "websocket",
      overrides: { conversation: { textOnly: true } },
    });
  }

  function sendText(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !live) return;
    conversation.sendUserMessage(text);
    setLines((prev) => [...prev.slice(-5), { id: Date.now(), role: "user", text }]);
    setDraft("");
  }

  const statusLabel = micWaiting
    ? "Autorisez le micro…"
    : connecting
      ? "Ligne décroche…"
      : live
        ? mode === "text"
          ? "Conversation écrite en cours"
          : isSpeaking
            ? "Ligne parle"
            : "À vous, Ligne écoute"
        : "Prêt à décrocher";

  return (
    <section
      id="essai"
      data-tone="dark"
      className="relative min-h-[100svh] overflow-hidden bg-[#120a0c] text-[#f2efe8]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[36%] h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full lg:left-[64%] lg:top-[42%]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(122,52,69,0.42), rgba(92,42,54,0.1) 55%, transparent)",
        }}
      />
      <div className="absolute inset-0 z-0">
        <OrbCanvas pose={pose} />
      </div>

      {/* Lueur IA pendant l'appel */}
      <AnimatePresence>
        {live && mode === "voice" ? (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: isSpeaking ? 0.55 : 0.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            aria-hidden
          >
            <div className="lx-ai-glow">
              <span />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-6xl gap-10 px-5 pb-16 pt-28 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:pt-24">
        {/* Texte */}
        <div className="order-2 lg:order-1">
          <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.22em] text-[#d9a3b0]">
            06 — Démo en direct
          </p>
          <h2 className="mt-5 font-sans text-[clamp(2rem,3.6vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.045em]">
            <CharReveal text="Appelez Ligne." show fromHidden stagger={0.03} />
            <br />
            <span className="text-[#d9a3b0]">
              <CharReveal text="Maintenant." show fromHidden stagger={0.03} />
            </span>
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/60">
            Pas de formulaire, pas d’attente : parlez-lui comme un vrai client.
            Autorisez le micro, c’est tout.
          </p>

          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f2efe8] font-serif text-lg text-[#5c2a36]">
              C
            </span>
            <div>
              <p className="text-[15px] font-medium">{DEMO_AGENT.restaurant}</p>
              <p className="text-[12px] text-white/50">{DEMO_AGENT.menu}</p>
            </div>
            <span className="ml-auto shrink-0 whitespace-nowrap rounded-full border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/45">
              Restaurant de démo
            </span>
          </div>

          <div className="mt-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              Essayez de dire
            </p>
            <ul className="mt-3 space-y-2">
              {DEMO_AGENT.prompts.map((p, i) => (
                <motion.li
                  key={p}
                  className="flex items-start gap-2.5 text-[14px] text-white/75"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#d9a3b0]" />
                  « {p} »
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-[14px] text-white/60">
              Convaincu ? On l’installe chez vous en 24 h.
            </p>
            <button
              type="button"
              onClick={() => subscribe.open()}
              className="marketing-btn mt-3 inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-[13px] transition-colors hover:border-white/50"
            >
              Laisser mes coordonnées <span aria-hidden>→</span>
            </button>
          </div>
        </div>

        {/* Appel */}
        <div className="order-1 flex min-h-[52svh] flex-col items-center justify-end lg:order-2 lg:min-h-[78svh]">
          <p className="mb-4 flex items-center gap-2 text-[12px] text-white/60">
            <span
              className={`h-1.5 w-1.5 rounded-full ${live ? "bg-[#7ae582]" : connecting ? "bg-[#ffd166]" : "bg-white/30"}`}
            />
            {statusLabel}
            {live ? (
              <span className="font-[family-name:var(--font-geist-mono)] tabular-nums text-white/40">
                · {timer}
              </span>
            ) : null}
          </p>

          {live || connecting ? (
            <button
              type="button"
              onClick={() => conversation.endSession()}
              className="marketing-btn flex h-16 items-center gap-3 rounded-full bg-[#c2413f] pl-6 pr-7 text-[15px] font-medium text-white shadow-[0_20px_60px_-20px_rgba(194,65,63,0.8)] transition-colors hover:bg-[#d24c49]"
            >
              <PhoneOff className="h-5 w-5" /> {mode === "text" ? "Terminer" : "Raccrocher"}
            </button>
          ) : (
            <button
              type="button"
              onClick={startCall}
              disabled={micWaiting || limited}
              className="marketing-btn group relative disabled:opacity-70 flex h-16 items-center gap-3 rounded-full bg-[#f2efe8] pl-6 pr-7 text-[15px] font-medium text-[#1a1816] shadow-[0_20px_60px_-20px_rgba(242,239,232,0.5)] transition-colors hover:bg-white"
            >
              <span
                className="lx-ring absolute inset-0 rounded-full border border-[#f2efe8]/60"
                aria-hidden
              />
              <Phone className="h-5 w-5 text-[#5c2a36]" /> Appeler {DEMO_AGENT.restaurant}
            </button>
          )}

          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/35">
            <Mic className="h-3 w-3" /> Vraie conversation · 3 min max · 2 essais par visiteur · aucune commande réelle
          </p>
          <p className="mt-1 max-w-sm text-center text-[10px] leading-relaxed text-white/30">
            En lançant la démo, vous acceptez que la conversation soit traitée par notre agent IA.{" "}
            <a href="/confidentialite" className="underline underline-offset-2 hover:text-white/60">
              En savoir plus
            </a>
          </p>

          {remaining !== null && !live && !connecting && !limited ? (
            <p className="mt-2 text-[11px] text-white/40">
              {remaining > 0 ? `Encore ${remaining} essai disponible.` : "C’était votre dernier essai."}
            </p>
          ) : null}

          {!live && !connecting && !limited ? (
            <button
              type="button"
              onClick={startText}
              className="marketing-btn mt-3 inline-flex items-center gap-1.5 text-[13px] text-white/70 underline-offset-4 hover:text-white hover:underline"
            >
              <Keyboard className="h-3.5 w-3.5" /> Pas de micro ? Tester par écrit
            </button>
          ) : null}

          {error ? (
            <p className="mt-3 max-w-xs text-center text-[12px] text-[#e7a3b1]">
              {error}
            </p>
          ) : null}

          {/* Transcription */}
          <div className="mt-6 flex min-h-[5.5rem] w-full max-w-md flex-col gap-2">
            <AnimatePresence initial={false}>
              {lines.map((l) => (
                <motion.p
                  key={l.id}
                  layout
                  className={`rounded-2xl px-4 py-2.5 text-[13px] leading-snug backdrop-blur-xl ${
                    l.role === "agent"
                      ? "self-start bg-white/[0.08] text-[#f2efe8]"
                      : "self-end bg-[#f2efe8] text-[#1a1816]"
                  }`}
                  initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <span className="mr-2 font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.18em] opacity-50">
                    {l.role === "agent" ? "Ligne" : "Vous"}
                  </span>
                  {l.text}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>

          {/* Saisie en mode texte */}
          {live && mode === "text" ? (
            <form onSubmit={sendText} className="mt-3 flex w-full max-w-md items-center gap-2">
              <label htmlFor="demo-text" className="sr-only">
                Votre message
              </label>
              <input
                id="demo-text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoComplete="off"
                autoFocus
                placeholder="Ex. : deux burgers Classique à emporter"
                className="h-12 flex-1 rounded-full border border-white/15 bg-white/[0.06] px-5 text-[14px] text-[#f2efe8] outline-none backdrop-blur-xl placeholder:text-white/35 focus:border-white/40"
              />
              <button
                type="submit"
                aria-label="Envoyer"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f2efe8] text-[#5c2a36] transition-colors hover:bg-white"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          ) : null}

          {/* Après l'appel : proposition de contact */}
          <AnimatePresence>
            {called && !live && !connecting ? (
              <motion.button
                type="button"
                onClick={() => subscribe.open()}
                className="marketing-btn mt-2 text-[13px] text-[#d9a3b0] underline underline-offset-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Ça vous plaît ? Laissez vos coordonnées, on vous rappelle.
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}

/** Démo en direct : le visiteur appelle un vrai agent Ligne depuis la page. */
export function LiveDemo() {
  return (
    <ConversationProvider>
      <Demo />
    </ConversationProvider>
  );
}
