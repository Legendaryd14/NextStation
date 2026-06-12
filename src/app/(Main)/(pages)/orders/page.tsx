"use client";

import { Package } from "lucide-react";

export default function OrdersPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-28 text-white">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary/15 p-3 text-primary">
            <Package className="size-6" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
              Account
            </p>
            <h1 className="text-3xl font-bold">Orders</h1>
          </div>
        </div>
        <p className="mt-6 text-neutral-300">
          Your order history will appear here after checkout.
        </p>
      </section>
    </main>
  );
}
