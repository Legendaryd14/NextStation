"use client";

import { ShoppingBasket } from "@gravity-ui/icons";
import { cn } from "@/lib/utils";
import { useCart } from "./CartContext";

type CartTriggerProps = {
  className?: string;
  iconClassName?: string;
};

export function CartTrigger({ className, iconClassName }: CartTriggerProps) {
  const { openCart, totalItems } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-bold shadow-none transition duration-200 hover:-translate-y-0.5 dark:text-white",
        className,
      )}
      aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
    >
      <ShoppingBasket
        className={cn("text-amber-50 text-3xl", iconClassName)}
      />
      {totalItems > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-[#fe1929] text-[10px] font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
