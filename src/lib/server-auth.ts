import { createHash, createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { RestaurantSession } from "@/lib/auth-accounts";

/**
 * Connexion des restaurants, vérifiée côté serveur (les mots de passe ne sont jamais envoyés au navigateur).
 *
 * Comptes : variable RESTAURANT_ACCOUNTS (JSON), un objet par restaurant :
 *   { "loginId": "elbahja", "password": "scrypt:<sel>:<empreinte>", "restaurantId": "…", "name": "El Bahja", "agentId": "agent_…" }
 * Empreinte d'un mot de passe : node scripts/hash-password.mjs "<mot de passe>".
 * Sans RESTAURANT_ACCOUNTS, les comptes historiques (variables *_LOGIN_*) restent valables, côté serveur uniquement.
 */
type Account = RestaurantSession & { password: string };

const SESSION_COOKIE = "ligne_session";
const SESSION_DAYS = 30;

function legacyAccounts(): Account[] {
  return [
    {
      loginId: process.env.NEXT_PUBLIC_APP_LOGIN_ID ?? "manager",
      password: process.env.NEXT_PUBLIC_APP_LOGIN_PASSWORD ?? "1234",
      restaurantId: process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID ?? "11111111-1111-1111-1111-111111111111",
      name: process.env.NEXT_PUBLIC_PILOTE_RESTAURANT_NAME ?? "Restaurant Pilote",
      agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? "agent_1301khmc2x71e30anhrycs0cqhky",
    },
    {
      loginId: process.env.NEXT_PUBLIC_ELBAHJA_LOGIN_ID ?? "elbahja",
      password: process.env.NEXT_PUBLIC_ELBAHJA_LOGIN_PASSWORD ?? "bahja1234",
      restaurantId: process.env.NEXT_PUBLIC_ELBAHJA_RESTAURANT_ID ?? "fe397713-e62b-40a5-a26f-e094c9034e44",
      name: process.env.NEXT_PUBLIC_ELBAHJA_RESTAURANT_NAME ?? "El Bahja",
      agentId: process.env.NEXT_PUBLIC_ELBAHJA_AGENT_ID ?? "agent_6001m0jmjg8ye0rsrsqfwac6323e",
    },
  ];
}

function accounts(): Account[] {
  const raw = process.env.RESTAURANT_ACCOUNTS?.trim();
  if (!raw) return legacyAccounts();
  try {
    return JSON.parse(raw) as Account[];
  } catch {
    console.error("[auth] RESTAURANT_ACCOUNTS n'est pas un JSON valide");
    return [];
  }
}

const same = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);

/** Accepte une empreinte « scrypt:<sel>:<empreinte> » ou, pour les anciens comptes, un mot de passe en clair. */
function passwordMatches(stored: string, given: string): boolean {
  if (stored.startsWith("scrypt:")) {
    const [, salt, hash] = stored.split(":");
    return same(scryptSync(given, salt, 32), Buffer.from(hash, "hex"));
  }
  return same(Buffer.from(stored), Buffer.from(given));
}

export function findAccount(loginId: string, password: string): RestaurantSession | null {
  const id = loginId.trim().toLowerCase();
  const account = accounts().find((a) => a.loginId.toLowerCase() === id);
  if (!account || !passwordMatches(account.password, password)) return null;
  return { loginId: account.loginId, restaurantId: account.restaurantId, name: account.name, agentId: account.agentId };
}

/** Clé de signature des sessions : SESSION_SECRET, à défaut dérivée de la clé serveur Supabase (jamais publique). */
function signingKey(): string {
  const secret = process.env.SESSION_SECRET?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!secret) throw new Error("SESSION_SECRET manquant");
  return createHash("sha256").update(`ligne-session:${secret}`).digest("hex");
}

const sign = (payload: string) => createHmac("sha256", signingKey()).update(payload).digest("base64url");

export async function startSession(session: RestaurantSession) {
  const payload = Buffer.from(JSON.stringify({ ...session, exp: Date.now() + SESSION_DAYS * 86400000 })).toString("base64url");
  (await cookies()).set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession(): Promise<RestaurantSession | null> {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  const [payload, signature] = value?.split(".") ?? [];
  if (!payload || !signature || !same(Buffer.from(sign(payload)), Buffer.from(signature))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as RestaurantSession & { exp: number };
    if (data.exp < Date.now()) return null;
    return { loginId: data.loginId, restaurantId: data.restaurantId, name: data.name, agentId: data.agentId };
  } catch {
    return null;
  }
}

/**
 * À appeler en tête de chaque route de données : renvoie le restaurant connecté, ou une réponse 401.
 * Le restaurant vient toujours de la session, jamais du paramètre envoyé par le navigateur.
 */
export async function requireRestaurant(): Promise<{ restaurantId: string } | { error: NextResponse }> {
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: "Non connecté" }, { status: 401 }) };
  return { restaurantId: session.restaurantId };
}
