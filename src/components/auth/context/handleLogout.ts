import router from "next/router";

export const handleLogout = async () => {
  document.cookie = "role=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "user=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "refreshToken=; path=/; max-age=0; SameSite=Lax";

  router.replace("/login");
  router.reload();
};
