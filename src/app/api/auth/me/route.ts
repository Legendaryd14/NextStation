import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { requireAuth } from "@/lib/server-auth";

const LOCAL_JWT_SECRET = process.env.LOCAL_JWT_SECRET ?? "your_secret";

type LocalUserClaims = {
  userId?: unknown;
  email?: unknown;
  role?: unknown;
};

export async function GET() {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Login required" },
      { status: 401 },
    );
  }

  const profilePaths = ["/api/auth/me", "/api/users/profile", "/api/users/me"];

  for (const path of profilePaths) {
    const response = await backendFetch(path, { token: auth.token }).catch(
      () => null,
    );
    if (!response) continue;

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
  }

  const cookieStore = await cookies();
  const localToken = cookieStore.get("localToken")?.value;
  const fallbackUser: LocalUserClaims = {};

  if (localToken) {
    try {
      const { payload } = await jwtVerify(
        localToken,
        new TextEncoder().encode(LOCAL_JWT_SECRET),
      );
      fallbackUser.userId = payload.userId;
      fallbackUser.email = payload.email;
      fallbackUser.role = payload.role;
    } catch {
      // The auth cookie was already verified by requireAuth; this fallback is best effort.
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      user: fallbackUser,
    },
    message: "Profile fallback returned because backend profile endpoint was unavailable.",
  });
}
