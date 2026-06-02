import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { requireAdmin } from "@/lib/server-auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const response = await backendFetch(`/api/products/${id}`);
  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Admin access required" },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  const contentType = req.headers.get("content-type") ?? "";
  const body = contentType.includes("multipart/form-data")
    ? await req.formData()
    : await req.text();

  const response = await backendFetch(`/api/products/${id}`, {
    method: "PUT",
    token: auth.token,
    body,
  });
  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Admin access required" },
      { status: 403 },
    );
  }

  const { id } = await context.params;

  const response = await backendFetch(`/api/products/${id}`, {
    method: "DELETE",
    token: auth.token,
  });
  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}
