import ProductFilter from "@/components/Home/product/productFilter";
import ProductsGrid from "@/components/Home/product/productGrid";
import { getProducts } from "@/lib/product";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    limit?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
  }>;
}) {
  const params = await searchParams;

  const productsData = await getProducts({
    page: params.page || "1",
    limit: params.limit || "16",

    search: params.search,
    category: params.category,
    brand: params.brand,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    rating: params.rating,
  });

  return (
    <main className="min-h-screen pt-20">
      <div className="pt-20 px-4 text-center">
        <h1 className="text-4xl font-bold text-white">Our Products</h1>

        <p className="text-gray-400 mt-2">Explore our latest collection</p>
      </div>

      <div className="flex max-w-7xl mx-auto">
        <div className="">
          <ProductFilter />
        </div>

        <ProductsGrid products={productsData} page={Number(params.page) || 1} />
      </div>
    </main>
  );
}
