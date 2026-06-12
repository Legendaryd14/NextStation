import { useApi } from "@/hooks/useAPI";
import type { User } from "@/hooks/useAuthApi";

export type ProfileResponse = {
  success: boolean;
  message?: string;
  data: {
    user: User;
  };
};

export type UpdateProfilePayload = {
  name?: string;
  email?: string;
  avatar?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export function useProfileApi() {
  const api = useApi();

  const getProfile = () => {
    return api.get<ProfileResponse>("/profile");
  };

  const updateProfile = (payload: UpdateProfilePayload | FormData) => {
    return api.put<ProfileResponse>("/profile", payload);
  };

  const changePassword = (payload: ChangePasswordPayload) => {
    return api.put<{ success: boolean; message: string }>(
      "/profile/change-password",
      payload,
    );
  };

  return {
    ...api,
    getProfile,
    updateProfile,
    changePassword,
  };
}
