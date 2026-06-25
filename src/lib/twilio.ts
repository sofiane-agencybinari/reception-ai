import { validateRequest } from "twilio";

type TwilioApiError = {
  code?: number;
  message?: string;
  more_info?: string;
  status?: number;
};

export function parseTwilioApiError(raw: string): string {
  try {
    const err = JSON.parse(raw) as TwilioApiError;
    if (err.code && err.message) {
      return `${err.code}: ${err.message}`;
    }
    if (err.message) return err.message;
  } catch {
    // not JSON
  }
  return raw.slice(0, 300);
}

export function validateTwilioWebhook(
  request: Request,
  params: Record<string, string>,
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  if (!authToken) return false;

  const signature = request.headers.get("x-twilio-signature") ?? "";
  return validateRequest(authToken, signature, request.url, params);
}
