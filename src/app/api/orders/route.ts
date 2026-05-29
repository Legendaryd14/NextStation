import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { requireAdmin } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Admin access required" },
      { status: 403 },
    );
  }

  const search = req.nextUrl.searchParams.toString();
  const path = search ? `/api/orders?${search}` : "/api/orders";

  const response = await backendFetch(path, { token: auth.token });
  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}
