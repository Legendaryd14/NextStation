import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { backendFetch } from "@/lib/backend";

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
};

type BackendUser = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
};

type BackendRegisterResponse = {
  success?: boolean;
  message?: string;
  data?: {
    token?: string;
    refreshToken?: string;
    user?: BackendUser;
  };
};

const LOCAL_JWT_SECRET = process.env.LOCAL_JWT_SECRET ?? "your_secret";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterBody;

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    const backendResponse = await backendFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        password: body.password,
        ...(body.phone ? { phone: body.phone } : {}),
      }),
    });

    const result = (await backendResponse.json()) as BackendRegisterResponse;

    if (!backendResponse.ok || result.success === false) {
      return NextResponse.json(
        {
          success: false,
          message: result.message ?? "Registration failed",
        },
        { status: backendResponse.status || 400 },
      );
    }

    const token = result.data?.token;
    const refreshToken = result.data?.refreshToken;
    const user = result.data?.user;
    const role = user?.role?.toLowerCase() ?? "user";

    const response = NextResponse.json(
      {
        success: true,
        message: result.message ?? "Account created successfully",
        data: {
          user: user ? { ...user, role } : user,
        },
      },
      { status: 201 },
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
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
