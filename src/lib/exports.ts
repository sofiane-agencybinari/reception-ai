import type { Order } from "@/lib/types";

export function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCsv(rows: string[][], filename: string) {
  const body = rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
  const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export type ProductSalesRow = {
  name: string;
  quantity: number;
  revenue: number;
};

export function buildProductSalesRows(orders: Order[]): ProductSalesRow[] {
  const map = new Map<string, { quantity: number; revenue: number }>();
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    for (const item of order.order_items) {
      const prev = map.get(item.item_name) ?? { quantity: 0, revenue: 0 };
      map.set(item.item_name, {
        quantity: prev.quantity + item.quantity,
        revenue: prev.revenue + Number(item.line_total),
      });
    }
  }
  return [...map.entries()]
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function productSalesToCsv(
  products: ProductSalesRow[],
  periodLabel: string,
  totalRevenue: number,
): string[][] {
  const rows: string[][] = [
    ["Rapport ASTOR - Ventes produits"],
    ["Periode", periodLabel],
    ["CA total EUR", totalRevenue.toFixed(2)],
    [],
    ["Produit", "Quantite", "CA EUR"],
  ];
  for (const p of products) {
    rows.push([p.name, String(p.quantity), p.revenue.toFixed(2)]);
  }
  return rows;
}

export function ordersToCsv(orders: Order[]): string[][] {
  const rows: string[][] = [
    [
      "ID",
      "Date",
      "Telephone",
      "Client",
      "Statut",
      "Produits",
      "Total EUR",
      "Source",
    ],
  ];
  for (const order of orders) {
    rows.push([
      order.id,
      order.created_at,
      order.customer_phone,
      order.customer_name ?? "",
      order.status,
      order.order_items.map((i) => `${i.quantity}x ${i.item_name}`).join("; "),
      Number(order.total_amount).toFixed(2),
      order.source,
    ]);
  }
  return rows;
}

export function filterOrdersByDays(orders: Order[], days: number): Order[] {
  const periodStart = Date.now() - (days - 1) * 24 * 60 * 60 * 1000;
  return orders.filter((o) => new Date(o.created_at).getTime() >= periodStart);
}

export function sumRevenue(orders: Order[]): number {
  return orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);
}
