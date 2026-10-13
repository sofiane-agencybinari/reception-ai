"use client";

import { useState, type FormEvent } from "react";

const field =
  "mt-1.5 w-full rounded-xl border border-[#1a1816]/12 bg-white/70 px-4 py-3 text-[15px] text-[#1a1816] outline-none transition placeholder:text-[#8a8175]/70 focus:border-[#5c2a36] focus:bg-white";
const label = "block text-[13px] font-medium text-[#4a453f]";

type Props = { orderId: string; signature: string; restaurant: string; defaultFirstName: string };

export function CustomerInfoForm({ orderId, signature, restaurant, defaultFirstName }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/customer-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          s: signature,
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          email: form.get("email"),
          birthday: form.get("birthday"),
          marketingConsent: form.get("marketingConsent") === "on",
        }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p className="mt-10 rounded-3xl border border-[#1a1816]/10 bg-white/70 p-8 text-center text-[17px]">
        C’est enregistré. Merci et bon appétit !
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <label className={label}>
          Prénom
          <input name="firstName" defaultValue={defaultFirstName} autoComplete="given-name" maxLength={60} className={field} />
        </label>
        <label className={label}>
          Nom
          <input name="lastName" autoComplete="family-name" maxLength={60} className={field} />
        </label>
      </div>
      <label className={label}>
        E-mail
        <input name="email" type="email" autoComplete="email" maxLength={120} className={field} />
      </label>
      <label className={label}>
        Date d’anniversaire
        <input name="birthday" type="date" className={field} />
      </label>
      <label className="flex items-start gap-3 text-[14px] leading-snug text-[#4a453f]">
        <input name="marketingConsent" type="checkbox" className="mt-0.5 h-4 w-4 accent-[#5c2a36]" />
        J’accepte de recevoir les offres de {restaurant} par SMS et par e-mail. Je peux me désinscrire à tout moment.
      </label>
      <button
        type="submit"
        disabled={state === "sending"}
        className="h-12 w-full rounded-full bg-[#5c2a36] text-[15px] text-[#f3f0ed] transition hover:bg-[#4a2029] disabled:opacity-60"
      >
        {state === "sending" ? "Envoi…" : "Enregistrer"}
      </button>
      {state === "error" ? <p className="text-[13px] text-[#b3261e]">Un problème est survenu. Réessayez dans un instant.</p> : null}
      <p className="text-[12px] leading-relaxed text-[#8a8175]">
        Vos informations sont utilisées uniquement par {restaurant} pour vos commandes et, si vous l’avez accepté, pour ses offres.
        Elles ne sont jamais revendues. Vous pouvez demander leur suppression à tout moment.{" "}
        <a href="/confidentialite" className="underline">
          Confidentialité
        </a>
      </p>
    </form>
  );
}
