"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { BASE_URL } from "@/app/base";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useCart } from "./CartContext";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function getImageUrl(src?: string) {
  if (!src) return "/placeholder.png";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${BASE_URL}${src}`;
}

export function CartDrawer() {
  const {
    items,
    totalItems,
    totalPrice,
    isOpen,
    setIsOpen,
    incrementItem,
    decrementItem,
    removeItem,
  } = useCart();

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerContent
        className={cn(
          "fixed inset-y-0 right-0 left-auto mt-0 h-full w-full max-w-md rounded-none rounded-l-xl",
          "border-l border-white/10 bg-neutral-950/95 text-white backdrop-blur-xl",
          "data-[vaul-drawer-direction=right]:max-w-md",
        )}
      >
        <DrawerHeader className="border-b border-white/10 px-5 pb-4 pt-5 text-left">
          <div className="flex items-start justify-between gap-3">
            <div>
              <DrawerTitle className="flex items-center gap-2 text-lg font-semibold text-white">
                <ShoppingBag className="size-5 text-amber-300" />
                Your Cart
              </DrawerTitle>
              <DrawerDescription className="text-white/55">
                {totalItems === 0
                  ? "No items yet — add games from the store."
                  : `${totalItems} item${totalItems === 1 ? "" : "s"} in cart`}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <button
                type="button"
                className="rounded-lg border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close cart"
              >
                <X className="size-4" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 px-6 py-10 text-center">
              <ShoppingBag className="mb-4 size-10 text-white/25" />
              <p className="text-sm font-medium text-white/80">
                Your cart is empty
              </p>
              <p className="mt-1 text-xs text-white/45">
                Browse products and add your favorites here.
              </p>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="mt-5 inline-flex h-10 items-center rounded-lg bg-amber-300 px-5 text-sm font-semibold text-black transition hover:bg-amber-200"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-3 rounded-xl border border-white/10 bg-black/40 p-3"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {item.name}
                        </p>
                        {(item.brand || item.category) && (
                          <p className="mt-0.5 truncate text-xs text-white/45">
                            {[item.brand, item.category]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="shrink-0 rounded-md p-1.5 text-white/45 transition hover:bg-[#fe1929]/15 hover:text-[#fe1929]"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-lg border border-white/10 bg-white/5">
                        <button
                          type="button"
                          onClick={() => decrementItem(item.productId)}
                          className="flex size-8 items-center justify-center text-white/70 transition hover:bg-white/10 hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementItem(item.productId)}
                          disabled={item.quantity >= item.stock}
                          className="flex size-8 items-center justify-center text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-amber-300">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DrawerFooter className="border-t border-white/10 px-5 pb-6 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/55">Subtotal</span>
            <span className="text-lg font-semibold text-white">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <button
            type="button"
            disabled={items.length === 0}
            className="h-11 rounded-lg bg-amber-300 text-sm font-semibold text-black transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
          >
            Checkout
          </button>
          <DrawerClose asChild>
            <button
              type="button"
              className="h-10 rounded-lg border border-white/15 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Continue shopping
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
