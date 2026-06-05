import { IMAGE_BASE_URL } from "@/app/base";
import { ProductCartActions } from "@/components/cart/ProductCartActions";
import { getProductByID } from "@/lib/api";
import { PackageCheck, ShieldCheck, Star, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productResponse = await getProductByID(id);

  if (!productResponse || !productResponse.data) {
    notFound();
  }

  const product = productResponse.data;

  const imageUrl = product.images?.[0]
    ? `${IMAGE_BASE_URL}${product.images[0]}`
    : null;

  const stockLabel =
    product.stock > 0 ? `${product.stock} in stock` : "Out of stock";
  const rating = Math.max(0, Math.min(5, Math.round(product.rating ?? 0)));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pt-32">
      <Link
        href="/products"
        className="mb-6 inline-flex text-sm font-medium text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        ← Back to products
      </Link>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
        {/* بخش تصویر */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-neutral-950 shadow-2xl shadow-black/30">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-neutral-900 px-8 text-center text-sm text-neutral-400">
              Product image unavailable
            </div>
          )}
        </div>

        {/* بخش جزئیات محصول */}
        <div className="rounded-lg border border-white/10 bg-black/45 p-6 text-white shadow-xl backdrop-blur md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-300">
            <span>{product.brand}</span>
            <span className="text-white/25">/</span>
            <span>{product.category}</span>
          </div>

          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={18}
                  className={
                    index < rating
                      ? "fill-amber-300 text-amber-300"
                      : "text-white/25"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-white/60">
              {product.numReviews} reviews
            </span>
          </div>

          <p className="mt-6 text-4xl font-semibold text-white">
            {formatPrice(product.price)}
          </p>

          <p className="mt-5 text-base leading-7 text-white/70">
            {product.description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <PackageCheck className="mb-3 size-5 text-emerald-300" />
              <p className="text-sm font-medium">{stockLabel}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <Truck className="mb-3 size-5 text-sky-300" />
              <p className="text-sm font-medium">Fast delivery</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <ShieldCheck className="mb-3 size-5 text-violet-300" />
              <p className="text-sm font-medium">Secure checkout</p>
            </div>
          </div>

          <div className="mt-8 space-y-3 flex flex-col">
            <ProductCartActions
              product={{
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.images?.[0] ?? "",
                stock: product.stock,
                brand: product.brand,
                category: product.category,
              }}
            />
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
