import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { requireAdmin } from "@/lib/server-auth";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Admin access required" },
      { status: 403 },
    );
  }

  const response = await backendFetch("/api/orders/stats", {
    token: auth.token,
  });
  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}
