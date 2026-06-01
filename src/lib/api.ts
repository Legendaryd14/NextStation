export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
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

export const productsApi = {
  list: (params: Record<string, string | number | undefined>) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        search.set(key, String(value));
      }
    });
    const query = search.toString();
    return apiClient(`/api/products${query ? `?${query}` : ""}`);
  },
  get: (id: string) => apiClient(`/api/products/${id}`),
  create: (body: unknown) =>
    apiClient("/api/products", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: unknown) =>
    apiClient(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (id: string) =>
    apiClient(`/api/products/${id}`, { method: "DELETE" }),
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
    return apiClient(`/api/orders${query ? `?${query}` : ""}`);
  },
  create: (body: unknown) =>
    apiClient("/api/orders", { method: "POST", body: JSON.stringify(body) }),
  delete: (id: string) =>
    apiClient(`/api/orders/${id}`, { method: "DELETE" }),
  stats: () => apiClient("/api/orders/stats"),
};
