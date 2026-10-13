import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Connexion à la caisse du restaurant via HubRise (https://www.hubrise.com/developers/api).
 * - pushOrderToHubrise : envoie une commande prise au téléphone ; la caisse la reçoit et imprime le ticket cuisine.
 * - countOpenHubriseOrders : commandes en cours des autres canaux (comptoir, web…), pour le temps d'attente.
 * Tout est facultatif : sans connexion HubRise, ou si HubRise ne répond pas vite, Ligne fonctionne comme avant.
 */
const API = "https://api.hubrise.com/v1";
const TIMEOUT_MS = 2500;
const OPEN_STATUSES = ["new", "received", "accepted", "in_preparation"];
/** Préfixe des commandes créées par Ligne, pour ne pas les compter deux fois. */
const REF_PREFIX = "ligne:";

type Connection = { locationId: string; token: string };

export async function getHubriseConnection(supabase: SupabaseClient, restaurantId: string): Promise<Connection | null> {
  const { data } = await supabase
    .from("restaurant_integrations")
    .select("hubrise_location_id, hubrise_access_token")
    .eq("restaurant_id", restaurantId)
    .maybeSingle();
  if (!data?.hubrise_location_id || !data.hubrise_access_token) return null;
  return { locationId: data.hubrise_location_id, token: data.hubrise_access_token };
}

async function hubrise(conn: Connection, method: string, path: string, body?: unknown) {
  const res = await fetch(`${API}/locations/${conn.locationId}${path}`, {
    method,
    headers: { "X-Access-Token": conn.token, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HubRise ${method} ${path} → ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

const money = (amount: number) => `${amount.toFixed(2)} EUR`;

export type HubriseOrderInput = {
  orderId: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  customerName?: string | null;
  customerPhone: string;
  notes?: string | null;
  readyAt: Date;
};

export async function pushOrderToHubrise(conn: Connection, order: HubriseOrderInput): Promise<string> {
  const created = (await hubrise(conn, "POST", "/orders", {
    private_ref: `${REF_PREFIX}${order.orderId}`,
    status: "new",
    // Le mode est noté par l'agent dans les notes (« livraison » ou « emporter »).
    service_type: /livraison/i.test(order.notes ?? "") ? "delivery" : "collection",
    expected_time: order.readyAt.toISOString(),
    customer_notes: order.notes ?? undefined,
    customer: { first_name: order.customerName ?? undefined, phone: order.customerPhone },
    items: order.items.map((item) => ({
      product_name: item.name,
      price: money(item.unitPrice),
      quantity: String(item.quantity),
    })),
  })) as { id: string };
  return created.id;
}

/** Nombre de commandes en cours dans la caisse (hors commandes Ligne). Null si indisponible. */
export async function countOpenHubriseOrders(conn: Connection): Promise<number | null> {
  try {
    const after = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    const orders = (await hubrise(conn, "GET", `/orders?after=${encodeURIComponent(after)}&count=100`)) as {
      status: string;
      private_ref?: string | null;
    }[];
    return orders.filter((o) => OPEN_STATUSES.includes(o.status) && !o.private_ref?.startsWith(REF_PREFIX)).length;
  } catch (err) {
    console.error("[hubrise] lecture des commandes impossible", err);
    return null;
  }
}
