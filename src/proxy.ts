import { jwtVerify } from "jose";
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
    "/Login",
    "/auth",
    "/login",
    "/api/auth/refresh-token",
    "/api/auth/login",
  ];

  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  const isAdminRoute = AdminRoutes.some((route) => path.startsWith(route));
  const isUserRoute = UserRoutes.some((route) => path.startsWith(route));
  const isProtected = isAdminRoute || isUserRoute;

  const localToken = req.cookies.get("localToken")?.value;

  if (isProtected && !localToken) {
    return redirectToLogin(isAdminRoute, req.url);
  }

  if (isProtected && localToken) {
    try {
      const secret = new TextEncoder().encode(process.env.LOCAL_JWT_SECRET);
      const { payload } = await jwtVerify(localToken, secret);
      const role = String(payload.role ?? "").toLowerCase();

      if (isAdminRoute && role !== "admin") {
        return NextResponse.redirect(new URL("/Login?status=login", req.url));
      }
      if (isUserRoute && !["user", "customer"].includes(role)) {
        return NextResponse.redirect(new URL("/auth?status=login", req.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Local token invalid:", error);
      return redirectToLogin(isAdminRoute, req.url);
    }
  }

  return NextResponse.next();
}

function redirectToLogin(isAdminRoute: boolean, currentUrl: string | URL) {
  const response = NextResponse.redirect(
    new URL(isAdminRoute ? "/Login?status=login" : "/auth?status=login", currentUrl),
  );
  response.cookies.delete("token");
  response.cookies.delete("refreshToken");
  response.cookies.delete("localToken");
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
