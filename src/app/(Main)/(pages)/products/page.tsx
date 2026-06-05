// app/products/page.tsx

import ProductsGrid from "@/components/Home/product/ProductGrid";
import { getProducts } from "@/lib/product";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;

  const productsData = await getProducts({
    page: params.page || "1",
    limit: "16",
    search: params.search,
  });

  return (
    <main className="min-h-screen pt-20">
      <div className="pt-20 px-4 text-center">
        <h1 className="text-4xl font-bold text-white">Our Products</h1>
        <p className="text-gray-400 mt-2">Explore our latest collection</p>
      </div>
      <ProductsGrid products={productsData} page={Number(params.page) || 1} />
    </main>
  );
}
