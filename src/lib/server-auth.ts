import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const LOCAL_JWT_SECRET = process.env.LOCAL_JWT_SECRET ?? "your_secret";

export type AuthContext = {
  token: string | null;
  role: string | null;
  isAdmin: boolean;
};

export async function getAuthFromCookies(): Promise<AuthContext> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? null;
  let role = cookieStore.get("role")?.value?.toLowerCase() ?? null;

  const localToken = cookieStore.get("localToken")?.value;
  if (localToken) {
    try {
      const { payload } = await jwtVerify(
        localToken,
        new TextEncoder().encode(LOCAL_JWT_SECRET),
      );
      role = String(payload.role ?? role ?? "")
        .toLowerCase()
        .trim() || null;
    } catch {
      // Ignore invalid local tokens; route handlers will reject as needed.
    }
  }

  return {
    token,
    role,
    isAdmin: role === "admin",
  };
}

export async function requireAuth(): Promise<AuthContext | null> {
  const auth = await getAuthFromCookies();
  if (!auth.token) return null;
  return auth;
}

export async function requireAdmin(): Promise<AuthContext | null> {
  const auth = await getAuthFromCookies();
  if (!auth.token || !auth.isAdmin) return null;
  return auth;
}
