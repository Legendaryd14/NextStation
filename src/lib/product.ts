import { BASE_URL } from "@/app/base";
import { GetProductsParams, ProductResponse } from "@/type/product";

export async function getProducts({
  search,
  brand,
  category,
  limit = "12",
  page = "1",
}: GetProductsParams = {}): Promise<ProductResponse> {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (brand) params.append("brand", brand);

  const res = await fetch(`${BASE_URL}/products?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error Loading Products");
  }

  return res.json();
}
