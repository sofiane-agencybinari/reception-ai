export type RestaurantAccount = {
  loginId: string;
  password: string;
  restaurantId: string;
  name: string;
  agentId: string;
};

const PILOTE_ID =
  process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID ??
  "11111111-1111-1111-1111-111111111111";

const EL_BAHJA_ID =
  process.env.NEXT_PUBLIC_ELBAHJA_RESTAURANT_ID ??
  "fe397713-e62b-40a5-a26f-e094c9034e44";

/**
 * Comptes cockpit (client-side, comme l'auth actuelle).
 * Chaque identifiant ouvre l'interface filtree sur son restaurant.
 */
export const RESTAURANT_ACCOUNTS: RestaurantAccount[] = [
  {
    loginId: process.env.NEXT_PUBLIC_APP_LOGIN_ID ?? "manager",
    password: process.env.NEXT_PUBLIC_APP_LOGIN_PASSWORD ?? "1234",
    restaurantId: PILOTE_ID,
    name: process.env.NEXT_PUBLIC_PILOTE_RESTAURANT_NAME ?? "Restaurant Pilote",
    agentId:
      process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ??
      "agent_1301khmc2x71e30anhrycs0cqhky",
  },
  {
    loginId: process.env.NEXT_PUBLIC_ELBAHJA_LOGIN_ID ?? "elbahja",
    password: process.env.NEXT_PUBLIC_ELBAHJA_LOGIN_PASSWORD ?? "bahja1234",
    restaurantId: EL_BAHJA_ID,
    name: process.env.NEXT_PUBLIC_ELBAHJA_RESTAURANT_NAME ?? "El Bahja",
    agentId:
      process.env.NEXT_PUBLIC_ELBAHJA_AGENT_ID ??
      "agent_6001m0jmjg8ye0rsrsqfwac6323e",
  },
];

export const AUTH_STORAGE_KEY = "reception_ai_authenticated";
export const RESTAURANT_SESSION_KEY = "reception_ai_restaurant";

export type RestaurantSession = {
  restaurantId: string;
  name: string;
  agentId: string;
  loginId: string;
};

export function findAccount(
  loginId: string,
  password: string,
): RestaurantAccount | undefined {
  const id = loginId.trim().toLowerCase();
  return RESTAURANT_ACCOUNTS.find(
    (account) =>
      account.loginId.toLowerCase() === id && account.password === password,
  );
}

export function toSession(account: RestaurantAccount): RestaurantSession {
  return {
    restaurantId: account.restaurantId,
    name: account.name,
    agentId: account.agentId,
    loginId: account.loginId,
  };
}

export function readRestaurantSession(): RestaurantSession | null {
  if (typeof window === "undefined") return null;
  const authenticated = window.sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
  if (!authenticated) return null;
  const raw = window.sessionStorage.getItem(RESTAURANT_SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as RestaurantSession;
    if (!parsed.restaurantId || !parsed.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeRestaurantSession(session: RestaurantSession) {
  window.sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
  window.sessionStorage.setItem(RESTAURANT_SESSION_KEY, JSON.stringify(session));
}

export function clearRestaurantSession() {
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(RESTAURANT_SESSION_KEY);
}
