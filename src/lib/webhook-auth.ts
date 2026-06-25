export function isWebhookAuthorized(request: Request): boolean {
  const secret = process.env.ORDERS_WEBHOOK_SECRET?.trim();
  if (!secret) return true;

  const headerSecret =
    request.headers.get("x-webhook-secret") ??
    request.headers.get("x-api-key") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return headerSecret === secret;
}
