import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

type LoginBody = {
  email?: string;
  password?: string;
  loginFor?: "admin" | "customer";
};

type BackendLoginResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  accessToken?: string;
  user?: {
    role?: string;
    [key: string]: unknown;
  };
  data?: {
    token?: string;
    refreshToken?: string;
    accessToken?: string;
    user?: {
      role?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
};

const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:5000";
const LOCAL_JWT_SECRET = process.env.LOCAL_JWT_SECRET ?? "your_secret";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginBody;

    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    const loginFor = body.loginFor === "admin" ? "admin" : "customer";

    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: "no-store",
    });

    const result = (await backendResponse.json()) as BackendLoginResponse;

    if (!backendResponse.ok || result.success === false) {
      return NextResponse.json(
        {
          success: false,
          message: result.message ?? "Login failed",
        },
        { status: backendResponse.status || 401 },
      );
    }

    const token =
      result.data?.token ?? result.data?.accessToken ?? result.token ?? result.accessToken;
    const refreshToken = result.data?.refreshToken ?? result.refreshToken;
    const user = result.data?.user ?? result.user;
    const role = user?.role?.toLowerCase();

    if (!role) {
      return NextResponse.json(
        { success: false, message: "Unable to verify account role" },
        { status: 403 },
      );
    }

    if (loginFor === "admin" && role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Only admin accounts can use this login",
        },
        { status: 403 },
      );
    }

    if (loginFor === "customer" && role === "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin accounts must use the admin login",
        },
        { status: 403 },
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: result.message ?? "Login successful",
        data: {
          user: user ? { ...user, role } : user,
        },
      },
      { status: 200 },
    );

    if (token) {
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      const localToken = await new SignJWT({
        role,
        userId: user?.id ?? user?._id,
        email: user?.email,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(new TextEncoder().encode(LOCAL_JWT_SECRET));

      response.cookies.set("localToken", localToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    if (refreshToken) {
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    if (role) {
      response.cookies.set("role", role, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
