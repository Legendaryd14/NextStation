"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { apiConfig } from "@/lib/apiConfig";
import { useApi } from "@/hooks/useAPI";
import type { LoginResponse, RefreshResponse, User } from "@/type/Auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

async function safeJson<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const api = useApi();

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(`${apiConfig.baseUrl}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await safeJson<RefreshResponse>(res);

      if (!res.ok || !data?.success) {
        setUser(null);
        return false;
      }

      setUser(data.data.user);
      return true;
    } catch {
      setUser(null);
      return false;
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setLoading(true);

      try {
        const res = await api.post<LoginResponse>("/auth/login", {
          email,
          password,
        });

        if (!res.ok || !res.data?.success) {
          setUser(null);
          return false;
        }

        setUser(res.data.data.user);
        return true;
      } catch {
        setUser(null);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      await fetch(`${apiConfig.baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
    } catch {
      // حتی اگر logout سمت سرور خطا داد، کاربر را سمت کلاینت خارج می‌کنیم.
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function bootstrapAuth() {
      try {
        await refreshSession();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, [refreshSession]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshSession,
    }),
    [user, loading, login, logout, refreshSession],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return ctx;
}
