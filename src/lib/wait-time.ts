import type { SupabaseClient } from "@supabase/supabase-js";

import { countOpenHubriseOrders, getHubriseConnection } from "@/lib/hubrise";

/** Commandes encore en cuisine : chacune rallonge l'attente de la suivante. */
const OPEN_STATUSES = ["new", "accepted", "preparing"];

const env = (name: string, fallback: number) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

/**
 * Heure de retrait estimée selon la charge de la cuisine :
 * temps de base + quelques minutes par commande encore en préparation, arrondi aux 5 minutes, plafonné.
 * Si le client a demandé une heure plus tardive, c'est elle qui compte.
 * Si le restaurant est relié à sa caisse (HubRise), les commandes en cours des autres canaux comptent aussi.
 */
export async function estimateReadyAt(supabase: SupabaseClient, restaurantId: string, requestedPickup: string | null) {
  const base = env("ORDER_PREP_MINUTES", 20);
  const perOpenOrder = env("ORDER_PREP_PER_OPEN_ORDER_MINUTES", 4);
  const max = env("ORDER_PREP_MAX_MINUTES", 75);

  const since = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId)
    .in("status", OPEN_STATUSES)
    .gte("created_at", since);

  const hubrise = await getHubriseConnection(supabase, restaurantId);
  const otherChannels = hubrise ? ((await countOpenHubriseOrders(hubrise)) ?? 0) : 0;

  const openOrders = (count ?? 0) + otherChannels;
  const minutes = Math.min(max, Math.ceil((base + openOrders * perOpenOrder) / 5) * 5);
  const estimate = new Date(Date.now() + minutes * 60 * 1000);

  const requested = requestedPickup ? new Date(requestedPickup) : null;
  const readyAt = requested && requested > estimate ? requested : estimate;
  return { readyAt, waitMinutes: Math.round((readyAt.getTime() - Date.now()) / 60000), openOrders };
}
