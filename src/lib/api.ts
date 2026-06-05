import { BASE_URL } from "@/app/base";
import { SingelProduct } from "@/type/product";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;

    // این خط را اضافه کنید تا زنجیره پروتوتایپ اصلاح شود
    Object.setPrototypeOf(this, ApiError.prototype);

    // اختیاری: تنظیم نام کلاس برای لاگ‌های بهتر
    this.name = "ApiError";
  }
}
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(endpoint, {
    ...options,
    credentials: "include",
    headers,
  });

  const data = (await response.json().catch(() => ({}))) as T & {
    message?: string;
  };

  if (!response.ok) {
    throw new ApiError(
      data.message ?? `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return data;
}

export const getProductByID = async (id: string): Promise<SingelProduct> => {
  const res = await fetch(`${BASE_URL}/products/${id}`);

  if (!res.ok) {
    throw new Error("Failed to Fetch Your Product");
  }

  return await res.json();
};

export const productsApi = {
  get: (id: string) => apiClient(`${BASE_URL}/products/${id}`),
  create: (body: BodyInit | Record<string, any> | FormData) =>
    apiClient(`${BASE_URL}/products`, {
      method: "POST",
      body: body as BodyInit,
    }),

  update: (id: string, body: BodyInit | Record<string, any> | FormData) =>
    apiClient(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      body: body as BodyInit,
    }),
  delete: (id: string) =>
    apiClient(`${BASE_URL}/products/${id}`, { method: "DELETE" }),
};

export const ordersApi = {
  list: (params: Record<string, string | number | undefined> = {}) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        search.set(key, String(value));
      }
    });
    const query = search.toString();
    return apiClient(`${BASE_URL}/orders${query ? `?${query}` : ""}`, {
      method: "GET",
      credentials: "include",
    });
  },
  create: (body: unknown) =>
    apiClient(`${BASE_URL}/orders`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  delete: (id: string) =>
    apiClient(`${BASE_URL}/orders/${id}`, {
      method: "DELETE",
      credentials: "include",
    }),
  stats: (id: string) =>
    apiClient(`${BASE_URL}/orders/${id}/status`, {
      method: "PUT",
      credentials: "include",
    }),
};
