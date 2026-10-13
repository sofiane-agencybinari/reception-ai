/**
 * Session restaurant côté navigateur. La vérification du mot de passe et la session (cookie signé)
 * sont gérées par le serveur : voir src/lib/server-auth.ts et /api/auth/*.
 */
export type RestaurantSession = {
  restaurantId: string;
  name: string;
  agentId: string;
  loginId: string;
};

export async function fetchRestaurantSession(): Promise<RestaurantSession | null> {
  const res = await fetch("/api/auth/session", { cache: "no-store" }).catch(() => null);
  if (!res?.ok) return null;
  const data = (await res.json()) as { session: RestaurantSession | null };
  return data.session;
}

export async function signIn(loginId: string, password: string): Promise<boolean> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginId, password }),
  }).catch(() => null);
  return Boolean(res?.ok);
}

export async function signOut() {
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
}
