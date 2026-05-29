import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { requireAdmin } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.toString();
  const path = search ? `/api/products?${search}` : "/api/products";

  const response = await backendFetch(path);
  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Admin access required" },
      { status: 403 },
    );
  }

  const body = await req.text();
  const response = await backendFetch("/api/products", {
    method: "POST",
    token: auth.token,
    body,
  });
  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}
