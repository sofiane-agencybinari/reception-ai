export type OrderStatus =
  | "new"
  | "accepted"
  | "preparing"
  | "ready"
  | "picked_up"
  | "cancelled";

export type OrderItem = {
  id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type Order = {
  id: string;
  restaurant_id: string;
  customer_phone: string;
  customer_name: string | null;
  pickup_time: string | null;
  notes: string | null;
  source: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
};

export type DashboardMetrics = {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  avgTicket: number;
};
