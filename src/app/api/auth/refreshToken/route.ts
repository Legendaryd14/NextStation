import { NextRequest, NextResponse } from "next/server";

import { BASE_URL } from "@/app/base";

type RefreshRes = {
  success: boolean;
  message: string;
  data?: {
    token: string;
    refreshToken?: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh Token is ExpiredW " },
        { status: 400 },
      );
    }

    const backendUrl = BASE_URL;
    const refreshRes = await fetch(`${backendUrl}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const res: RefreshRes = await refreshRes.json();
    if (!refreshRes.ok || !res.success || !res.data?.token) {
      return NextResponse.json(
        { success: false, message: res.message || "Refresh Error" },
        { status: 401 },
      );
    }

    const newToken = res.data.token;

    const userRes = await fetch(`${backendUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${newToken}` },
    });
    const userData = await userRes.json();
    if (!userRes.ok || !userData.success) {
      return NextResponse.json(
        { success: false, message: "Error fetching User Data" },
        { status: 401 },
      );
    }

    const user = userData.data;

    const response = NextResponse.json({ success: true });

    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: Number(process.env.JWT_EXPIRE_ACCESS_TOKEN) || 60 * 60 * 24 * 7,
      path: "/",
    });

    if (res.data.refreshToken) {
      response.cookies.set("refreshToken", res.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge:
          Number(process.env.JWT_EXPIRE_REFRESH_TOKEN) || 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    response.cookies.set("role", user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: Number(process.env.JWT_EXPIRE_LOCAL_TOKEN) || 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json(
      { success: false, message: "Error in refresh token" },
      { status: 500 },
    );
  }
}
