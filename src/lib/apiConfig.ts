import { BASE_URL } from "@/app/base";

export const apiConfig = {
  baseUrl: BASE_URL ?? "",

  defaultHeaders: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  } as HeadersInit,
};
