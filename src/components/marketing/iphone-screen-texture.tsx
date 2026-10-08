"use client";

/**
 * Dessine l'UI LIGNE (appel → conversation) sur un CanvasTexture
 * collé à la dalle du GLB — l'écran n'est plus noir.
 */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import * as THREE from "three";

const W = 780;
const H = 1688;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawBubble(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  mine: boolean,
) {
  ctx.font = "500 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const padX = 28;
  const padY = 18;
  const lineH = 36;
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW - padX * 2) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  const bw = Math.min(
    maxW,
    Math.max(...lines.map((l) => ctx.measureText(l).width)) + padX * 2,
  );
  const bh = lines.length * lineH + padY * 2;
  const bx = mine ? x + maxW - bw : x;

  ctx.fillStyle = mine ? "#2a2926" : "#f0ebe3";
  roundRect(ctx, bx, y, bw, bh, 28);
  ctx.fill();

  ctx.fillStyle = mine ? "#f0ebe3" : "#1a1816";
  ctx.textBaseline = "top";
  lines.forEach((l, i) => {
    ctx.fillText(l, bx + padX, y + padY + i * lineH);
  });

  return bh + 16;
}

function paint(ctx: CanvasRenderingContext2D, progress: number, t: number) {
  // Fond
  ctx.fillStyle = "#090909";
  ctx.fillRect(0, 0, W, H);

  // Subtle grain / wave
  ctx.fillStyle = "rgba(255,255,255,0.015)";
  for (let i = 0; i < 40; i++) {
    const y = ((i * 47 + t * 20) % H);
    ctx.fillRect(0, y, W, 1);
  }

  // Dynamic Island
  ctx.fillStyle = "#000";
  roundRect(ctx, W / 2 - 100, 36, 200, 56, 28);
  ctx.fill();

  // Status bar
  ctx.fillStyle = "#fff";
  ctx.font = "600 26px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("9:41", 56, 64);
  // battery
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2;
  roundRect(ctx, W - 90, 54, 36, 20, 4);
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.fillRect(W - 86, 58, 24, 12);

  const ring = progress < 0.38 ? 1 : progress < 0.46 ? 1 - (progress - 0.38) / 0.08 : 0;
  const talk = progress < 0.38 ? 0 : progress < 0.46 ? (progress - 0.38) / 0.08 : 1;

  if (ring > 0.02) {
    ctx.save();
    ctx.globalAlpha = ring;

    ctx.fillStyle = "#9a948a";
    ctx.font = "500 26px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("appel mobile…", W / 2, 220);

    // Avatar pulse
    const pulse = 1 + Math.sin(t * 4) * 0.04;
    const ar = 72 * pulse;
    const ag = ctx.createRadialGradient(W / 2, 380, 10, W / 2, 380, ar);
    ag.addColorStop(0, "#8b4a58");
    ag.addColorStop(1, "#3d1a22");
    ctx.fillStyle = ag;
    ctx.beginPath();
    ctx.arc(W / 2, 380, ar, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "600 52px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("C", W / 2, 388);

    ctx.fillStyle = "#fff";
    ctx.font = "600 48px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("Client", W / 2, 520);
    ctx.fillStyle = "#8a847a";
    ctx.font = "400 28px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("06 12 34 56 78", W / 2, 570);

    // Buttons
    const by = H - 280;
    ctx.fillStyle = "#3a3835";
    ctx.beginPath();
    ctx.arc(W / 2 - 120, by, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "400 40px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("×", W / 2 - 120, by + 4);

    ctx.fillStyle = "#2d8a5a";
    ctx.beginPath();
    ctx.arc(W / 2 + 120, by, 56, 0, Math.PI * 2);
    ctx.fill();
    // simple phone glyph
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(W / 2 + 120, by, 18, 0.3, Math.PI - 0.3);
    ctx.stroke();

    ctx.fillStyle = "#6f6a62";
    ctx.font = "500 22px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("Refuser", W / 2 - 120, by + 90);
    ctx.fillText("LIGNE", W / 2 + 120, by + 90);

    ctx.restore();
  }

  if (talk > 0.02) {
    ctx.save();
    ctx.globalAlpha = talk;

    ctx.textAlign = "left";
    ctx.fillStyle = "#5cb88a";
    ctx.font = "600 24px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("LIGNE · en ligne", 48, 200);
    ctx.fillStyle = "#fff";
    ctx.font = "600 34px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("Prise de commande", 48, 248);

    ctx.fillStyle = "rgba(255,255,255,0.1)";
    roundRect(ctx, W - 160, 190, 110, 40, 20);
    ctx.fill();
    ctx.fillStyle = "#a8a29a";
    ctx.font = "500 24px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "center";
    ctx.fillText("00:42", W - 105, 212);

    const bubbles: { who: "astor" | "client"; text: string }[] = [
      { who: "astor", text: "Bonsoir, LIGNE pour Le Palmier — je vous écoute." },
      { who: "client", text: "Une Margherita et un Coca, à emporter." },
      { who: "astor", text: "Parfait. Pour quelle heure ?" },
      { who: "client", text: "Dans vingt minutes." },
      { who: "astor", text: "Total 13 €. Je confirme la commande ?" },
    ];

    let y = 320;
    const maxW = W - 96;
    for (const b of bubbles) {
      ctx.textAlign = "left";
      y += drawBubble(ctx, b.text, 48, y, maxW, b.who === "client");
    }

    ctx.restore();
  }
}

type Props = {
  progress: MotionValue<number>;
  material: THREE.MeshStandardMaterial;
};

export function useIPhoneScreenTexture(progress: MotionValue<number>) {
  const canvas = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    return c;
  }, []);

  const texture = useMemo(() => {
    if (!canvas) return null;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    // CanvasTexture : flipY true (défaut) — false mettait l’UI tête en bas sur ce GLB
    tex.flipY = true;
    return tex;
  }, [canvas]);

  const prog = useRef(progress.get());
  useMotionValueEvent(progress, "change", (v) => {
    prog.current = v;
  });

  useFrame(({ clock }) => {
    if (!canvas || !texture) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    paint(ctx, prog.current, clock.getElapsedTime());
    texture.needsUpdate = true;
  });

  useEffect(() => () => texture?.dispose(), [texture]);

  return texture;
}
