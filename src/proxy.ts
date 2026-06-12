import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  const isAdminRoute = pathname.startsWith("/dashboard");

  const isUserRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout");

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/auth");

  /*
   * اگر لاگین کرده و دوباره وارد صفحه لاگین شد
   */
  if (isAuthRoute && token) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.redirect(new URL("/", req.url));
  }

  /*
   * مسیرهای ادمین
   */
  if (isAdminRoute) {
    if (!token) {
      return redirectToLogin(req, true);
    }

    if (role !== "admin") {
      return redirectToLogin(req, true);
    }
  }

  /*
   * مسیرهای کاربر
   */
  if (isUserRoute) {
    if (!token) {
      return redirectToLogin(req, false);
    }
  }

  return NextResponse.next();
}

function redirectToLogin(req: NextRequest, adminRoute: boolean) {
  const loginUrl = new URL(adminRoute ? "/auth" : "/auth", req.url);

  loginUrl.searchParams.set(
    "callbackUrl",
    `${req.nextUrl.pathname}${req.nextUrl.search}`,
  );

  const response = NextResponse.redirect(loginUrl);

  response.cookies.delete("token");
  response.cookies.delete("refreshToken");
  response.cookies.delete("role");
  response.cookies.delete("user");

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/login",
    "/auth",
  ],
};
