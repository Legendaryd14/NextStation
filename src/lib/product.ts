export async function getProducts(params: {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  isActive?: string;
}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?${query.toString()}`,
    {
      next: {
        revalidate: 60,
      },
    },
  );

  return res.json();
}
