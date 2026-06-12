export const useApi = () => {
  const baseURL = "http://localhost:5000/api";

  const fetchApi = async <T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<{
    ok: boolean;
    status: number;
    data?: T;
  }> => {
    try {
      const isFormData = options?.body instanceof FormData;

      const response = await fetch(`${baseURL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(options?.headers || {}),
        },
      });

      const text = await response.text();

      let data;

      try {
        data = text ? JSON.parse(text) : undefined;
      } catch {
        data = undefined;
      }

      return {
        ok: response.ok,
        status: response.status,
        data,
      };
    } catch (error) {
      console.error(error);

      return {
        ok: false,
        status: 500,
      };
    }
  };

  const normalizeBody = (body?: unknown) => {
    if (!body) return undefined;

    if (body instanceof FormData) {
      return body;
    }

    return JSON.stringify(body);
  };

  return {
    get: <T>(endpoint: string) =>
      fetchApi<T>(endpoint, {
        method: "GET",
      }),

    post: <T>(endpoint: string, body?: unknown) =>
      fetchApi<T>(endpoint, {
        method: "POST",
        body: normalizeBody(body),
      }),

    put: <T>(endpoint: string, body?: unknown) =>
      fetchApi<T>(endpoint, {
        method: "PUT",
        body: normalizeBody(body),
      }),

    patch: <T>(endpoint: string, body?: unknown) =>
      fetchApi<T>(endpoint, {
        method: "PATCH",
        body: normalizeBody(body),
      }),

    delete: <T>(endpoint: string) =>
      fetchApi<T>(endpoint, {
        method: "DELETE",
      }),
  };
};
