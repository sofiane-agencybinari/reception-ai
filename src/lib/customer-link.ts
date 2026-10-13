import { createHmac, timingSafeEqual } from "node:crypto";

import { getAppUrl } from "@/lib/app-url";

// Tant que CUSTOMER_LINK_SECRET n'est pas défini (après création de la table customer_profiles), aucun lien n'est envoyé.
const secret = () => process.env.CUSTOMER_LINK_SECRET?.trim() || "";

const sign = (orderId: string) => createHmac("sha256", secret()).update(`infos:${orderId}`).digest("base64url").slice(0, 22);

/** Lien personnel envoyé par SMS : seul le client qui a reçu le SMS peut compléter la fiche de sa commande. */
export function customerInfoUrl(orderId: string): string | null {
  if (!secret()) return null;
  return `${getAppUrl().replace(/\/$/, "")}/infos/${orderId}?s=${sign(orderId)}`;
}

export function isValidCustomerLink(orderId: string, signature: string | null | undefined): boolean {
  if (!secret() || !signature) return false;
  const a = Buffer.from(sign(orderId));
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
