/** Envoi d'e-mails transactionnels via Resend (RESEND_API_KEY). Sans clé, l'envoi est ignoré. */
export const OWNER_EMAIL = () => process.env.CONTACT_EMAIL?.trim() || "Ligne.AI@outlook.com";

export async function sendMail({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;
  const from = process.env.RESEND_FROM_EMAIL?.trim() || "LIGNE <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      ...(html ? { html } : {}),
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  }).catch((e) => {
    console.error("[mail] resend:", e);
    return null;
  });
  return Boolean(res?.ok);
}

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Mise en page sobre aux couleurs de Ligne : titre, paragraphes, bouton optionnel. */
export function brandedHtml({ title, paragraphs, cta }: { title: string; paragraphs: string[]; cta?: { label: string; url: string } }) {
  return `<!doctype html><html><body style="margin:0;background:#ebe6de;font-family:Helvetica,Arial,sans-serif;color:#1a1816">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#f3f0ed;border-radius:20px;padding:36px">
<tr><td style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#5c2a36;font-weight:bold">Ligne</td></tr>
<tr><td style="padding-top:18px;font-size:26px;line-height:1.2;font-weight:600">${escape(title)}</td></tr>
${paragraphs.map((p) => `<tr><td style="padding-top:14px;font-size:15px;line-height:1.6;color:#3d3a35">${escape(p)}</td></tr>`).join("")}
${cta ? `<tr><td style="padding-top:26px"><a href="${cta.url}" style="display:inline-block;background:#5c2a36;color:#f2efe8;text-decoration:none;padding:14px 26px;border-radius:999px;font-size:15px;font-weight:600">${escape(cta.label)}</a></td></tr>` : ""}
<tr><td style="padding-top:30px;font-size:13px;color:#8a8175">Sofiane, fondateur de Ligne · 06 95 84 64 41 · ligne-ai.com</td></tr>
</table></td></tr></table></body></html>`;
}
