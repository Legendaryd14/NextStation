import { BASE_URL } from "@/app/base";
import type { SingelProduct } from "@/type/product";

export const getProductByID = async (id: string): Promise<SingelProduct> => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to Fetch Your Product");
  }

  return await res.json();
};
