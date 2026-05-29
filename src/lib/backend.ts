export const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

type BackendFetchOptions = RequestInit & {
  token?: string | null;
};

export async function backendFetch(
  path: string,
  { token, headers, body, ...options }: BackendFetchOptions = {},
) {
  const requestHeaders = new Headers(headers);

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (body && !(body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  return fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: requestHeaders,
    body,
    cache: "no-store",
  });
}

export async function backendJson<T>(
  path: string,
  options: BackendFetchOptions = {},
): Promise<{ response: Response; data: T }> {
  const response = await backendFetch(path, options);
  const data = (await response.json().catch(() => ({}))) as T;
  return { response, data };
}
