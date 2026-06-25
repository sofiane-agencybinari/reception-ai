export type MenuCategory = "menus" | "boissons" | "sauces" | "autres";

export type MenuItemRow = {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
};

export const CATEGORY_TITLES: Record<MenuCategory, string> = {
  menus: "Menus",
  boissons: "Boissons",
  sauces: "Sauces",
  autres: "Autres",
};

export const CATEGORY_ORDER: MenuCategory[] = ["menus", "boissons", "sauces", "autres"];

export function detectMenuCategory(name: string): MenuCategory {
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Sauces et boissons avant menus : evite "Sauce burger" → menus.
  if (
    normalized.includes("sauce") ||
    normalized.includes("ketchup") ||
    normalized.includes("mayo") ||
    normalized.includes("mayonnaise") ||
    normalized.includes("harissa")
  ) {
    return "sauces";
  }

  if (
    normalized.includes("boisson") ||
    normalized.includes("coca") ||
    normalized.includes("sprite") ||
    normalized.includes("fanta") ||
    normalized.includes("eau") ||
    normalized.includes("jus")
  ) {
    return "boissons";
  }

  if (
    normalized.includes("menu") ||
    normalized.includes("burger") ||
    normalized.includes("tacos") ||
    normalized.includes("sandwich")
  ) {
    return "menus";
  }

  return "autres";
}

export function groupMenuItems(items: MenuItemRow[]): Record<MenuCategory, MenuItemRow[]> {
  const groups: Record<MenuCategory, MenuItemRow[]> = {
    menus: [],
    boissons: [],
    sauces: [],
    autres: [],
  };

  const sorted = [...items].sort((a, b) =>
    a.name.localeCompare(b.name, "fr", { sensitivity: "base", numeric: true }),
  );

  for (const item of sorted) {
    groups[detectMenuCategory(item.name)].push(item);
  }

  return groups;
}

export function formatMenuPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}
