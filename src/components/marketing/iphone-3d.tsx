"use client";

import { type ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

/**
 * iPhone 17 Pro — titane bordeaux, volume CSS 3D (6 faces).
 * Parent : perspective + preserve-3d. Pas d’opacity sur ce nœud.
 */

const W = 248;
const H = 506;
const D = 18;
const HZ = D / 2;
const WZ = W / 2;
const HY = H / 2;

type Props = {
  progress: MotionValue<number>;
  ringPulse: MotionValue<number>;
};

export function IPhone3D({ progress, ringPulse }: Props) {
  const screenRing = useTransform(progress, [0, 0.36, 0.42], [1, 1, 0]);
  const screenTalk = useTransform(progress, [0.38, 0.46, 0.58], [0, 1, 1]);
  const vibrateY = useTransform(progress, (p) => {
    if (p > 0.12) return 0;
    return Math.sin(p * 110) * 1.4;
  });
  const pulseScale = useTransform(ringPulse, [0, 1], [0.92, 1.1]);
  const pulseOpacity = useTransform(ringPulse, [0, 1], [0.15, 0.55]);

  return (
    <motion.div
      className="iphone-3d-rig"
      style={{
        width: W,
        height: H,
        y: vibrateY,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-[#5c2a36]/35"
        style={{
          width: W * 1.6,
          height: W * 1.6,
          x: "-50%",
          y: "-50%",
          opacity: pulseOpacity,
          scale: pulseScale,
          transformStyle: "preserve-3d",
        }}
        aria-hidden
      />

      <div className="iphone-3d" style={{ width: W, height: H, transformStyle: "preserve-3d" }}>
        {/* FRONT */}
        <div
          className="iphone-3d-face iphone-3d-front"
          style={{ width: W, height: H, transform: `translateZ(${HZ}px)` }}
        >
          <div className="iphone-3d-bezel">
            <div className="iphone-3d-screen">
              <div className="iphone-3d-island" />
              <div className="iphone-3d-statusbar">
                <span>9:41</span>
                <span className="iphone-3d-battery" />
              </div>

              <motion.div className="iphone-3d-ui" style={{ opacity: screenRing }}>
                <p className="text-[11px] font-medium tracking-wide text-[#9a948a]">appel mobile…</p>
                <div className="mt-7 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-[#8b4a58] to-[#3d1a22] text-xl font-semibold text-white">
                  C
                </div>
                <p className="mt-5 text-[20px] font-semibold tracking-tight text-white">Client</p>
                <p className="mt-1 text-[12px] text-[#8a847a]">06 12 34 56 78</p>
                <div className="mt-auto flex w-full justify-center gap-10 pb-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3a3835]">
                      <span className="text-lg text-white/80">×</span>
                    </div>
                    <span className="text-[10px] text-[#6f6a62]">Refuser</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2d8a5a] shadow-[0_8px_24px_-6px_rgba(45,138,90,0.55)]">
                      <PhoneGlyph />
                    </div>
                    <span className="text-[10px] text-[#6f6a62]">LIGNE</span>
                  </div>
                </div>
              </motion.div>

              <motion.div className="iphone-3d-ui" style={{ opacity: screenTalk }}>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-[#5cb88a]">LIGNE · en ligne</p>
                    <p className="text-[13px] font-semibold text-white">Prise de commande</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] tabular-nums text-[#a8a29a]">
                    00:42
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-end gap-2.5">
                  <Bubble who="astor">Bonsoir, LIGNE pour Le Palmier — je vous écoute.</Bubble>
                  <Bubble who="client">Une Margherita et un Coca, à emporter.</Bubble>
                  <Bubble who="astor">Parfait. Pour quelle heure ?</Bubble>
                  <Bubble who="client">Dans vingt minutes.</Bubble>
                  <Bubble who="astor">Total 13 €. Je confirme la commande ?</Bubble>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* BACK — Pro bordeaux */}
        <div
          className="iphone-3d-face iphone-3d-back"
          style={{ width: W, height: H, transform: `rotateY(180deg) translateZ(${HZ}px)` }}
        >
          <div className="iphone-3d-back-glass">
            {/* Camera Control island — layout Pro */}
            <div className="iphone-3d-camera-pro">
              <div className="iphone-3d-cam-grid">
                <span className="iphone-3d-lens-pro" />
                <span className="iphone-3d-lens-pro" />
                <span className="iphone-3d-lens-pro" />
              </div>
              <div className="iphone-3d-cam-sensors">
                <span className="iphone-3d-flash" />
                <span className="iphone-3d-mic" />
              </div>
            </div>
            {/* Logo Apple simplifié */}
            <svg
              className="iphone-3d-apple"
              viewBox="0 0 24 28"
              fill="currentColor"
              aria-hidden
            >
              <path d="M19.7 14.4c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-1.9-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.3 2.5 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.2 3.2-2.4.6-.8 1.1-1.7 1.5-2.6-3.5-1.3-4.1-5.1-3.3-7.5z" />
              <path d="M15.8 6.1c.7-.9 1.2-2.1 1.1-3.3-1.1.1-2.4.7-3.2 1.6-.7.8-1.3 2-1.2 3.2 1.2.1 2.5-.6 3.3-1.5z" />
            </svg>
          </div>
        </div>

        {/* LEFT */}
        <div
          className="iphone-3d-face iphone-3d-side"
          style={{
            width: D,
            height: H,
            left: WZ - HZ,
            transform: `rotateY(-90deg) translateZ(${WZ}px)`,
          }}
        >
          <span className="iphone-3d-btn" style={{ top: "16%" }} />
          <span className="iphone-3d-btn iphone-3d-btn-long" style={{ top: "26%" }} />
          <span className="iphone-3d-btn iphone-3d-btn-long" style={{ top: "38%" }} />
        </div>

        {/* RIGHT — Camera Control */}
        <div
          className="iphone-3d-face iphone-3d-side"
          style={{
            width: D,
            height: H,
            left: WZ - HZ,
            transform: `rotateY(90deg) translateZ(${WZ}px)`,
          }}
        >
          <span className="iphone-3d-btn iphone-3d-btn-action" style={{ top: "22%" }} />
          <span className="iphone-3d-btn iphone-3d-btn-long" style={{ top: "34%" }} />
        </div>

        {/* TOP */}
        <div
          className="iphone-3d-face iphone-3d-cap"
          style={{
            width: W,
            height: D,
            top: HY - HZ,
            transform: `rotateX(90deg) translateZ(${HY}px)`,
          }}
        />

        {/* BOTTOM */}
        <div
          className="iphone-3d-face iphone-3d-cap"
          style={{
            width: W,
            height: D,
            top: HY - HZ,
            transform: `rotateX(-90deg) translateZ(${HY}px)`,
          }}
        >
          <span className="iphone-3d-speaker" />
          <span className="iphone-3d-port" />
          <span className="iphone-3d-speaker" />
        </div>
      </div>
    </motion.div>
  );
}

function Bubble({ who, children }: { who: "astor" | "client"; children: ReactNode }) {
  const mine = who === "client";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[94%] rounded-[1.15rem] px-3 py-2 text-[11px] leading-snug ${
          mine
            ? "rounded-br-md bg-[#2a2926] text-[#f0ebe3]"
            : "rounded-bl-md bg-[#f0ebe3] text-[#1a1816]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function PhoneGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.1 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
