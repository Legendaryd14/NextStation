"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // اضافه شدن useSearchParams
import { ProductCard } from "./ProductCard";
import { ProductResponse } from "@/type/product";

interface ProductsGridProps {
  products: ProductResponse;
  page: number;
  category?: string; // اضافه کردن دسته بندی به Props
}

export default function ProductsGrid({
  products,
  page,
  category,
}: ProductsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hovered, setHovered] = useState<number | null>(null);

  const limit = 16;
  const totalPages = Math.ceil(products.total / limit);

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", newPage.toString());

    if (category) {
      params.set("category", category);
    }

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {category && (
        <div className="mb-6 px-6">
          <h2 className="text-xl font-semibold text-amber-300 capitalize">
            Category: {category}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {products.data.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 pt-10 text-white">
        <button
          disabled={page <= 1}
          onClick={() => updatePage(page - 1)}
          className="rounded border border-white/20 px-4 py-2 transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="text-sm font-medium">
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => updatePage(page + 1)}
          className="rounded border border-white/20 px-4 py-2 transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
