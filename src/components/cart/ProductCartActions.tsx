"use client";

import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartProduct } from "@/type/cart";
import { useCart } from "./CartContext";

type ProductCartActionsProps = {
  product: CartProduct;
};

export function ProductCartActions({ product }: ProductCartActionsProps) {
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
  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    addItem(product, 1);
    openCart();
  };

  if (!inCart) {
    return (
      <button
        type="button"
        disabled={outOfStock}
        onClick={handleAdd}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-amber-300 px-6 text-sm font-semibold text-black transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
      >
        <ShoppingCart className="size-4" />
        Add to cart
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={cn(
            "inline-flex items-center rounded-lg border border-white/10 bg-white/5",
          )}
        >
          <button
            type="button"
            onClick={() => decrementItem(product.productId)}
            className="flex size-11 items-center justify-center text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </button>
          <span className="min-w-10 text-center text-sm font-semibold text-white">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => incrementItem(product.productId)}
            disabled={quantity >= product.stock}
            className="flex size-11 items-center justify-center text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => removeItem(product.productId)}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#fe1929]/30 bg-[#fe1929]/10 px-4 text-sm font-semibold text-[#fe1929] transition hover:bg-[#fe1929]/20"
        >
          <Trash2 className="size-4" />
          Remove
        </button>

        <button
          type="button"
          onClick={openCart}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <ShoppingCart className="size-4" />
          View cart
        </button>
      </div>

      <p className="text-sm text-emerald-300/90">
        {quantity} in cart · {product.stock - quantity} still available
      </p>
    </div>
  );
}
