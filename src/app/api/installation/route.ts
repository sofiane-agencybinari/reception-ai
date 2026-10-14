import { NextResponse } from "next/server";

import { INSTALLATION_FIELDS, paidCheckout, type InstallationKey } from "@/lib/installation";
import { brandedHtml, OWNER_EMAIL, sendMail } from "@/lib/mail";
import { getSupabaseAdminClient } from "@/lib/supabase";

const REQUIRED: InstallationKey[] = ["restaurantName", "contactName", "mobile", "email", "restaurantPhone", "hours"];

/** Réception du formulaire d'installation : enregistrement, récapitulatif complet à Ligne, accusé au client. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const checkout = await paidCheckout(typeof body?.sessionId === "string" ? body.sessionId : null);
  if (!checkout) {
    return NextResponse.json({ error: "Abonnement introuvable. Utilisez le lien reçu par e-mail." }, { status: 403 });
  }

  const data = {} as Record<InstallationKey, string>;
  for (const [key] of INSTALLATION_FIELDS) {
    const value = body?.[key];
    data[key] = (Array.isArray(value) ? value.join(", ") : typeof value === "string" ? value : "").trim().slice(0, 8000);
  }
  const missing = REQUIRED.filter((k) => !data[k]);
  if (missing.length > 0) {
    return NextResponse.json({ error: "Merci de remplir les champs obligatoires.", missing }, { status: 400 });
  }
  if (!data.menuText && !data.menuLink) {
    return NextResponse.json({ error: "Ajoutez votre carte (texte ou lien).", missing: ["menuText"] }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { error } = await supabase.from("installations").upsert(
      {
        stripe_session_id: checkout.id,
        plan: checkout.plan,
        restaurant_name: data.restaurantName,
        contact_email: data.email,
        data,
      },
      { onConflict: "stripe_session_id" },
    );
    if (error) console.error("[installation] supabase:", error.message);
  }

  const lines = INSTALLATION_FIELDS.filter(([key]) => data[key]).map(([key, label]) => `${label} :\n${data[key]}`);
  await sendMail({
    to: OWNER_EMAIL(),
    replyTo: data.email,
    subject: `[LIGNE] Installation à faire — ${data.restaurantName} (${checkout.plan ?? "formule ?"})`,
    text: [
      `Nouveau formulaire d’installation (formule ${checkout.plan ?? "?"}).`,
      `Paiement Stripe : ${checkout.id}`,
      "",
      ...lines.flatMap((l) => [l, ""]),
      "À faire sous 24 h :",
      "1. Créer l’agent ElevenLabs avec la carte et les plats phares ci-dessus.",
      "2. Attribuer un numéro Twilio et l’envoyer au client pour le renvoi d’appel.",
      "3. Créer le restaurant + menu dans Supabase, le compte de connexion, puis npm run billing:link.",
      "4. Envoyer au client ses identifiants de l’espace restaurant.",
    ].join("\n"),
  });

  await sendMail({
    to: data.email,
    replyTo: OWNER_EMAIL(),
    subject: "Ligne : on a bien reçu vos informations",
    text: `Bonjour ${data.contactName},\n\nMerci, on a tout reçu pour ${data.restaurantName}. On configure votre agent sur votre carte. Sous 24 h, vous recevez votre numéro Ligne et vos accès à l’espace restaurant. Il vous restera seulement à activer le renvoi d’appel (le guide est sur la page de confirmation et dans le prochain e-mail).\n\nSofiane, fondateur de Ligne · 06 95 84 64 41`,
    html: brandedHtml({
      title: `C’est parti pour ${data.restaurantName} !`,
      paragraphs: [
        `Merci ${data.contactName}, on a bien reçu toutes vos informations.`,
        "On configure maintenant votre agent sur votre carte. Sous 24 h, vous recevez votre numéro Ligne et vos accès à l’espace restaurant.",
        "Il vous restera une seule chose à faire : activer le renvoi d’appel depuis votre téléphone. On vous guide pas à pas.",
      ],
    }),
  });

  return NextResponse.json({ ok: true });
}
