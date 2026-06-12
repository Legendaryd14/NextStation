import { useApi } from "@/hooks/useAPI";
import { buildQuery } from "@/lib/api-utils";
import { Product } from "@/type/product";

export type ProductListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  rating?: number;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  sort?: string;
};

export type ProductListResponse = {
  success: boolean;
  message: string;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Product[];
};

export type ProductResponse = {
  success: boolean;
  message?: string;
  data: Product;
};

export type CreateProductPayload = {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  brand?: string;
  rating?: number;
  numReviews?: number;
  isActive?: boolean;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export function useProductsApi() {
  const api = useApi();

  const list = (params: ProductListParams = {}) =>
    api.get<ProductListResponse>(`/products${buildQuery(params)}`);

  const getById = (id: string) => api.get<ProductResponse>(`/products/${id}`);

  const create = (payload: CreateProductPayload | FormData) =>
    api.post<ProductResponse>("/products", payload);

  const update = (id: string, payload: UpdateProductPayload | FormData) =>
    api.put<ProductResponse>(`/products/${id}`, payload);

  const remove = (id: string) =>
    api.delete<{
      success: boolean;
      message: string;
    }>(`/products/${id}`);

  return {
    ...api,
    list,
    getById,
    create,
    update,
    remove,
  };
}
