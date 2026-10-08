"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";

const CUISINE_OPTIONS = [
  { value: "kebab", label: "Kebab" },
  { value: "pizza", label: "Pizza" },
  { value: "burger", label: "Burger" },
  { value: "grill", label: "Grill" },
  { value: "autre", label: "Autre" },
] as const;

type CuisineType = (typeof CUISINE_OPTIONS)[number]["value"];

type FormState = {
  restaurantName: string;
  city: string;
  phone: string;
  email: string;
  cuisineType: CuisineType | "";
  message: string;
  website: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
  restaurantName: "",
  city: "",
  phone: "",
  email: "",
  cuisineType: "",
  message: "",
  website: "",
};

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (form.restaurantName.trim().length < 2) errors.restaurantName = "Indiquez le nom.";
  if (form.city.trim().length < 2) errors.city = "Indiquez la ville.";
  if (form.phone.replace(/[\s.-]/g, "").length < 8) errors.phone = "Téléphone invalide.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "E-mail invalide.";
  if (!form.cuisineType) errors.cuisineType = "Choisissez un type.";
  if (form.message.length > 1000) errors.message = "Message trop long.";
  return errors;
}

const inputClass =
  "mt-1.5 w-full border-0 border-b border-[#1a1816]/12 bg-transparent px-0 py-2.5 text-[15px] text-[#1a1816] outline-none transition-colors placeholder:text-[#1a1816]/25 focus:border-[#5c2a36]";
const labelClass = "block font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-[#8a8175]";

type Props = {
  /** Formule choisie (souscription) : ajoutée en tête du message envoyé. */
  plan?: string;
  /** Libellé du bouton d'envoi. */
  submitLabel?: string;
};

export function MarketingTrialForm({ plan, submitLabel = "Être recontacté" }: Props = {}) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerMessage(null);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName: form.restaurantName.trim(),
          city: form.city.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          cuisineType: form.cuisineType,
          message:
            [plan ? `Formule souhaitée : ${plan}` : null, form.message.trim() || null]
              .filter(Boolean)
              .join("\n") || undefined,
          website: form.website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setServerMessage(data.error ?? "Impossible d'envoyer. Réessayez.");
        return;
      }
      setStatus("success");
      setForm(INITIAL);
      setErrors({});
    } catch {
      setStatus("error");
      setServerMessage("Erreur réseau.");
    }
  }

  return (
    <div className="relative">
      {status === "success" ? (
        <div role="status" className="py-14 text-center">
          <h3 className="lx-title text-2xl text-[#1a1816]">
            Demande <span className="italic">reçue.</span>
          </h3>
          <p className="mt-4 font-serif text-[15px] text-[#5c574f]">On vous rappelle sous 24 h pour l’installation.</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="marketing-btn mt-6 text-[13px] text-[#1a1816] underline underline-offset-4"
          >
            Envoyer une autre demande
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="text-left">
          <div className="absolute -left-[9999px]" aria-hidden>
            <input
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {(
              [
                ["restaurantName", "Restaurant *", "text", "organization", "El Bahja"],
                ["city", "Ville *", "text", "address-level2", "Lyon"],
                ["phone", "Téléphone *", "tel", "tel", "06 12 34 56 78"],
                ["email", "E-mail *", "email", "email", "vous@restaurant.fr"],
              ] as const
            ).map(([key, label, type, auto, placeholder]) => (
              <div key={key}>
                <label htmlFor={`lead-${key}`} className={labelClass}>
                  {label}
                </label>
                <input
                  id={`lead-${key}`}
                  type={type}
                  autoComplete={auto}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                  className={inputClass}
                />
                {errors[key] ? <p className="mt-1.5 text-xs text-[#a3354b]">{errors[key]}</p> : null}
              </div>
            ))}
            <div className="sm:col-span-2">
              <span id="lead-cuisine-label" className={labelClass}>
                Cuisine *
              </span>
              <div role="radiogroup" aria-labelledby="lead-cuisine-label" className="mt-3 flex flex-wrap gap-1.5">
                {CUISINE_OPTIONS.map((o) => {
                  const active = form.cuisineType === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => update("cuisineType", o.value)}
                      className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-300 ${
                        active
                          ? "border-[#1a1816] bg-[#1a1816] text-[#f2efe8]"
                          : "border-[#1a1816]/12 text-[#5c574f] hover:border-[#1a1816]/40"
                      }`}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
              {errors.cuisineType ? <p className="mt-1.5 text-xs text-[#a3354b]">{errors.cuisineType}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="lead-message" className={labelClass}>
                Message <span className="normal-case tracking-normal text-[#8a8175]/70">(optionnel)</span>
              </label>
              <textarea
                id="lead-message"
                rows={2}
                placeholder="Horaires, volume d'appels, particularités du menu…"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className={`${inputClass} resize-none`}
              />
              {errors.message ? <p className="mt-1.5 text-xs text-[#a3354b]">{errors.message}</p> : null}
            </div>
          </div>
          {status === "error" && serverMessage ? (
            <p role="alert" className="mt-5 text-[13px] text-[#a3354b]">
              {serverMessage}
            </p>
          ) : null}
          <div className="mt-9 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xs text-[12px] leading-relaxed text-[#8a8175]">
              Sans engagement · rappel sous 24 h. Vos données servent uniquement à vous recontacter —{" "}
              <a href="/confidentialite" className="underline underline-offset-2 hover:text-[#1a1816]">
                confidentialité
              </a>
              .
            </p>
            <button
              type="submit"
              disabled={status === "loading"}
              className="marketing-btn group flex h-12 shrink-0 items-center gap-3 whitespace-nowrap rounded-full bg-[#1a1816] pl-6 pr-1.5 text-[14px] text-[#f2efe8] transition-colors hover:bg-[#2e2c29] disabled:opacity-60"
            >
              {submitLabel}
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#5c2a36] transition-transform duration-500 group-hover:translate-x-0.5">
                {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
