"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { BASE_URL } from "@/app/base";
import { useCart } from "@/components/cart/CartContext";
import { Input } from "@/components/ui/input";

type CheckoutStep = "address" | "payment";

type CheckoutProfile = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

type AddressForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

const emptyAddress: AddressForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
};

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

function getProfileUser(payload: unknown): CheckoutProfile {
  if (!payload || typeof payload !== "object") return {};
  const root = payload as {
    user?: CheckoutProfile;
    data?: CheckoutProfile & {
      user?: CheckoutProfile;
      profile?: CheckoutProfile;
    };
  };

  return root.data?.user ?? root.data?.profile ?? root.user ?? root.data ?? {};
}

export function Checkout() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("address");
  const [address, setAddress] = useState<AddressForm>(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [profileLoading, setProfileLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const shipping = totalItems > 0 ? 0 : 0;
  const grandTotal = useMemo(
    () => totalPrice + shipping,
    [totalPrice, shipping],
  );

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          router.replace("/auth?status=login");
          return;
        }

        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) {
          throw new Error(result.message ?? "Unable to load your profile.");
        }

        const profile = getProfileUser(result);
        if (!active) return;

        setAddress({
          fullName: profile.name ?? "",
          email: profile.email ?? "",
          phone: profile.phone ?? "",
          address: profile.address ?? "",
          city: profile.city ?? "",
          postalCode: profile.postalCode ?? "",
          country: profile.country ?? "",
        });
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Unable to load your profile.",
          );
        }
      } finally {
        if (active) setProfileLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (!profileLoading && items.length === 0 && !successOpen) {
      router.replace("/products");
    }
  }, [items.length, profileLoading, router, successOpen]);

  function updateAddress(field: keyof AddressForm, value: string) {
    setAddress((current) => ({ ...current, [field]: value }));
  }

  function handleAddressSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStep("payment");
  }

  async function handlePlaceOrder() {
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        orderItems: items.map((item) => ({
          product: item.productId,
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          qty: item.quantity,
          price: item.price,
          image: item.image,
        })),
        shippingAddress: {
          fullName: address.fullName,
          email: address.email,
          phone: address.phone,
          address: address.address,
          city: address.city,
          postalCode: address.postalCode,
          country: address.country,
        },
        paymentMethod,
        itemsPrice: totalPrice,
        shippingPrice: shipping,
        totalPrice: grandTotal,
      };

      const response = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message ?? "Unable to submit your order.");
      }

      clearCart();
      setSuccessOpen(true);
      window.setTimeout(() => {
        router.push("/products");
        router.refresh();
      }, 2200);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to submit your order.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (profileLoading) {
    return (
      <main className="min-h-screen px-6 pt-28 text-white">
        <div className="mx-auto flex min-h-[420px] max-w-6xl items-center justify-center">
          <Loader2 className="size-8 animate-spin text-amber-300" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              Checkout
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Complete your order</h1>
          </div>

          <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
            {(["address", "payment"] as CheckoutStep[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => item === "address" && setStep(item)}
                className={`h-10 rounded-md px-4 text-sm font-medium capitalize transition ${
                  step === item
                    ? "bg-amber-300 text-black"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <p className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-lg border border-white/10 bg-neutral-950/80 p-5 shadow-2xl shadow-black/30">
            {step === "address" ? (
              <form onSubmit={handleAddressSubmit} className="space-y-5">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <MapPin className="size-5 text-amber-300" />
                  <h2 className="text-lg font-semibold">Shipping address</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    required
                    value={address.fullName}
                    onChange={(event) =>
                      updateAddress("fullName", event.target.value)
                    }
                    placeholder="Full name"
                    className="bg-zinc-900 text-white"
                  />
                  <Input
                    required
                    type="email"
                    value={address.email}
                    onChange={(event) =>
                      updateAddress("email", event.target.value)
                    }
                    placeholder="Email"
                    className="bg-zinc-900 text-white"
                  />
                  <Input
                    required
                    value={address.phone}
                    onChange={(event) =>
                      updateAddress("phone", event.target.value)
                    }
                    placeholder="Phone"
                    className="bg-zinc-900 text-white"
                  />
                  <Input
                    required
                    value={address.city}
                    onChange={(event) =>
                      updateAddress("city", event.target.value)
                    }
                    placeholder="City"
                    className="bg-zinc-900 text-white"
                  />
                  <Input
                    required
                    value={address.postalCode}
                    onChange={(event) =>
                      updateAddress("postalCode", event.target.value)
                    }
                    placeholder="Postal code"
                    className="bg-zinc-900 text-white"
                  />
                  <Input
                    required
                    value={address.country}
                    onChange={(event) =>
                      updateAddress("country", event.target.value)
                    }
                    placeholder="Country"
                    className="bg-zinc-900 text-white"
                  />
                </div>

                <textarea
                  required
                  value={address.address}
                  onChange={(event) =>
                    updateAddress("address", event.target.value)
                  }
                  placeholder="Street address"
                  className="min-h-28 w-full resize-none rounded-lg border border-white/10 bg-zinc-900 px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-amber-300/60"
                />

                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-amber-300 px-6 text-sm font-semibold text-black transition hover:bg-amber-200"
                >
                  Continue to payment
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <CreditCard className="size-5 text-amber-300" />
                  <h2 className="text-lg font-semibold">Payment</h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["card", "Credit card"],
                    ["cash", "Cash on delivery"],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                        paymentMethod === value
                          ? "border-amber-300 bg-amber-300/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={value}
                        checked={paymentMethod === value}
                        onChange={(event) =>
                          setPaymentMethod(event.target.value)
                        }
                        className="accent-amber-300"
                      />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <ShieldCheck className="size-4 text-emerald-300" />
                    Secure checkout
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Your order will be submitted after you confirm payment.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setStep("address")}
                    className="h-11 rounded-lg border border-white/15 px-5 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-amber-300 px-6 text-sm font-semibold text-black transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <PackageCheck className="size-4" />
                    )}
                    Place order
                  </button>
                </div>
              </div>
            )}
          </section>

          <aside className="h-fit rounded-lg border border-white/10 bg-neutral-950/80 p-5 shadow-2xl shadow-black/30">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="mt-1 text-xs text-white/45">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-amber-300">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-white">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {successOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-white/10 bg-neutral-950 p-6 text-center shadow-2xl shadow-black/50">
            <CheckCircle2 className="mx-auto size-12 text-emerald-300" />
            <h2 className="mt-4 text-xl font-semibold">Order received</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Thanks, your order has been submitted. Redirecting you back to
              products now.
            </p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
