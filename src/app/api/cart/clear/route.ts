import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { requireAuth } from "@/lib/server-auth";

export async function DELETE() {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Login required" },
      { status: 401 },
    );
  }

  const response = await backendFetch("/api/cart/clear", {
    method: "DELETE",
    token: auth.token,
  });
  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}
