import { createHmac, timingSafeEqual } from "node:crypto";

const TOLERANCE_SECS = 30 * 60;

/**
 * Vérifie l'en-tête ElevenLabs-Signature (« t=<horodatage>,v0=<hmac> ») d'un webhook ElevenLabs :
 * HMAC-SHA256 du corps brut préfixé par l'horodatage, avec le secret du webhook. Rejette au-delà de 30 min.
 */
export function verifyElevenLabsSignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=", 2) as [string, string]));
  const timestamp = Number(parts.t);
  if (!parts.v0 || !Number.isFinite(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > TOLERANCE_SECS) return false;

  const expected = createHmac("sha256", secret).update(`${parts.t}.${rawBody}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(parts.v0);
  return a.length === b.length && timingSafeEqual(a, b);
}
