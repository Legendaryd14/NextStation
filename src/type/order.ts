export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  product?: { _id?: string; name?: string };
  name?: string;
  quantity?: number;
  price?: number;
  qty?: number;
};

export type BackendOrder = {
  _id: string;
  id?: number;
  orderNumber?: string;
  user?: { name?: string; email?: string; _id?: string };
  userName?: string;
  customer?: string;
  orderItems?: OrderItem[];
  items?: OrderItem[];
  totalPrice?: number;
  total?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type OrdersResponse = {
  success: boolean;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  totalPages?: number;
  data: BackendOrder[];
  message?: string;
};

export type OrderStatsResponse = {
  success: boolean;
  data?: {
    totalOrders?: number;
    totalRevenue?: number;
    activeOrders?: number;
    monthlySales?: Array<{ name: string; uv: number; pv: number }>;
  };
  message?: string;
};

export type DashboardOrder = {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  date: string;
};

export function normalizeOrderStatus(status?: string): OrderStatus {
  const value = (status ?? "Pending").toLowerCase();
  switch (value) {
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
}

export function mapBackendOrder(order: BackendOrder): DashboardOrder {
  const items = order.orderItems ?? order.items ?? [];
  const productLabel =
    items
      .map((item) => item.product?.name ?? item.name ?? "Product")
      .filter(Boolean)
      .join(", ") || "—";
  const quantity = items.reduce(
    (sum, item) => sum + (item.quantity ?? item.qty ?? 0),
    0,
  );
  ``;
  return {
    id: order._id,
    orderNumber: order.orderNumber ?? order._id.slice(-8).toUpperCase(),
    customer:
      order.user?.name ??
      order.user?.email ??
      order.userName ??
      order.customer ??
      "Unknown customer",
    product: productLabel,
    quantity: quantity || items.length,
    total: order.totalPrice ?? order.total ?? 0,
    status: normalizeOrderStatus(order.status),
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString()
      : "—",
  };
}
