import type { Order } from "@/lib/types";

export type CustomerOrderSummary = {
  id: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  itemsLabel: string;
};

export type CustomerProfile = {
  phone: string;
  name: string;
  orderCount: number;
  lastOrderAt: string | null;
  orders: CustomerOrderSummary[];
};

function itemsLabel(order: Order): string {
  return order.order_items
    .map((item) => `${item.quantity}x ${item.item_name}`)
    .join("; ");
}

export function buildCustomerProfiles(orders: Order[]): CustomerProfile[] {
  const byPhone = new Map<string, Order[]>();

  for (const order of orders) {
    const phone = order.customer_phone.trim();
    if (!phone) continue;
    const list = byPhone.get(phone) ?? [];
    list.push(order);
    byPhone.set(phone, list);
  }

  const profiles: CustomerProfile[] = [];

  for (const [phone, group] of byPhone) {
    const sorted = [...group].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    let name = "Non renseigne";
    for (const o of sorted) {
      if (o.customer_name && o.customer_name.trim()) {
        name = o.customer_name.trim();
        break;
      }
    }

    const summaries: CustomerOrderSummary[] = sorted.map((o) => ({
      id: o.id,
      createdAt: o.created_at,
      status: o.status,
      totalAmount: Number(o.total_amount),
      itemsLabel: itemsLabel(o),
    }));

    profiles.push({
      phone,
      name,
      orderCount: summaries.length,
      lastOrderAt: sorted[0]?.created_at ?? null,
      orders: summaries,
    });
  }

  return profiles.sort((a, b) => {
    const ta = a.lastOrderAt ? new Date(a.lastOrderAt).getTime() : 0;
    const tb = b.lastOrderAt ? new Date(b.lastOrderAt).getTime() : 0;
    return tb - ta;
  });
}

export function customersToCsvRows(profiles: CustomerProfile[]): string[][] {
  const rows: string[][] = [
    ["telephone", "nom", "date_commande", "id_commande", "produits", "total_eur", "statut"],
  ];

  for (const c of profiles) {
    for (const o of c.orders) {
      rows.push([
        c.phone,
        c.name,
        new Date(o.createdAt).toISOString(),
        o.id,
        o.itemsLabel,
        o.totalAmount.toFixed(2),
        o.status,
      ]);
    }
  }

  return rows;
}
