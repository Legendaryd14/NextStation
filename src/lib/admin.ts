"use client";

import { useEffect, useState } from "react";

export function readRoleCookie(): string | null {
  if (typeof document === "undefined") return null;

  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1]
      ?.toLowerCase() ?? null
  );
}

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(readRoleCookie() === "admin");
  }, []);

  return isAdmin;
}
