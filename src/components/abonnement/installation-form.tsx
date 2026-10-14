"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";

const EASE = [0.23, 1, 0.32, 1] as const;

type Props = { sessionId: string; defaults: { email: string; mobile: string; restaurantName: string } };

const input =
  "mt-2 w-full rounded-xl border border-[#1a1816]/12 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[#5c2a36]";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block text-[14px] font-medium">
      {label}
      {hint ? <span className="block text-[12px] font-normal text-[#8a8175]">{hint}</span> : null}
      {children}
    </label>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="rounded-[22px] bg-[#f3f0ed] p-6 sm:p-8"
    >
      <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-[#5c2a36]">Étape {n}</p>
      <h2 className="mt-2 text-[1.35rem] font-medium tracking-[-0.02em]">{title}</h2>
      <div className="mt-6 space-y-5">{children}</div>
    </motion.section>
  );
}

export function InstallationForm({ sessionId, defaults }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = { sessionId, services: form.getAll("services") };
    form.forEach((value, key) => {
      if (key !== "services") payload[key] = String(value);
    });
    setStatus("sending");
    setMessage(null);
    const res = await fetch("/api/installation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    const data = (await res?.json().catch(() => ({}))) as { error?: string } | undefined;
    if (res?.ok) {
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStatus("error");
      setMessage(data?.error ?? "Envoi impossible. Réessayez.");
    }
  }

  if (status === "done") return <InstallationGuide />;

  return (
    <form onSubmit={submit} className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
        <p className="lx-label">Bienvenue dans l’équipe</p>
        <h1 className="mt-4 text-[clamp(2rem,5vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.04em]">
          Préparons votre agent, <span className="text-[#5c2a36]">en 5 minutes.</span>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[#5c574f]">
          Tout ce que vous écrivez ici sert à configurer votre agent : il connaîtra votre carte, vos horaires et vos habitudes
          comme un équipier. Aucun rendez-vous nécessaire.
        </p>
      </motion.div>

      <Step n={1} title="Votre restaurant">
        <Field label="Nom du restaurant *"><input name="restaurantName" required defaultValue={defaults.restaurantName} className={input} /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Votre nom *"><input name="contactName" required className={input} /></Field>
          <Field label="Votre portable *"><input name="mobile" type="tel" required defaultValue={defaults.mobile} className={input} /></Field>
        </div>
        <Field label="E-mail *"><input name="email" type="email" required defaultValue={defaults.email} className={input} /></Field>
        <Field label="Adresse du restaurant"><input name="address" className={input} /></Field>
      </Step>

      <Step n={2} title="Votre téléphone">
        <Field label="Numéro que vos clients appellent *"><input name="restaurantPhone" type="tel" required className={input} /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Type de ligne">
            <select name="phoneType" className={input} defaultValue="Fixe (box internet)">
              <option>Fixe (box internet)</option>
              <option>Portable</option>
              <option>Standard téléphonique</option>
            </select>
          </Field>
          <Field label="Opérateur">
            <select name="operator" className={input} defaultValue="Orange">
              <option>Orange</option>
              <option>SFR</option>
              <option>Free</option>
              <option>Bouygues Telecom</option>
              <option>Autre</option>
            </select>
          </Field>
        </div>
        <Field label="Quand Ligne doit-il répondre ?">
          <select name="forwarding" className={input} defaultValue="Tous les appels">
            <option>Tous les appels</option>
            <option>Seulement quand on ne décroche pas ou que la ligne est occupée</option>
          </select>
        </Field>
      </Step>

      <Step n={3} title="Votre service">
        <Field label="Horaires d’ouverture *" hint="Ex. : lun-sam 11h30-14h30 et 18h30-23h, dimanche soir uniquement">
          <textarea name="hours" required rows={3} className={input} />
        </Field>
        <fieldset>
          <legend className="text-[14px] font-medium">Services proposés</legend>
          <div className="mt-2 flex flex-wrap gap-3 text-[14px]">
            {["À emporter", "Livraison", "Sur place"].map((s) => (
              <label key={s} className="flex items-center gap-2 rounded-full border border-[#1a1816]/12 bg-white px-4 py-2">
                <input type="checkbox" name="services" value={s} defaultChecked={s === "À emporter"} className="accent-[#5c2a36]" />
                {s}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Zone et frais de livraison"><input name="deliveryZone" placeholder="Ex. : 3 km, 2,50 €, minimum 15 €" className={input} /></Field>
          <Field label="Temps de préparation habituel"><input name="prepTime" placeholder="Ex. : 20 min" className={input} /></Field>
        </div>
      </Step>

      <Step n={4} title="Votre carte">
        <Field label="Votre carte avec les prix" hint="Copiez-collez votre carte, ou donnez un lien ci-dessous (site, Uber Eats, Deliveroo…)">
          <textarea name="menuText" rows={8} className={input} />
        </Field>
        <Field label="Lien vers votre carte"><input name="menuLink" type="url" placeholder="https://" className={input} /></Field>
        <Field label="Vos plats et menus phares" hint="Ceux que l’agent doit proposer en premier">
          <textarea name="bestSellers" rows={2} className={input} />
        </Field>
        <Field label="Cuissons, sauces, suppléments" hint="Ex. : steak saignant / à point / bien cuit ; sauces : algérienne, samouraï… ; supplément fromage 1 €">
          <textarea name="options" rows={3} className={input} />
        </Field>
      </Step>

      <Step n={5} title="Derniers réglages">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Logiciel de caisse" hint="Pour envoyer les tickets en cuisine"><input name="pos" placeholder="Ex. : Zelty, Lightspeed, aucun" className={input} /></Field>
          <Field label="Voix de l’agent">
            <select name="voice" className={input} defaultValue="Voix féminine">
              <option>Voix féminine</option>
              <option>Voix masculine</option>
            </select>
          </Field>
        </div>
        <Field label="Autre chose à savoir ?"><textarea name="notes" rows={3} className={input} /></Field>
      </Step>

      <div className="text-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="marketing-btn inline-flex h-16 w-full max-w-md items-center justify-center gap-2 rounded-full bg-[#5c2a36] text-[16px] font-medium text-[#f2efe8] transition-colors hover:bg-[#4a2029] disabled:opacity-70"
        >
          {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          Envoyer et lancer mon installation
        </button>
        {message ? <p className="mt-3 text-[13px] text-[#a3354b]">{message}</p> : null}
      </div>
    </form>
  );
}

const GUIDE = [
  {
    title: "On configure votre agent",
    text: "Avec votre carte et vos réponses, on prépare votre agent. Vous n’avez rien à faire.",
    when: "Sous 24 h",
  },
  {
    title: "Vous recevez votre numéro Ligne et vos accès",
    text: "Par e-mail : le numéro vers lequel renvoyer vos appels, et vos identifiants de l’espace restaurant (écran cuisine, appels, chiffres).",
    when: "Sous 24 h",
  },
  {
    title: "Vous activez le renvoi d’appel",
    text: "Depuis le téléphone du restaurant, composez *21* puis le numéro Ligne, puis # (ex. : *21*0912345678#). Pour ne renvoyer que les appels sans réponse : *61*numéro#. Pour annuler : #21#. Sur une box internet, le renvoi se règle aussi dans l’espace client de votre opérateur.",
    when: "2 minutes",
  },
  {
    title: "Vous testez",
    text: "Appelez votre restaurant depuis un portable et passez une commande : elle s’affiche sur l’écran cuisine, avec un signal sonore.",
    when: "1 minute",
  },
] as const;

function InstallationGuide() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
      <CheckCircle2 className="h-12 w-12 text-[#5c2a36]" />
      <h1 className="mt-5 text-[clamp(2rem,5vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.04em]">
        Tout est reçu. <span className="text-[#5c2a36]">On s’occupe du reste.</span>
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-[#5c574f]">
        Un e-mail de confirmation vient de partir. Voici la suite, entièrement à distance :
      </p>
      <ol className="mt-10 space-y-4">
        {GUIDE.map((step, i) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.12 }}
            className="flex gap-4 rounded-[20px] bg-[#f3f0ed] p-6"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#5c2a36] text-[14px] font-semibold text-[#f2efe8]">{i + 1}</span>
            <div>
              <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-[#8a8175]">{step.when}</p>
              <p className="mt-1 text-[16px] font-medium">{step.title}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-[#5c574f]">{step.text}</p>
            </div>
          </motion.li>
        ))}
      </ol>
      <p className="mt-10 text-[14px] text-[#5c574f]">Une question ? Sofiane : 06 95 84 64 41</p>
    </motion.div>
  );
}
