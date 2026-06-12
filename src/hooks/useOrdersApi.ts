import { useApi } from "@/hooks/useAPI";
import { buildQuery } from "@/lib/api-utils";
import type { Order, OrdersResponse, OrderResponse } from "@/type/order";

export type AdminOrdersParams = {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
  search?: string;
};

export function useOrdersApi() {
  const api = useApi();

  const getAllOrders = (params: AdminOrdersParams = {}) =>
    api.get<OrdersResponse>(`/orders/admin/all?${buildQuery(params)}`);

  const getById = (id: string) => api.get<OrderResponse>(`/orders/${id}`);

  const updateStatus = (id: string, status: string) =>
    api.put<OrderResponse>(`/orders/${id}/status`, { status });

  return { ...api, getAllOrders, getById, updateStatus };
}
