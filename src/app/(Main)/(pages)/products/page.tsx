import ProductsGrid from "@/components/Home/product/ProductGrid";
import { getProducts } from "@/lib/product";

interface PageProps {
  searchParams: { page?: string };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = 12;

  const productsData = await getProducts(page, limit);

  return (
    <main className="min-h-screen pt-20 ">
      <div className="pt-20 px-4 text-center">
        <h1 className="text-4xl font-bold text-white">Our Products</h1>
        <p className="text-gray-400 mt-2">Explore our latest collection</p>
      </div>

      <ProductsGrid products={productsData} page={page} />
    </main>
  );
}
