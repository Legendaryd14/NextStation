"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation"; // usePathname اضافه شد
import { ProductCard } from "./ProductCard";
import { ProductResponse } from "@/type/product";

interface ProductsGridProps {
  products: ProductResponse;
  page: number;
  category?: string;
}

export default function ProductsGrid({
  products,
  page,
  category,
}: ProductsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // مسیر فعلی را می‌گیرد (مثلا /categories/action)
  const [hovered, setHovered] = useState<number | null>(null);

  const limit = 16;
  // اضافه کردن Optional Chaining برای جلوگیری از خطای undefined
  const totalPages = Math.ceil((products?.total || 0) / limit);

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    // به جای ریدایرکت اجباری به /products، از pathname فعلی استفاده می‌کنیم
    // این باعث می‌شود صفحه‌بندی هم در /products و هم در /categories/xxx درست کار کند
    router.push(`${pathname}?${params.toString()}`);
  };

  // اگر دیتا هنوز نرسیده یا خالی است، یک پیام ساده نشان دهیم
  if (!products || !products.data) {
    return (
      <div className="text-center py-20 text-gray-400">No products found.</div>
    );
  }

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
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-10 text-white">
          <button
            disabled={page <= 1}
            onClick={() => updatePage(page - 1)}
            className="rounded border border-white/20 px-4 py-2 transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => updatePage(page + 1)}
            className="rounded border border-white/20 px-4 py-2 transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
