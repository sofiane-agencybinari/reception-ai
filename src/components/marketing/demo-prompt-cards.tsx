"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export type DemoPrompt = {
  label: string;
  text: string;
};

type Props = {
  prompts: readonly DemoPrompt[];
};

export function DemoPromptCards({ prompts }: Props) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  async function handleSelect(index: number, text: string) {
    setActive(index);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      window.setTimeout(() => setCopied((c) => (c === index ? null : c)), 1800);
    } catch {
      // Clipboard may be blocked; highlight still guides the user.
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-zinc-700">Essayez ces phrases :</p>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {prompts.map((prompt, index) => {
          const isActive = active === index;
          const isCopied = copied === index;

          return (
            <motion.li
              key={prompt.text}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: reduce ? 0 : 0.08 * index, ease: EASE }}
            >
              <motion.button
                type="button"
                onClick={() => void handleSelect(index, prompt.text)}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={[
                  "group flex h-full w-full flex-col rounded-2xl border p-4 text-left transition-colors duration-200",
                  isActive
                    ? "border-astor-accent/45 bg-astor-accent/12 shadow-[0_0_0_1px_rgba(22,22,21,0.08)]"
                    : "border-zinc-200 bg-white hover:border-astor-accent/25 hover:bg-white/[0.04]",
                ].join(" ")}
                aria-pressed={isActive}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-astor-accent-soft">
                    {prompt.label}
                  </span>
                  <span className="text-zinc-600 transition group-hover:text-astor-accent-soft">
                    {isCopied ? (
                      <Check className="h-3.5 w-3.5 text-astor-accent" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </span>
                </span>
                <span className="mt-2 text-sm leading-snug text-zinc-700">&ldquo;{prompt.text}&rdquo;</span>
                <span className="mt-3 text-[11px] font-medium text-zinc-500">
                  {isCopied ? "Copié — dites-le à LIGNE" : "Cliquer pour copier"}
                </span>
              </motion.button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
