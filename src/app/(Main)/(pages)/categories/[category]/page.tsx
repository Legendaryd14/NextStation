import ProductsGrid from "@/components/Home/product/ProductGrid";
import type { Metadata } from "next";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryLabel = getCategoryLabel(category);

  return (
    <ProductsGrid
      category={categoryLabel}
      title={`${categoryLabel} Games`}
      description={`Browse available ${categoryLabel} titles across NextStation.`}
    />
  );
}
