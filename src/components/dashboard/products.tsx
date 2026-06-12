"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Pencil } from "@gravity-ui/icons";

import type { Product } from "@/type/product";
import { BASE_URL, IMAGE_BASE_URL } from "@/app/base";
import { useProductsApi } from "@/hooks/useProductsApi";
import { cn } from "@/lib/utils";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "../ui/animated-modal";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FileUpload } from "../ui/file-upload";

import {
  dashboardButtonClass,
  dashboardPageClass,
  dashboardPanelClass,
  dashboardTableHeadClass,
  dashboardTableRowClass,
  dashboardTitleClass,
} from "./dashboardStyles";

const LIMIT = 10;

const emptyProduct: Partial<Product> = {
  name: "",
  description: "",
  price: 0,
  images: [],
  category: "",
  stock: 0,
  brand: "",
  isActive: true,
};

export default function AdminProductsPage() {
  const { list, create, update, remove } = useProductsApi();

  const listRef = useRef(list);
  const createRef = useRef(create);
  const updateRef = useRef(update);
  const removeRef = useRef(remove);

  useEffect(() => {
    listRef.current = list;
    createRef.current = create;
    updateRef.current = update;
    removeRef.current = remove;
  }, [list, create, update, remove]);

  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product> | null>(
    null,
  );
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [isActive, setIsActive] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const getImageUrl = (image?: string) => {
    if (!image) return "/placeholder.png";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${IMAGE_BASE_URL}${image}`;
  };

  const getListParams = () => ({
    page,
    limit: LIMIT,
    search: search.trim() || undefined,
    category: category.trim() || undefined,
    brand: brand.trim() || undefined,
    isActive: isActive === "" ? undefined : isActive === "true",
    minPrice: minPrice.trim() ? Number(minPrice) : undefined,
    maxPrice: maxPrice.trim() ? Number(maxPrice) : undefined,
  });

  const refetchProducts = async () => {
    const res = await listRef.current(getListParams());

    if (res.ok && res.data?.success) {
      setProducts(res.data.data || []);
      setTotalPages(res.data.pages || 1);
      return;
    }

    setProducts([]);
    setTotalPages(1);
    setError(res.data?.message || "Unable to load products.");
  };

  /*
    چون useProductsApi فعلاً stable نیست، از listRef استفاده شده.
    بنابراین list داخل dependency این effect نمی‌آید تا infinite loop ایجاد نشود.
  */
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    let ignore = false;

    const run = async () => {
      setIsLoading(true);
      setError("");

      try {
        const res = await listRef.current({
          page,
          limit: LIMIT,
          search: search.trim() || undefined,
          category: category.trim() || undefined,
          brand: brand.trim() || undefined,
          isActive: isActive === "" ? undefined : isActive === "true",
          minPrice: minPrice.trim() ? Number(minPrice) : undefined,
          maxPrice: maxPrice.trim() ? Number(maxPrice) : undefined,
        });

        if (ignore) return;

        if (res.ok && res.data?.success) {
          setProducts(res.data.data || []);
          setTotalPages(res.data.pages || 1);
        } else {
          setProducts([]);
          setTotalPages(1);
          setError(res.data?.message || "Unable to load products.");
        }
      } catch (err) {
        if (ignore) return;

        console.error("Fetch products error:", err);
        setProducts([]);
        setTotalPages(1);
        setError("Unable to load products.");
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      ignore = true;
    };
  }, [page, search, category, brand, isActive, minPrice, maxPrice]);

  const resetToFirstPage = () => {
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetToFirstPage();
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    resetToFirstPage();
  };

  const handleBrandChange = (value: string) => {
    setBrand(value);
    resetToFirstPage();
  };

  const handleIsActiveChange = (value: string) => {
    setIsActive(value);
    resetToFirstPage();
  };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    resetToFirstPage();
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    resetToFirstPage();
  };

  const startAddProduct = () => {
    setEditingId("new");
    setEditedProduct({ ...emptyProduct });
    setSelectedImages([]);
    setIsNewProduct(true);
    setError("");
  };

  const startEdit = (product: Product) => {
    setEditingId(product._id);
    setEditedProduct({ ...product });
    setSelectedImages([]);
    setIsNewProduct(false);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedProduct(null);
    setSelectedImages([]);
    setIsNewProduct(false);
    setSelectedImages([]);
    setError("");
  };

  const updateField = <K extends keyof Product>(
    field: K,
    value: Product[K],
  ) => {
    setEditedProduct((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const deleteProduct = async (id: string) => {
    if (isDeletingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setIsDeletingId(id);

      const res = await removeRef.current(id);

      if (!res.ok || !res.data?.success) {
        setError(res.data?.message || "Failed to delete product.");
        return;
      }

      await refetchProducts();
    } catch (err) {
      console.error("Delete product error:", err);
      setError("Failed to delete product.");
    } finally {
      setIsDeletingId(null);
    }
  };
  const [selectedImagePreviews, setSelectedImagePreviews] = useState<string[]>(
    [],
  );

  useEffect(() => {
    const previews = selectedImages.map((file) => URL.createObjectURL(file));

    const selectedImagePreviews = selectedImages.map((file) =>
      URL.createObjectURL(file),
    );

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedImages]);
  const saveEdit = async () => {
    if (!editedProduct || isSaving) return;

    const name = editedProduct.name?.trim() || "";
    const categoryValue = editedProduct.category?.trim() || "";
    const priceValue = Number(editedProduct.price);
    const stockValue = Number(editedProduct.stock);

    if (!name) {
      setError("Product name is required.");
      return;
    }

    if (!categoryValue) {
      setError("Category is required.");
      return;
    }

    if (Number.isNaN(priceValue) || priceValue < 0) {
      setError("Price must be 0 or greater.");
      return;
    }

    if (Number.isNaN(stockValue) || stockValue < 0) {
      setError("Stock must be 0 or greater.");
      return;
    }

    if (isNewProduct && selectedImages.length === 0) {
      setError("Image is required for new products.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const payload = new FormData();

      Object.entries(editedProduct).forEach(([key, value]) => {
        if (key === "_id" || key === "images") return;
        if (value === undefined || value === null) return;

        if (typeof value === "boolean") {
          payload.append(key, value ? "true" : "false");
        } else {
          payload.append(key, String(value));
        }
      });

      selectedImages.forEach((file) => {
        payload.append("images", file);
      });

      if (isNewProduct) {
        const res = await createRef.current(payload);

        if (!res.ok || !res.data?.success) {
          setError(res.data?.message || "Failed to create product.");
          return;
        }
      } else if (editingId) {
        const res = await updateRef.current(editingId, payload);

        if (!res.ok || !res.data?.success) {
          setError(res.data?.message || "Failed to update product.");
          return;
        }
      }

      cancelEdit();
      await refetchProducts();
    } catch (err) {
      console.error("Save product error:", err);
      setError("Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal>
      <div className={dashboardPageClass()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className={dashboardTitleClass()}>Product Management</h2>

          <ModalTrigger onClick={startAddProduct}>
            <span
              className={cn(
                dashboardButtonClass(),
                "cursor-pointer bg-green-600 text-white hover:bg-green-700",
              )}
            >
              + Add Product
            </span>
          </ModalTrigger>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-400 bg-red-500/10 p-3 text-red-500">
            {error}
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          <Input
            placeholder="Category"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          />

          <Input
            placeholder="Brand"
            value={brand}
            onChange={(e) => handleBrandChange(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => handleMinPriceChange(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
          />

          <select
            className="rounded-md border border-white/10 bg-black px-3 text-white"
            value={isActive}
            onChange={(e) => handleIsActiveChange(e.target.value)}
          >
            <option value="">Status (All)</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className={dashboardPanelClass()}>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className={dashboardTableHeadClass()}>
                  <th className="px-6 py-4 text-left">Img</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Brand</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Stock</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-white">
                      Loading...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-white/70">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className={dashboardTableRowClass()}>
                      <td className="px-6 py-4">
                        <Image
                          src={getImageUrl(product.images?.[0])}
                          alt={product.name || "product"}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded object-cover"
                          unoptimized
                        />
                      </td>

                      <td
                        className={cn(
                          "px-6 py-4",
                          "text-black dark:text-white",
                        )}
                      >
                        {product.name}
                      </td>

                      <td className="px-6 py-4">{product.category}</td>

                      <td className="px-6 py-4">{product.brand}</td>

                      <td className="px-6 py-4 text-green-400">
                        ${product.price}
                      </td>

                      <td className="px-6 py-4">{product.stock}</td>

                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "rounded px-2 py-1 text-xs",
                            product.isActive
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400",
                          )}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <ModalTrigger onClick={() => startEdit(product)}>
                            <Pencil className="cursor-pointer text-blue-500 hover:text-blue-400" />
                          </ModalTrigger>

                          <button
                            type="button"
                            disabled={isDeletingId === product._id}
                            onClick={() => deleteProduct(product._id)}
                            className="disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Delete product"
                          >
                            <Trash2
                              className="text-red-500 hover:text-red-400"
                              size={18}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-white">
          <button
            type="button"
            disabled={page === 1 || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={dashboardButtonClass()}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((p) => p + 1)}
            className={dashboardButtonClass()}
          >
            Next
          </button>
        </div>

        {editingId && editedProduct && (
          <ModalBody>
            <ModalContent
              className={cn(
                "max-h-[85vh]",
                "overflow-y-auto",
                "rounded-xl",
                "border border-white/10",
                "bg-[#020308]",
                "p-6",
                "text-white",
                "shadow-none",
              )}
            >
              <h2 className="mb-6 text-xl font-bold text-white">
                {isNewProduct ? "Add New Product" : "Edit Product"}
              </h2>

              {!isNewProduct && editedProduct.images?.length ? (
                <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                  <Label className="text-slate-200">Current Images</Label>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {editedProduct.images.map((image) => (
                      <Image
                        key={image}
                        src={getImageUrl(image)}
                        alt="product image"
                        width={72}
                        height={72}
                        className="h-18 w-18 rounded-lg border border-slate-700 object-cover"
                        unoptimized
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label className="text-slate-200">Name</Label>
                  <Input
                    value={editedProduct.name ?? ""}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="mt-1 border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <Label className="text-slate-200">Price</Label>
                  <Input
                    type="number"
                    value={editedProduct.price ?? 0}
                    onChange={(e) =>
                      updateField("price", Number(e.target.value))
                    }
                    className="mt-1 border-slate-700 bg-slate-900 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-200">Stock</Label>
                  <Input
                    type="number"
                    value={editedProduct.stock ?? 0}
                    onChange={(e) =>
                      updateField("stock", Number(e.target.value))
                    }
                    className="mt-1 border-slate-700 bg-slate-900 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-200">Category</Label>
                  <Input
                    value={editedProduct.category ?? ""}
                    onChange={(e) => updateField("category", e.target.value)}
                    className="mt-1 border-slate-700 bg-slate-900 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-200">Brand</Label>
                  <Input
                    value={editedProduct.brand ?? ""}
                    onChange={(e) => updateField("brand", e.target.value)}
                    className="mt-1 border-slate-700 bg-slate-900 text-white"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label className="text-slate-200">Description</Label>
                <textarea
                  className="mt-1 min-h-[110px] w-full rounded-md border border-slate-700 bg-slate-900 p-3 text-white outline-none transition focus:border-blue-500"
                  value={editedProduct.description ?? ""}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 p-3">
                <input
                  type="checkbox"
                  checked={editedProduct.isActive ?? false}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="h-4 w-4 accent-blue-600"
                />
                <Label className="text-slate-200">Is Active</Label>
              </div>

              <div className="mt-5 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <Label className="text-slate-200">Upload Images</Label>

                <div className="mt-3">
                  <FileUpload
                    onChange={(files) => setSelectedImages(files as File[])}
                  />
                </div>

                {selectedImagePreviews.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-3 text-sm font-medium text-slate-300">
                      Selected Images Preview
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {selectedImagePreviews.map((src, index) => (
                        <div
                          key={src}
                          className="relative rounded-lg border border-slate-700 bg-slate-950 p-2"
                        >
                          <Image
                            src={src}
                            alt={`selected image ${index + 1}`}
                            width={88}
                            height={88}
                            className="h-22 w-22 rounded-md object-cover"
                            unoptimized
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedImages((prev) =>
                                prev.filter(
                                  (_, fileIndex) => fileIndex !== index,
                                ),
                              )
                            }
                            className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white hover:bg-red-700"
                            aria-label="Remove selected image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-slate-700 pt-4">
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={isSaving}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving
                    ? "Saving..."
                    : isNewProduct
                      ? "Create"
                      : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={isSaving}
                  className="rounded-md bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </ModalContent>
          </ModalBody>
        )}
      </div>
    </Modal>
  );
}
