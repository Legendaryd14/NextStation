import { BASE_URL } from "@/app/base";

export const getProducts = async (
  params: { page?: string; limit?: string } = {},
) => {
  try {
    const search = new URLSearchParams();
    if (params.page) search.append("page", params.page);
    if (params.limit) search.append("limit", params.limit);

    const query = search.toString();

    const fullUrl = `${BASE_URL}/products${query ? `?${query}` : ""}`;

    console.log("Attempting to fetch from:", fullUrl);

    const res = await fetch(fullUrl, {
      method: "GET",

      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Error: ${res.status} - ${errorText}`);
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Network or API Error in getProducts:", error);

    throw error;
  }
};
