"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Pencil } from "@gravity-ui/icons";

import type { Product, ProductResponse } from "@/type/product";

import { BASE_URL } from "@/app/base";
import { productsApi } from "@/lib/api";
import { getProducts } from "@/lib/product";
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

const emptyProduct: Product = {
  _id: "new",
  name: "",
  description: "",
  price: 0,
  images: [],
  category: "",
  stock: 0,
  brand: "",
  rating: 0,
  numReviews: 0,
  isActive: true,
  createdAt: "",
  updatedAt: "",
  __v: 0,
};

export default function ProductsPage() {
  const isAdmin = true;

  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = useCallback(async (pageNumber: number) => {
    const res = await getProducts({
      page: String(pageNumber),
      limit: String(LIMIT),
    });

    return res as ProductResponse;
  }, []);

  useEffect(() => {
    let ignore = false;

    async function run() {
      try {
        const res = await loadProducts(page);

        if (ignore) return;

        const nextProducts = res.data ?? [];
        const apiTotalPages =
          typeof res.pages === "number" && res.pages > 0
            ? res.pages
            : Math.ceil((res.total ?? 0) / LIMIT);

        setProducts(nextProducts);
        setTotalPages(Math.max(1, apiTotalPages));
        setError("");
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
    }

    void run();

    return () => {
      ignore = true;
    };
  }, [page, loadProducts]);

  const refreshCurrentPage = async () => {
    try {
      setIsLoading(true);

      const res = await loadProducts(page);

      const nextProducts = res.data ?? [];
      const apiTotalPages =
        typeof res.pages === "number" && res.pages > 0
          ? res.pages
          : Math.ceil((res.total ?? 0) / LIMIT);

      setProducts(nextProducts);
      setTotalPages(Math.max(1, apiTotalPages));
      setError("");
    } catch (err) {
      console.error("Refresh products error:", err);
      setError("Unable to refresh products.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToPrevPage = () => {
    if (page <= 1 || isLoading) return;

    setIsLoading(true);
    setPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    if (page >= totalPages || isLoading) return;

    setIsLoading(true);
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  const getImageUrl = (image?: string) => {
    if (!image) return "/placeholder.png";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${BASE_URL}${image}`;
    }

    return `${BASE_URL}/${image}`;
  };

  const startAddProduct = () => {
    if (!isAdmin) return;

    setEditingId("new");
    setEditedProduct({ ...emptyProduct });
    setSelectedImages([]);
    setIsNewProduct(true);
    setError("");
  };

  const startEdit = (product: Product) => {
    if (!isAdmin) return;

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
  };

  const updateField = (
    field: keyof Product,
    value: string | number | boolean,
  ) => {
    setEditedProduct((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const deleteProduct = async (id: string) => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      await productsApi.delete(id);

      setProducts((prev) => prev.filter((product) => product._id !== id));
      setError("");

      void refreshCurrentPage();
    } catch (err) {
      console.error("Delete product error:", err);
      setError("Failed to delete product. Admin access required.");
    }
  };

  const saveEdit = async () => {
    if (!editedProduct || !isAdmin) return;

    try {
      const payload = new FormData();

      payload.append("name", editedProduct.name ?? "");
      payload.append("description", editedProduct.description ?? "");
      payload.append("price", String(editedProduct.price ?? 0));
      payload.append("category", editedProduct.category ?? "");
      payload.append("brand", editedProduct.brand ?? "");
      payload.append("stock", String(editedProduct.stock ?? 0));
      payload.append("isActive", String(editedProduct.isActive));

      selectedImages.forEach((file) => {
        payload.append("images", file);
      });

      if (isNewProduct) {
        if (!selectedImages.length) {
          setError("Please upload at least one product image.");
          return;
        }

        await productsApi.create(payload);
      } else {
        await productsApi.update(editedProduct._id, payload);
      }

      cancelEdit();
      setError("");
      await refreshCurrentPage();
    } catch (err) {
      console.error("Save product error:", err);
      setError("Failed to save product. Admin access required.");
    }
  };

  return (
    <Modal>
      <div className={dashboardPageClass()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className={dashboardTitleClass()}>Product Management</h2>

          {isAdmin && (
            <ModalTrigger onClick={startAddProduct}>
              <span
                className={cn(
                  dashboardButtonClass(),
                  "inline-flex cursor-pointer items-center justify-center border-green-600 bg-green-600 text-white hover:bg-green-700 dark:border-green-500 dark:bg-green-600 dark:hover:bg-green-500",
                )}
              >
                + Add Product
              </span>
            </ModalTrigger>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        <div className={dashboardPanelClass()}>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className={dashboardTableHeadClass()}>
                  <th className="px-6 py-4 text-left">Img</th>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Brand</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Stock</th>
                  <th className="px-6 py-4 text-left">Rating</th>
                  <th className="px-6 py-4 text-left">Reviews</th>
                  <th className="px-6 py-4 text-left">Active</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-8 text-center">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-8 text-center">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const imageUrl = getImageUrl(product.images?.[0]);

                    return (
                      <tr
                        key={product._id}
                        className={dashboardTableRowClass()}
                      >
                        <td className="px-6 py-4">
                          <Image
                            src={imageUrl}
                            alt={product.name || "Product image"}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded object-cover"
                            unoptimized
                          />
                        </td>

                        <td className="max-w-[130px] truncate px-6 py-4">
                          {product._id}
                        </td>

                        <td className="max-w-[180px] truncate px-6 py-4">
                          {product.name}
                        </td>

                        <td className="px-6 py-4">{product.category}</td>
                        <td className="px-6 py-4">{product.brand}</td>
                        <td className="px-6 py-4">${product.price}</td>
                        <td className="px-6 py-4">{product.stock}</td>
                        <td className="px-6 py-4">{product.rating}</td>
                        <td className="px-6 py-4">{product.numReviews}</td>

                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "rounded px-2 py-1 text-xs",
                              product.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-400/10 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-400/10 dark:text-red-300",
                            )}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {isAdmin && (
                              <ModalTrigger onClick={() => startEdit(product)}>
                                <span className="inline-flex cursor-pointer items-center justify-center text-blue-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                                  <Pencil />
                                </span>
                              </ModalTrigger>
                            )}

                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => deleteProduct(product._id)}
                                className="text-red-500 transition-colors hover:text-red-600 dark:hover:text-red-400"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={page <= 1 || isLoading}
            onClick={goToPrevPage}
            className={dashboardButtonClass()}
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || isLoading}
            onClick={goToNextPage}
            className={dashboardButtonClass()}
          >
            Next
          </button>
        </div>

        {editingId && editedProduct && (
          <ModalBody>
            <ModalContent className="max-h-[80vh] space-y-4 overflow-y-auto p-6">
              <h2 className="mb-4 text-xl font-semibold">
                {isNewProduct ? "Add New Product" : "Edit Product"}
              </h2>

              {!isNewProduct && editedProduct.images?.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {editedProduct.images.map((img, index) => (
                    <Image
                      key={`${img}-${index}`}
                      src={getImageUrl(img)}
                      width={70}
                      height={70}
                      alt="Product image"
                      className="h-[70px] w-[70px] rounded border border-slate-200 object-cover dark:border-white/10"
                      unoptimized
                    />
                  ))}
                </div>
              )}

              {!isNewProduct && (
                <div>
                  <Label>ID</Label>
                  <Input value={editedProduct._id} disabled />
                </div>
              )}

              <div>
                <Label>Name</Label>
                <Input
                  value={editedProduct.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>

              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={editedProduct.price}
                  onChange={(e) => updateField("price", Number(e.target.value))}
                />
              </div>

              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={editedProduct.stock}
                  onChange={(e) => updateField("stock", Number(e.target.value))}
                />
              </div>

              <div>
                <Label>Brand</Label>
                <Input
                  value={editedProduct.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                />
              </div>

              <div>
                <Label>Category</Label>
                <Input
                  value={editedProduct.category}
                  onChange={(e) => updateField("category", e.target.value)}
                />
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  className={cn(
                    "w-full rounded border border-slate-300 bg-white p-2 text-slate-950",
                    "dark:border-white/10 dark:bg-[#05070d] dark:text-white",
                  )}
                  rows={4}
                  value={editedProduct.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Label>Active</Label>
                <input
                  type="checkbox"
                  checked={editedProduct.isActive}
                  className="accent-[#fe1929]"
                  onChange={(e) => updateField("isActive", e.target.checked)}
                />
              </div>

              <div>
                <Label>Product Images</Label>

                <div>{}</div>

                <FileUpload
                  onChange={(files) => {
                    setSelectedImages(files as File[]);
                  }}
                />

                {selectedImages.length > 0 ? (
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Selected {selectedImages.length} file(s):{" "}
                    {selectedImages.map((file) => file.name).join(", ")}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {isNewProduct
                      ? "Upload one or more images to create a product."
                      : "Upload images only if you want to replace/add product images."}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={saveEdit}
                  className={dashboardButtonClass(
                    isNewProduct
                      ? "border-green-600 bg-green-600 text-white hover:bg-green-700 dark:border-green-500 dark:bg-green-600 dark:hover:bg-green-500"
                      : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500",
                  )}
                >
                  {isNewProduct ? "Create Product" : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={cancelEdit}
                  className={dashboardButtonClass()}
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
