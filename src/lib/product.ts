import { BASE_URL } from "@/app/base";
import { ProductResponse } from "@/type/product";

export async function getProducts(
  page: number = 1,
  limit: number = 9,
): Promise<ProductResponse> {
  const res = await fetch(`${BASE_URL}/products?page=${page}&limit=${limit}`, {
    next: {
      revalidate: 60,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
