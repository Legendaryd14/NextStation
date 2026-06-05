import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-auth";
import { backendFetch } from "@/lib/backend";
import { BASE_URL } from "@/app/base";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.toString();
  const path = search
    ? `${BASE_URL}/products?${search}`
    : `${BASE_URL}/products`;

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

  const contentType = req.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await req.formData()
    : await req.text();

  const response = await backendFetch(`${BASE_URL}/products`, {
    method: "POST",
    token: auth.token,
    body,
  });
  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}
