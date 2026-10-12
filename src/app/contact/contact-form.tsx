"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

const field =
  "mt-1.5 w-full rounded-xl border border-[#1a1816]/12 bg-white/70 px-4 py-3 text-[15px] text-[#1a1816] outline-none transition placeholder:text-[#8a8175]/70 focus:border-[#5c2a36] focus:bg-white";
const label = "block text-[13px] font-medium text-[#4a453f]";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-3xl border border-[#1a1816]/10 bg-white/70 p-8 text-center">
        <p className="font-sans text-[1.6rem] font-medium tracking-[-0.03em]">Merci, c’est bien reçu.</p>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#5c574f]">
          Nous vous rappelons très vite, en général dans la journée. Vous pouvez aussi appeler la démo dès maintenant pour
          entendre Ligne prendre une commande.
        </p>
        <Link
          href="/#essai"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-[#5c2a36] px-6 text-[14px] text-[#f3f0ed] hover:bg-[#4a2029]"
        >
          Appeler la démo →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-[#1a1816]/10 bg-white/50 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Nom et prénom *
          <input name="name" required minLength={2} autoComplete="name" className={field} placeholder="Votre nom" />
        </label>
        <label className={label}>
          Restaurant
          <input name="restaurant" autoComplete="organization" className={field} placeholder="Nom de l’établissement" />
        </label>
        <label className={label}>
          Téléphone *
          <input name="phone" required minLength={8} type="tel" autoComplete="tel" className={field} placeholder="06 12 34 56 78" />
        </label>
        <label className={label}>
          E-mail *
          <input name="email" required type="email" autoComplete="email" className={field} placeholder="vous@restaurant.fr" />
        </label>
        <label className={`${label} sm:col-span-2`}>
          Ville
          <input name="city" autoComplete="address-level2" className={field} placeholder="Paris, Saint-Denis, Créteil…" />
        </label>
        <label className={`${label} sm:col-span-2`}>
          Votre question ou votre besoin
          <textarea
            name="message"
            rows={4}
            className={`${field} resize-none`}
            placeholder="Nombre de restaurants, volume d’appels, outil de caisse actuel, questions…"
          />
        </label>
        {/* Pot de miel anti-robots : invisible pour les visiteurs */}
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      </div>

      <div className="mt-6 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] leading-relaxed text-[#8a8175]">
          Vos informations servent uniquement à vous recontacter. Aucune publicité.
        </p>
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-12 shrink-0 items-center rounded-full bg-[#1a1816] px-7 text-[14px] font-medium text-[#f3f0ed] transition hover:bg-[#5c2a36] disabled:opacity-60"
        >
          {state === "sending" ? "Envoi…" : "Être recontacté →"}
        </button>
      </div>
      {state === "error" ? (
        <p className="mt-4 text-[13px] text-[#a1323f]">
          L’envoi n’a pas abouti. Appelez-nous ou écrivez-nous directement avec les coordonnées ci-dessous.
        </p>
      ) : null}
    </form>
  );
}
