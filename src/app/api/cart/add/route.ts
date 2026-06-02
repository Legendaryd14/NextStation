import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { requireAuth } from "@/lib/server-auth";

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
      { success: false, message: "Invalid cart payload" },
      { status: 400 },
    );
  }

  const response = await backendFetch("/api/cart/add", {
    method: "POST",
    token: auth.token,
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}
