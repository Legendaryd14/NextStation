import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { requireAuth } from "@/lib/server-auth";

type RouteContext = {
  params: Promise<{ itemId: string }>;
};

export async function DELETE(_req: Request, context: RouteContext) {
  const auth = await requireAuth();

  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Login required" },
      { status: 401 },
    );
  }

  const { itemId } = await context.params;

  const response = await backendFetch(`/api/cart/remove/${itemId}`, {
    method: "DELETE",
    token: auth.token,
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
