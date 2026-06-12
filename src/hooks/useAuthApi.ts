import { useApi } from "@/hooks/useAPI";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
};

export type CurrentUserResponse = {
  success: boolean;
  data: {
    user: User;
  };
};

export type RefreshTokenResponse = {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
};

export function useAuthApi() {
  const api = useApi();

  const register = (payload: RegisterPayload) => {
    return api.post<AuthResponse>("/auth/register", payload);
  };

  const login = (payload: LoginPayload) => {
    return api.post<AuthResponse>("/auth/login", payload);
  };

  const refreshToken = () => {
    return api.post<RefreshTokenResponse>("/auth/refresh-token");
  };

  const getCurrentUser = () => {
    return api.get<CurrentUserResponse>("/auth/me");
  };

  return {
    ...api,
    register,
    login,
    refreshToken,
    getCurrentUser,
  };
}
