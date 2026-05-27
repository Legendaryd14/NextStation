"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ProductType } from "@/type/productRes";
import { BASE_URL } from "@/app/base";
import { ProductCard } from "./productCard";

type ProductsGridProps = {
  category?: string;
  title?: string;
  description?: string;
};

type ProductsResponse = {
  data: ProductType[];
  totalPages?: number;
  pages?: number;
};

type ProductsQuery = {
  page: number;
  limit: number;
  category?: string;
};

const limit = 9;

export default function ProductsGrid({
  category,
  title = "Products",
  description,
}: ProductsGridProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pageState, setPageState] = useState({ category, page: 1 });
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  const page = pageState.category === category ? pageState.page : 1;

  const updatePage = (getNextPage: (currentPage: number) => number) => {
    setPageState((current) => {
      const currentPage = current.category === category ? current.page : 1;

      return {
        category,
        page: getNextPage(currentPage),
      };
    });
  };

  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      const params: ProductsQuery = {
        page,
        limit,
      };

      if (category) params.category = category;

      try {
        const res = await axios.get<ProductsResponse>(`${BASE_URL}/api/products`, {
          params,
        });

        if (ignore) return;

        setError("");
        setProducts(res.data.data ?? []);
        setTotalPages(res.data.totalPages ?? res.data.pages ?? 1);
      } catch (err) {
        console.error("Fetch products error", err);

        if (ignore) return;

        setProducts([]);
        setError("Unable to load products right now.");
      }
    }

    void fetchProducts();

    return () => {
      ignore = true;
    };
  }, [category, page]);

  return (
    <div className="mx-auto mt-30 flex max-w-7xl gap-8 px-4 py-10">
      <div className="flex-1 gap-1.5">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">{title}</h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
              {description}
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        {!error && products.length === 0 && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
            No products found in this category.
          </div>
        )}

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              index={index}
              hovered={hovered}
              setHovered={setHovered}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 pt-10">
          <button
            disabled={page === 1}
            onClick={() => updatePage((currentPage) => currentPage - 1)}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => updatePage((currentPage) => currentPage + 1)}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
