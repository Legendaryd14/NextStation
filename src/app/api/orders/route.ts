import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { requireAdmin, requireAuth } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Admin access required" },
      { status: 403 },
    );
  }

  const search = req.nextUrl.searchParams.toString();
  const path = search
    ? `/api/orders/admin/all?${search}`
    : "/api/orders/admin/all";

  const response = await backendFetch(path, { token: auth.token });
  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Login required" },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { success: false, message: "Invalid order payload" },
      { status: 400 },
    );
  }

  const response = await backendFetch("/api/orders", {
    method: "POST",
    token: auth.token,
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}
