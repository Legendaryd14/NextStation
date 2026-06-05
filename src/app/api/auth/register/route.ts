import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/app/base";

type RegisterReq = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

type BackendRegisterRes = {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      role: string;
    };
    token: string;
    refreshToken: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    const data: RegisterReq = await req.json();

    const backendRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const res: BackendRegisterRes = await backendRes.json();

    if (!backendRes.ok || !res.success || !res.data?.token) {
      return NextResponse.json(
        { success: false, message: res.message || "Registration failed" },
        { status: backendRes.status },
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        data: { user: res.data.user, message: res.message },
      },
      { status: 201 },
    );

    response.cookies.set("token", res.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    response.cookies.set("refreshToken", res.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    response.cookies.set("role", res.data.user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: Number(process.env.JWT_EXPIRE_LOCAL_TOKEN_SET) || 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
