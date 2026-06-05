import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const AdminRoutes = [
    "/dashboard",
    "/dashboard/orders",
    "/dashboard/products",
    "/dashboard/stock",
  ];
  const UserRoutes = ["/profile", "/cart", "/checkout"];
  const publicRoutes = [
    "/login",
    "/auth",
    "/api/auth/refresh-token",
    "/api/auth/login",
    "/api/auth/refreshToken",
  ];

  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  const isAdminRoute = AdminRoutes.some((route) => path.startsWith(route));
  const isUserRoute = UserRoutes.some((route) => path.startsWith(route));
  const isProtected = isAdminRoute || isUserRoute;

  const token = req.cookies.get("token")?.value;

  if (isProtected && !token) {
    return redirectToLogin(isAdminRoute, req.url);
  }

  if (isProtected && token) {
    const role = req.cookies.get("role")?.value?.toLowerCase();

    if (isAdminRoute && role !== "admin") {
      return redirectToLogin(isAdminRoute, req.url);
    }
    if (isUserRoute && !["user", "customer"].includes(role ?? "")) {
      return redirectToLogin(isAdminRoute, req.url);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

function redirectToLogin(isAdminRoute: boolean, currentUrl: string | URL) {
  const url = new URL(currentUrl);
  const loginUrl = new URL(isAdminRoute ? "/login" : "/auth", currentUrl);

  if (!isAdminRoute) {
    loginUrl.searchParams.set("status", "login");
  }
  loginUrl.searchParams.set("redirect", `${url.pathname}${url.search}`);

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete("token");
  response.cookies.delete("refreshToken");

  response.cookies.delete("role");
  return response;
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/profile/:path*",
    "/cart",
    "/checkout",
  ],
};
