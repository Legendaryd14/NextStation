"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Product } from "@/type/product";
import { IMAGE_BASE_URL } from "@/app/base";
import { cn } from "@/lib/utils";
import {
  dashboardButtonClass,
  dashboardPageClass,
  dashboardPanelClass,
  dashboardTableHeadClass,
  dashboardTableRowClass,
  dashboardTitleClass,
} from "./dashboardStyles";
import { useProductsApi } from "@/hooks/useProductsApi";

export default function StocksComponent() {
  const productsApi = useProductsApi();

  // استفاده از useRef برای توابع API جهت جلوگیری از چرخه بی‌نهایت
  const listRef = useRef(productsApi.list);
  const updateRef = useRef(productsApi.update);

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const limit = 10;

  // استفاده از useCallback برای پایدار کردن تابع fetch
  const loadData = useCallback(
    async (currentPage: number, isMounted: { current: boolean }) => {
      try {
        const res = await listRef.current({ page: currentPage, limit });

        if (!isMounted.current) return;

        if (res.data?.success) {
          setProducts(res.data.data);
          setTotalPages(res.data.pages);
          setError("");
        } else {
          setError("خطا در دریافت لیست محصولات");
        }
      } catch (err) {
        if (isMounted.current) setError("عدم اتصال به سرور");
      }
    },
    [limit],
  ); // فقط به limit وابسته است

  useEffect(() => {
    const isMounted = { current: true };
    loadData(page, isMounted);

    return () => {
      isMounted.current = false;
    };
  }, [page, loadData]); // حالا وابستگی‌ها کاملاً پایدار هستند

  const handleInputChange = (
    id: string,
    field: "price" | "stock",
    value: string,
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, [field]: Number(value) } : p)),
    );
  };

  const handleUpdate = async (product: Product) => {
    setUpdatingId(product._id);
    setError("");

    try {
      const formData = new FormData();
      formData.append("price", product.price.toString());
      formData.append("stock", product.stock.toString());

      const res = await updateRef.current(product._id, formData);

      if (!res.ok) throw new Error("Update failed");

      // آپدیت موفقیت‌آمیز بود (می‌توانید اینجا یک Toast نمایش دهید)
    } catch (err) {
      setError("خطا در ذخیره‌سازی تغییرات");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className={dashboardPageClass()}>
      <h2 className={dashboardTitleClass("mb-6")}>Stock & Price Management</h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className={dashboardPanelClass()}>
        <table className="w-full text-left">
          <thead>
            <tr className={dashboardTableHeadClass()}>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">Price ($)</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {products.map((product) => {
              const imageUrl = product.images?.[0]
                ? `${IMAGE_BASE_URL}${product.images[0]}`
                : "/placeholder.png";

              return (
                <tr key={product._id} className={dashboardTableRowClass()}>
                  <td className="px-6 py-4">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                      unoptimized
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {product.brand || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) =>
                        handleInputChange(product._id, "price", e.target.value)
                      }
                      className="w-24 rounded border border-white/10 bg-white/5 px-2 py-1 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={product.stock}
                      onChange={(e) =>
                        handleInputChange(product._id, "stock", e.target.value)
                      }
                      className={cn(
                        "w-20 rounded border border-white/10 bg-white/5 px-2 py-1 focus:outline-none",
                        product.stock <= 5 ? "text-red-400" : "text-green-400",
                      )}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleUpdate(product)}
                      disabled={updatingId === product._id}
                      className={cn(
                        "min-w-[80px] rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
                        updatingId === product._id
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-emerald-600 text-white hover:bg-emerald-700",
                      )}
                    >
                      {updatingId === product._id ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className={dashboardButtonClass()}
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className={dashboardButtonClass()}
        >
          Next
        </button>
      </div>
    </div>
  );
}
