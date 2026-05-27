"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { ProductType } from "@/type/productRes";
import { BASE_URL } from "@/app/base";
import { cn } from "@/lib/utils";
import {
  dashboardButtonClass,
  dashboardPageClass,
  dashboardPanelClass,
  dashboardTableHeadClass,
  dashboardTableRowClass,
  dashboardTitleClass,
} from "./dashboardStyles";

export default function StocksComponent() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchProducts = async (pageNumber: number) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/products?page=${pageNumber}&limit=${limit}`,
      );

      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Fetch products error", err);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  return (
    <div className={dashboardPageClass()}>
      <h2 className={dashboardTitleClass("mb-6")}>Product Stock & Prices</h2>

      <div className={dashboardPanelClass()}>
        <table className="w-full">
          <thead>
            <tr className={dashboardTableHeadClass()}>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const imageUrl = product.images?.[0]
                ? `${BASE_URL}${product.images[0]}`
                : "/placeholder.png";

              return (
                <tr key={product._id} className={dashboardTableRowClass()}>
                  {/* IMAGE */}
                  <td className="px-6 py-4">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded object-cover"
                      unoptimized
                    />
                  </td>

                  {/* NAME */}
                  <td className="px-6 py-4">{product.name}</td>

                  {/* PRICE */}
                  <td className="px-6 py-4 font-medium">${product.price}</td>

                  {/* STOCK */}
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "rounded px-2 py-1 text-xs",
                        product.stock > 5
                          ? "bg-green-100 text-green-800 dark:bg-green-400/10 dark:text-green-300"
                          : product.stock > 0
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-400/10 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-400/10 dark:text-red-300",
                      )}
                    >
                      {product.stock}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-4 mt-6">
        <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        className={dashboardButtonClass()}
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
        className={dashboardButtonClass()}
        >
          Next
        </button>
      </div>
    </div>
  );
}
