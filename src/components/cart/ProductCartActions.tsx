"use client";

import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CartProduct } from "@/type/cart";
import { useCart } from "./CartContext";

export function ProductCartActions({ product }: { product: CartProduct }) {
  const router = useRouter();
  const {
    addItem,
    removeItem,
    incrementItem,
    decrementItem,
    getItemQuantity,
    openCart,
  } = useCart();

  const quantity = getItemQuantity(product.productId);
  const inCart = quantity > 0;

  // تابع کمکی برای چک کردن وضعیت لاگین قبل از عملیات سبد خرید
  const ensureAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });
      if (response.status === 401) {
        router.push("/auth?status=login");
        return false;
      }
      return true;
    } catch {
      router.push("/auth?status=login");
      return false;
    }
  };

  const handleAdd = async () => {
    if (!(await ensureAuth())) return;
    try {
      await addItem(product, 1);
      openCart();
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        router.push("/auth?status=login");
        return;
      }
      console.error(err);
    }
  };

  const handleIncrement = async () => {
    if (!(await ensureAuth())) return;
    await incrementItem(product.productId);
  };

  const handleDecrement = async () => {
    if (!(await ensureAuth())) return;
    await decrementItem(product.productId);
  };

  const handleRemove = async () => {
    if (!(await ensureAuth())) return;
    await removeItem(product.productId);
  };

  if (!inCart) {
    return (
      <button
        type="button"
        disabled={product.stock <= 0}
        onClick={handleAdd}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-amber-300 px-6 text-sm font-semibold text-black transition hover:bg-amber-200 disabled:bg-white/10 disabled:text-white/35"
      >
        <ShoppingCart className="size-4" />
        Add to cart
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex items-center rounded-lg border border-white/10 bg-white/5">
        <button
          onClick={handleDecrement}
          className="size-11 flex items-center justify-center text-white/70 hover:text-white"
        >
          <Minus className="size-4" />
        </button>
        <span className="min-w-10 text-center text-sm font-semibold text-white">
          {quantity}
        </span>
        <button
          onClick={handleIncrement}
          disabled={quantity >= product.stock}
          className="size-11 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-30"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <button
        onClick={handleRemove}
        className="size-11 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 border border-red-500/20"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
