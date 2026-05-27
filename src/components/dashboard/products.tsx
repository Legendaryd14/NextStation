"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import Image from "next/image";
import { ProductType } from "@/type/productRes";
import { BASE_URL } from "@/app/base";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "../ui/animated-modal";
import { Pencil } from "@gravity-ui/icons";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { GridPattern } from "../ui/file-upload";
import { cn } from "@/lib/utils";
import {
  dashboardButtonClass,
  dashboardMutedTextClass,
  dashboardPageClass,
  dashboardPanelClass,
  dashboardTableHeadClass,
  dashboardTableRowClass,
  dashboardTitleClass,
} from "./dashboardStyles";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<ProductType | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  // Fetch products with pagination
  const fetchProducts = async (pageNumber: number) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/products?page=${pageNumber}&limit=${limit}`,
      );
      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Fetch products error", err);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const startEdit = (product: ProductType) => {
    setEditingId(product._id);
    setEditedProduct({ ...product });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedProduct(null);
  };

  const saveEdit = () => {
    if (!editedProduct) return;

    setProducts((prev) =>
      prev.map((p) => (p._id === editedProduct._id ? editedProduct : p)),
    );

    cancelEdit();
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
        <h2 className={dashboardTitleClass("mb-6")}>Product Management</h2>

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
                    {/* IMAGE */}
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

                    {/* ID */}
                    <td className="px-6 py-4">{current.id}</td>

                    {/* NAME */}
                    <td className="px-6 py-4">{current.name}</td>

                    {/* CATEGORY */}
                    <td className="px-6 py-4">{current.category}</td>

                    {/* BRAND */}
                    <td className="px-6 py-4">{current.brand}</td>

                    {/* PRICE */}
                    <td className="px-6 py-4">${current.price}</td>

                    {/* STOCK */}
                    <td className="px-6 py-4">{current.stock}</td>

                    {/* RATING */}
                    <td className="px-6 py-4">{current.rating}</td>

                    {/* REVIEWS */}
                    <td className="px-6 py-4">{current.numReviews}</td>

                    {/* ACTIVE */}
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

                    {/* ACTIONS */}
                    <td className="px-6 py-4 flex gap-3">
                      {/* EDIT MODAL */}
                      <ModalTrigger onClick={() => startEdit(current)}>
                        <Pencil />
                      </ModalTrigger>

                      {/* MODAL BODY */}
                      <ModalBody>
                        <ModalContent className="space-y-4 max-h-[80vh] overflow-y-auto p-6">
                          {editedProduct ? (
                            <>
                              <h2 className="text-xl font-semibold mb-4">
                                Edit Product
                              </h2>

                              {/* PREVIEW IMAGES */}
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

                              {/* ID */}
                              <div>
                                <Label>ID</Label>
                                <Input value={editedProduct.id} disabled />
                              </div>

                              {/* NAME */}
                              <div>
                                <Label>Name</Label>
                                <Input
                                  value={editedProduct.name}
                                  onChange={(e) =>
                                    updateField("name", e.target.value)
                                  }
                                />
                              </div>

                              {/* PRICE */}
                              <div>
                                <Label>Price</Label>
                                <Input
                                  type="number"
                                  value={editedProduct.price}
                                  onChange={(e) =>
                                    updateField("price", Number(e.target.value))
                                  }
                                />
                              </div>

                              {/* STOCK */}
                              <div>
                                <Label>Stock</Label>
                                <Input
                                  type="number"
                                  value={editedProduct.stock}
                                  onChange={(e) =>
                                    updateField("stock", Number(e.target.value))
                                  }
                                />
                              </div>

                              {/* BRAND */}
                              <div>
                                <Label>Brand</Label>
                                <Input
                                  value={editedProduct.brand}
                                  onChange={(e) =>
                                    updateField("brand", e.target.value)
                                  }
                                />
                              </div>

                              {/* CATEGORY */}
                              <div>
                                <Label>Category</Label>
                                <Input
                                  value={editedProduct.category}
                                  onChange={(e) =>
                                    updateField("category", e.target.value)
                                  }
                                />
                              </div>

                              {/* DESCRIPTION */}
                              <div>
                                <Label>Description</Label>
                                <textarea
                                  className={cn(
                                    "w-full rounded border border-slate-300 bg-white p-2 text-slate-950",
                                    "dark:border-white/10 dark:bg-[#05070d] dark:text-white",
                                  )}
                                  rows={4}
                                  value={editedProduct.description}
                                  onChange={(e) =>
                                    updateField("description", e.target.value)
                                  }
                                />
                              </div>

                              {/* ACTIVE */}
                              <div className="flex items-center gap-2">
                                <Label>Active</Label>
                                <input
                                  type="checkbox"
                                  checked={editedProduct.isActive}
                                  className="accent-[#fe1929]"
                                  onChange={(e) =>
                                    updateField("isActive", e.target.checked)
                                  }
                                />
                              </div>

                              {/* FILE UPLOAD */}
                              <GridPattern />

                              {/* BUTTONS */}
                              <div className="flex justify-end gap-3 mt-6">
                                <button
                                  onClick={saveEdit}
                                  className={dashboardButtonClass(
                                    "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500",
                                  )}
                                >
                                  Save
                                </button>

                                <button
                                  onClick={cancelEdit}
                                  className={dashboardButtonClass()}
                                >
                                  Cancel
                                </button>
                              </div>
                            </>
                          ) : (
                            <p className={dashboardMutedTextClass("text-center")}>
                              Loading…
                            </p>
                          )}
                        </ModalContent>
                      </ModalBody>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="text-red-500 transition-colors hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
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
      </div>
    </Modal>
  );
}
