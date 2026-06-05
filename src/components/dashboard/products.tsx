"use client";

import { useEffect, useState } from "react";

import { Trash2 } from "lucide-react";

import Image from "next/image";

import { ProductType, ProductsResponse, getTotalPages } from "@/type/product";

import { BASE_URL } from "@/app/base";

import { productsApi } from "@/lib/api";

import { useIsAdmin } from "@/lib/admin";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "../ui/animated-modal";

import { Pencil } from "@gravity-ui/icons";

import { Label } from "../ui/label";

import { Input } from "../ui/input";

import { FileUpload } from "../ui/file-upload";

import { cn } from "@/lib/utils";

import {
  dashboardButtonClass,
  dashboardPageClass,
  dashboardPanelClass,
  dashboardTableHeadClass,
  dashboardTableRowClass,
  dashboardTitleClass,
} from "./dashboardStyles";

export default function ProductsPage() {
  const isAdmin = useIsAdmin();

  const [products, setProducts] = useState<ProductType[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [editedProduct, setEditedProduct] = useState<ProductType | null>(null);

  const [isNewProduct, setIsNewProduct] = useState(false);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchProducts = async (pageNumber: number) => {
    try {
      const res = (await productsApi.list({
        page: pageNumber,
        limit,
      })) as ProductsResponse & {
        data: ProductType[];
      };

      setError("");

      setProducts(res.data ?? []);

      setTotalPages(getTotalPages(res));
    } catch (err) {
      console.error("Fetch products error", err);

      setError("Unable to load products.");
    }
  };

  useEffect(() => {
    void fetchProducts(page);
  }, [page]);

  const deleteProduct = async (id: string) => {
    if (!isAdmin) return;

    try {
      await productsApi.delete(id);

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error", err);

      setError("Failed to delete product. Admin access required.");
    }
  };

  const startEdit = (product: ProductType) => {
    setEditingId(product._id);

    setEditedProduct({ ...product });

    setSelectedImages([]);

    setIsNewProduct(false);
  };

  const startAddProduct = () => {
    setEditingId("new");

    const emptyProduct = {
      _id: "new",

      id: 0,

      name: "",

      description: "",

      category: "",

      brand: "",

      price: 0,

      stock: 0,

      rating: 0,

      numReviews: 0,

      isActive: true,

      images: [],
    } as unknown as ProductType;

    setEditedProduct(emptyProduct);

    setSelectedImages([]);

    setIsNewProduct(true);
  };

  const cancelEdit = () => {
    setEditingId(null);

    setEditedProduct(null);

    setSelectedImages([]);

    setIsNewProduct(false);
  };

  const saveEdit = async () => {
    if (!editedProduct || !isAdmin) return;

    try {
      if (isNewProduct) {
        const { _id, id, ...payload } = editedProduct;
        void _id;
        void id;

        const createPayload = new FormData();
        createPayload.append("name", editedProduct.name ?? "");
        createPayload.append("description", editedProduct.description ?? "");
        createPayload.append("price", String(editedProduct.price ?? 0));
        createPayload.append("category", editedProduct.category ?? "");
        createPayload.append("brand", editedProduct.brand ?? "");
        createPayload.append("stock", String(editedProduct.stock ?? 0));
        createPayload.append("isActive", String(editedProduct.isActive));

        if (!selectedImages.length) {
          throw new Error("At least one product image is required");
        }

        selectedImages.forEach((file) => {
          createPayload.append("images", file);
        });

        const res = (await productsApi.create(createPayload)) as {
          data: ProductType;
        };

        setProducts((prev) => [res.data, ...prev]);
      } else {
        const updatePayload = new FormData();
        updatePayload.append("name", editedProduct.name ?? "");
        updatePayload.append("description", editedProduct.description ?? "");
        updatePayload.append("price", String(editedProduct.price ?? 0));
        updatePayload.append("category", editedProduct.category ?? "");
        updatePayload.append("brand", editedProduct.brand ?? "");
        updatePayload.append("stock", String(editedProduct.stock ?? 0));
        updatePayload.append("isActive", String(editedProduct.isActive));

        selectedImages.forEach((file) => {
          updatePayload.append("images", file);
        });

        await productsApi.update(editedProduct._id, updatePayload);

        setProducts((prev) =>
          prev.map((p) => (p._id === editedProduct._id ? editedProduct : p)),
        );
      }

      cancelEdit();

      setError("");
    } catch (err) {
      console.error("Save error", err);

      setError("Failed to save product. Admin access required.");
    }
  };

  const updateField = (
    field: keyof ProductType,

    value: string | number | boolean,
  ) => {
    if (!editedProduct) return;

    setEditedProduct({ ...editedProduct, [field]: value } as ProductType);
  };

  return (
    <Modal>
      <div className={dashboardPageClass()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={dashboardTitleClass()}>Product Management</h2>

          {isAdmin && (
            <ModalTrigger onClick={startAddProduct}>
              <button
                className={cn(
                  dashboardButtonClass(),

                  "border-green-600 bg-green-600 text-white hover:bg-green-700 dark:border-green-500 dark:bg-green-600 dark:hover:bg-green-500",
                )}
              >
                + Add Product
              </button>
            </ModalTrigger>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* TABLE */}

        <div className={dashboardPanelClass()}>
          <table className="w-full">
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
              {products.map((product) => {
                const isEditing = editingId === product._id;

                const current = isEditing ? editedProduct! : product;

                const imageUrl = current.images?.[0]
                  ? `${BASE_URL}${current.images[0]}`
                  : "/placeholder.png";

                return (
                  <tr key={product._id} className={dashboardTableRowClass()}>
                    <td className="px-6 py-4">
                      <Image
                        src={imageUrl}
                        alt={current.name}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                        unoptimized
                      />
                    </td>

                    <td className="px-6 py-4">{current.id}</td>

                    <td className="px-6 py-4">{current.name}</td>

                    <td className="px-6 py-4">{current.category}</td>

                    <td className="px-6 py-4">{current.brand}</td>

                    <td className="px-6 py-4">${current.price}</td>

                    <td className="px-6 py-4">{current.stock}</td>

                    <td className="px-6 py-4">{current.rating}</td>

                    <td className="px-6 py-4">{current.numReviews}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          current.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-400/10 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-400/10 dark:text-red-300"
                        }`}
                      >
                        {current.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 flex gap-3">
                      {isAdmin && (
                        <ModalTrigger onClick={() => startEdit(current)}>
                          <button className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Pencil />
                          </button>
                        </ModalTrigger>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="text-red-500 transition-colors hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={dashboardButtonClass()}
          >
            Prev
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={dashboardButtonClass()}
          >
            Next
          </button>
        </div>

        {editingId && editedProduct && (
          <ModalBody>
            <ModalContent className="space-y-4 max-h-[80vh] overflow-y-auto p-6">
              <h2 className="text-xl font-semibold mb-4">
                {isNewProduct ? "Add New Product" : "Edit Product"}
              </h2>

              <div className="flex gap-3 flex-wrap">
                {editedProduct.images?.map((img, i) => (
                  <Image
                    key={i}
                    src={`${BASE_URL}${img}`}
                    width={70}
                    height={70}
                    alt=""
                    className="rounded border border-slate-200 dark:border-white/10"
                    unoptimized
                  />
                ))}
              </div>

              {!isNewProduct && (
                <div>
                  <Label>ID</Label>

                  <Input value={editedProduct.id} disabled />
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
                <FileUpload onChange={(files) => setSelectedImages(files)} />
                {selectedImages.length > 0 ? (
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Selected {selectedImages.length} file(s):{" "}
                    {selectedImages.map((file) => file.name).join(", ")}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Upload one or more images to create or update a product.
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={saveEdit}
                  className={dashboardButtonClass(
                    isNewProduct
                      ? "border-green-600 bg-green-600 text-white hover:bg-green-700 dark:border-green-500 dark:bg-green-600 dark:hover:bg-green-500"
                      : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500",
                  )}
                >
                  {isNewProduct ? "Create Product" : "Save Changes"}
                </button>

                <button onClick={cancelEdit} className={dashboardButtonClass()}>
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
