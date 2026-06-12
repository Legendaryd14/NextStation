export type UserRole = "admin" | "customer";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthResponseData = {
  user: AuthUser;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: AuthResponseData;
};

export type LoginResponse = AuthResponse;
export type RegisterResponse = AuthResponse;

export type LoginFormData = {
  email: string;
  password: string;
};

export type SignupFormData = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export type LoginPayload = LoginFormData & {
  loginFor: UserRole;
};

export type SignupPayload = SignupFormData;
