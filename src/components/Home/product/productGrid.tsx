"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "./ProductCard";
import { ProductResponse } from "@/type/product";

interface ProductsGridProps {
  products: ProductResponse;
  page: number;
}

export default function ProductsGrid({ products, page }: ProductsGridProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);

  const limit = 16;
  const totalPages = Math.ceil(products.total / limit);

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);

    params.set("page", newPage.toString());

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
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
          className="rounded border border-white/20 px-4 py-2 transition-colors hover:bg-white/10 disabled:opacity-30"
        >
          Previous
        </button>

        <span className="text-sm font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => updatePage(page + 1)}
          className="rounded border border-white/20 px-4 py-2 transition-colors hover:bg-white/10 disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
}
