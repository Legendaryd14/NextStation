import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { requireAuth } from "@/lib/server-auth";

export async function GET() {
  const auth = await requireAuth();

  // اگر لاگین نبود، سبد خرید خالی برمی‌گردانیم (یا 401، بسته به نیاز شما)
  if (!auth) {
    return NextResponse.json({ success: true, data: { items: [] } });
  }

  try {
    const response = await backendFetch("/api/cart", {
      method: "GET",
      token: auth.token,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}
