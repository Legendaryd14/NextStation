"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Star } from "lucide-react";
import { Product } from "@/type/product";
import { useRouter } from "next/navigation";

const imageSrc = "http://localhost:5000";

interface ProductCardProps {
  product: Product;
  index: number;
  hovered: number | null;
  setHovered: (index: number | null) => void;
}

export const ProductCard = React.memo(
  ({ product, index, hovered, setHovered }: ProductCardProps) => {
    const router = useRouter();

    const imageUrl = product.images?.[0]
      ? `${imageSrc}${product.images[0]}`
      : "/placeholder.png";

    const goToSingleProduct = () => {
      router.push(`/products/${product._id}`);
    };

    return (
      <div>
        <div
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "rounded-lg relative overflow-hidden h-60 md:h-72 w-full bg-gray-100 dark:bg-neutral-900 transition-all duration-300 ease-out cursor-pointer aspect-[4/5]",
            hovered !== null && hovered !== index && "blur-sm scale-[0.97]",
          )}
        >
          <Image
            src={imageUrl}
            alt={product.name}
            className="object-cover absolute inset-0"
            fill
            unoptimized
          />

          {/* Hover Details */}
          <div
            className={cn(
              "absolute inset-0 bg-black/40 flex flex-col justify-end p-3 transition-opacity duration-300",
              hovered === index ? "opacity-100" : "opacity-0",
            )}
          >
            <h3 className="text-base font-semibold text-white leading-tight">
              {product.name}
            </h3>

            <p className="text-white/80 text-xs mt-0.5">${product.price}</p>

            <div className="flex items-center gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.round(product.rating)
                      ? "text-yellow-300 fill-yellow-300"
                      : "text-gray-400"
                  }
                />
              ))}
            </div>

            <p className="text-[11px] text-white/60 mt-1">{product.category}</p>

            {/* VIEW BUTTON */}
            <button
              onClick={goToSingleProduct}
              className="mt-3 text-xs bg-white/90 text-black px-3 py-1 rounded hover:bg-white transition"
            >
              View Product
            </button>
          </div>
        </div>
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";
