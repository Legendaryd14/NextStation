import ProductsGrid from "@/components/Home/product/productGrid";
import { getProducts } from "@/lib/product";
import type { Metadata } from "next";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

// این تابع را حتماً اینجا اضافه کنید تا خطا برطرف شود
function getCategoryLabel(category: string) {
  try {
    return decodeURIComponent(category);
  } catch {
    return category;
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryLabel = getCategoryLabel(category);

  return {
    title: `${categoryLabel} Games | NextStation`,
    description: `Browse ${categoryLabel} games on NextStation.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  const sParams = await searchParams;
  const categoryLabel = getCategoryLabel(category);
  const currentPage = Number(sParams.page) || 1;

  // دریافت محصولات بر اساس دسته بندی
  const productsData = await getProducts({
    page: currentPage.toString(),
    limit: "16",
    category: categoryLabel,
  });

  return (
    <main className="min-h-screen pt-20">
      <div className="pt-20 px-4 text-center">
        <h1 className="text-4xl font-bold text-white capitalize">
          {categoryLabel} Games
        </h1>
        <p className="text-gray-400 mt-2">
          Browse available {categoryLabel} titles across NextStation.
        </p>
      </div>

      <ProductsGrid
        products={productsData}
        page={currentPage}
        category={categoryLabel}
      />
    </main>
  );
}
