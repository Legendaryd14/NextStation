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

  const limit = 100;
  let page = 1;
  let allOrders: any[] = [];

  while (true) {
    const response = await backendFetch(
      `/api/orders/admin/all?page=${page}&limit=${limit}`,
      { token: auth.token },
    );
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    const orders = Array.isArray(result.data) ? result.data : [];
    allOrders = [...allOrders, ...orders];

    const pages = typeof result.pages === "number" ? result.pages : 1;
    if (page >= pages) break;
    page += 1;
  }

  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce(
    (sum, order) => sum + (order.totalPrice ?? order.total ?? 0),
    0,
  );
  const activeOrders = allOrders.filter(
    (order) =>
      !["delivered", "cancelled"].includes(
        String(order.status ?? "").toLowerCase(),
      ),
  ).length;

  const monthlyMap = new Map<
    number,
    { name: string; uv: number; pv: number }
  >();

  allOrders.forEach((order) => {
    const createdAt = order.createdAt ? new Date(order.createdAt) : null;
    if (!createdAt || Number.isNaN(createdAt.getTime())) return;

    const month = createdAt.getMonth();
    const monthName = createdAt.toLocaleString("default", { month: "short" });
    const total = Number(order.totalPrice ?? order.total ?? 0) || 0;

    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { name: monthName, uv: total, pv: 1 });
    } else {
      const item = monthlyMap.get(month)!;
      item.uv += total;
      item.pv += 1;
    }
  });

  const monthlySales = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([, value]) => value);

  return NextResponse.json(
    {
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        activeOrders,
        monthlySales,
      },
    },
    { status: 200 },
  );
}
