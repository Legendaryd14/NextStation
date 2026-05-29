export const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

export const ADMIN_BASE_URL = `${BASE_URL}/admin`;
