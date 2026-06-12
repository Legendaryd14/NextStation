"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductFilter() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", "1");

    router.push(`/products?${params.toString()}`);
  };

  return (
    <aside className="w-72 shrink-0 border-r border-white/10 p-6">
      <h2 className="mb-8 text-xl font-semibold text-white">Product Filters</h2>

      {/* Category */}

      <div className="mb-6">
        <label className="mb-2 block text-sm text-zinc-300">Category</label>

        <Select
          defaultValue={searchParams.get("category") || "all"}
          onValueChange={(value) => updateFilter("category", value)}
        >
          <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>

          <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
            <SelectItem value="all">All Categories</SelectItem>

            <SelectItem value="Action">Action</SelectItem>

            <SelectItem value="Action-Adventure">Action Adventure</SelectItem>

            <SelectItem value="Adventure">Adventure</SelectItem>

            <SelectItem value="FPS">FPS</SelectItem>

            <SelectItem value="Racing">Racing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}

      <div className="mb-6">
        <label className="mb-2 block text-sm text-zinc-300">Brand</label>

        <Select
          defaultValue={searchParams.get("brand") || "all"}
          onValueChange={(value) => updateFilter("brand", value)}
        >
          <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>

          <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
            <SelectItem value="all">All Brands</SelectItem>

            <SelectItem value="Steam">Steam</SelectItem>

            <SelectItem value="PlayStation">PlayStation</SelectItem>

            <SelectItem value="Xbox">Xbox</SelectItem>

            <SelectItem value="Nintendo">Nintendo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rating */}

      <div className="mb-6">
        <label className="mb-2 block text-sm text-zinc-300">Rating</label>

        <Select
          defaultValue={searchParams.get("rating") || "all"}
          onValueChange={(value) => updateFilter("rating", value)}
        >
          <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
            <SelectValue placeholder="All Ratings" />
          </SelectTrigger>

          <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
            <SelectItem value="all">All Ratings</SelectItem>

            <SelectItem value="5">★★★★★</SelectItem>

            <SelectItem value="4">★★★★+</SelectItem>

            <SelectItem value="3">★★★+</SelectItem>

            <SelectItem value="2">★★+</SelectItem>

            <SelectItem value="1">★+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status */}

      <div className="mb-6">
        <label className="mb-2 block text-sm text-zinc-300">Status</label>

        <Select
          defaultValue={searchParams.get("isActive") || "all"}
          onValueChange={(value) => updateFilter("isActive", value)}
        >
          <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
            <SelectItem value="all">All</SelectItem>

            <SelectItem value="true">Active</SelectItem>

            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price */}

      <div className="space-y-3">
        <label className="block text-sm text-zinc-300">Price Range</label>

        <Input
          type="number"
          placeholder="Min Price"
          defaultValue={searchParams.get("minPrice") || ""}
          onBlur={(e) => updateFilter("minPrice", e.target.value)}
          className="bg-zinc-950 border-zinc-800 text-white"
        />

        <Input
          type="number"
          placeholder="Max Price"
          defaultValue={searchParams.get("maxPrice") || ""}
          onBlur={(e) => updateFilter("maxPrice", e.target.value)}
          className="bg-zinc-950 border-zinc-800 text-white"
        />
      </div>
    </aside>
  );
}
