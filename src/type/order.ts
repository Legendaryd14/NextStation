import type { ApiPaginatedResponse, ApiSingleResponse } from "./api";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cash" | "card" | "online";

export type ShippingAddress = {
  name: string;
  phone: string;
  address: string;
};

export type OrderUser = {
  _id: string;
  name: string;
  email: string;
};

export type OrderProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  brand: string;
  rating: number;
  numReviews: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type OrderItem = {
  _id: string;
  product: OrderProduct;
  name: string;
  quantity: number;
  price: number;
  image: string;
};

export type Order = {
  _id: string;
  user: OrderUser;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  status: OrderStatus;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type OrdersResponse = ApiPaginatedResponse<Order>;

export type OrderResponse = ApiSingleResponse<Order>;

export type CreateOrderItemInput = {
  product: string;
  quantity: number;
};

export type CreateShippingAddressInput = {
  name: string;
  phone: string;
  address: string;
};

export type CreateOrderInput = {
  orderItems: CreateOrderItemInput[];
  shippingAddress: CreateShippingAddressInput;
  paymentMethod: PaymentMethod;
};

export type CreateOrderResponse = ApiSingleResponse<Order>;

export type UpdateOrderStatusInput = {
  status: OrderStatus;
};

export type UpdateOrderStatusResponse = ApiSingleResponse<Order>;

export type UpdateOrderToPaidInput = {
  isPaid?: boolean;
};

export type UpdateOrderToPaidResponse = ApiSingleResponse<Order>;

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

export function mapBackendOrder(order: Order): DashboardOrder {
  const firstItem = order.orderItems?.[0];

  const productNames =
    order.orderItems?.length > 1
      ? `${firstItem?.name ?? "Unknown Product"} +${order.orderItems.length - 1} more`
      : (firstItem?.name ?? "Unknown Product");

  const totalQuantity =
    order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return {
    id: order._id,
    orderNumber: `#${order._id.slice(-6).toUpperCase()}`,
    customer:
      order.user?.name ?? order.shippingAddress?.name ?? "Unknown Customer",
    product: productNames,
    quantity: totalQuantity,
    total: order.totalPrice ?? 0,
    status: order.status,
    date: new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
}
