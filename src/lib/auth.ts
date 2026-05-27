import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:5000";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
          cache: "no-store",
        });

        if (!res.ok) return null;

        const result = await res.json();
        const user = result.data?.user ?? result.user;

        if (!user) return null;

        return {
          id: String(user.id ?? user._id ?? user.email),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          accessToken:
            result.data?.token ??
            result.data?.accessToken ??
            result.token ??
            result.accessToken,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.accessToken = (user as { accessToken?: string }).accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = (token.user as typeof session.user) ?? session.user;
      (session as typeof session & { accessToken?: unknown }).accessToken =
        token.accessToken;

      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
