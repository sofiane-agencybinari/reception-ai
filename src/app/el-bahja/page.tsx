import type { Metadata } from "next";

import { ElBahjaPublicPage } from "@/components/el-bahja/el-bahja-public-page";
import { EL_BAHJA, EL_BAHJA_RESTAURANT_ID } from "@/lib/el-bahja";
import { groupMenuItems, type MenuItemRow } from "@/lib/menu-categories";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `${EL_BAHJA.name} — Menu & Commandes | Montpellier`,
  description: `Commandez chez ${EL_BAHJA.name} : sandwichs, assiettes et formules. ${EL_BAHJA.address}, ${EL_BAHJA.city}. Tel. ${EL_BAHJA.phoneDisplay}.`,
  openGraph: {
    title: `${EL_BAHJA.name} — Menu & Commandes`,
    description: `${EL_BAHJA.tagline} · ${EL_BAHJA.city}`,
    type: "website",
  },
};

async function loadMenuItems(): Promise<{ items: MenuItemRow[]; error: string | null }> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return {
      items: [],
      error: "Menu temporairement indisponible. Appelez-nous pour connaitre la carte.",
    };
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("id, name, price, is_available")
    .eq("restaurant_id", EL_BAHJA_RESTAURANT_ID)
    .eq("is_available", true)
    .order("name", { ascending: true });

  if (error) {
    return {
      items: [],
      error: "Impossible de charger le menu. Appelez-nous pour passer commande.",
    };
  }

  return { items: (data ?? []) as MenuItemRow[], error: null };
}

export default async function ElBahjaPage() {
  const { items, error } = await loadMenuItems();
  const groupedMenu = groupMenuItems(items);

  return (
    <ElBahjaPublicPage groupedMenu={groupedMenu} itemCount={items.length} menuError={error} />
  );
}
