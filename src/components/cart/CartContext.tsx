"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartContextValue, CartItem, CartProduct } from "@/type/cart";
import { CartDrawer } from "./CartDrawer";

const CartContext = createContext<CartContextValue | null>(null);

type BackendCartProduct = {
  _id: string;
  name: string;
  image: string;
  stock: number;
  brand?: string;
  category?: string;
};

type BackendCartItem = {
  _id: string; // cart item id
  product: BackendCartProduct;
  price: number;
  quantity: number;
};

type BackendCartResponse = {
  success: boolean;
  data?: {
    items: BackendCartItem[];
    totalPrice?: number;
    totalItems?: number;
  };
  message?: string;
};

const getErrorMessage = async (response: Response) => {
  try {
    const result = (await response.json()) as { message?: string };
    return result.message || "Request failed";
  } catch {
    return "Request failed";
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemIdMap, setItemIdMap] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch("/api/cart", {
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401) {
        setItems([]);
        setItemIdMap({});
        return;
      }

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const result = (await response.json()) as BackendCartResponse;

      if (result.success && result.data) {
        const nextItemIdMap: Record<string, string> = {};

        const formattedItems: CartItem[] = result.data.items.map((item) => {
          const productId = item.product._id;

          nextItemIdMap[productId] = item._id;

          return {
            _id: productId,
            productId,
            name: item.product.name,
            image: item.product.image,
            price: item.price,
            quantity: item.quantity,
            stock: item.product.stock,
            brand: item.product.brand,
            category: item.product.category,
          };
        });

        setItems(formattedItems);
        setItemIdMap(nextItemIdMap);
      } else {
        setItems([]);
        setItemIdMap({});
      }
    } catch (error: unknown) {
      console.error("Cart fetch error:", error);
      setItems([]);
      setItemIdMap({});
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
    };

    void loadCart();
  }, [fetchCart]);

  const addItem = useCallback(
    async (product: CartProduct, quantity = 1) => {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product.productId,
          quantity,
        }),
      });

      if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
      }

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      await fetchCart();
    },
    [fetchCart],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      const cartItemId = itemIdMap[productId];
      if (!cartItemId) return;

      const response = await fetch(`/api/cart/remove/${cartItemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
      }

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      await fetchCart();
    },
    [itemIdMap, fetchCart],
  );

  const incrementItem = useCallback(
    async (productId: string) => {
      const item = items.find((i) => i.productId === productId);
      const cartItemId = itemIdMap[productId];

      if (!item || !cartItemId) return;

      const response = await fetch(`/api/cart/update/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          quantity: item.quantity + 1,
        }),
      });

      if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
      }

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      await fetchCart();
    },
    [items, itemIdMap, fetchCart],
  );

  const decrementItem = useCallback(
    async (productId: string) => {
      const item = items.find((i) => i.productId === productId);
      const cartItemId = itemIdMap[productId];

      if (!item || !cartItemId) return;

      if (item.quantity === 1) {
        await removeItem(productId);
        return;
      }

      const response = await fetch(`/api/cart/update/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          quantity: item.quantity - 1,
        }),
      });

      if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
      }

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      await fetchCart();
    },
    [items, itemIdMap, fetchCart, removeItem],
  );

  const clearCart = useCallback(async () => {
    const response = await fetch("/api/cart/clear", {
      method: "DELETE",
      credentials: "include",
    });

    if (response.status === 401) {
      setItems([]);
      setItemIdMap({});
      return;
    }

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    setItems([]);
    setItemIdMap({});
    await fetchCart();
  }, [fetchCart]);

  const getItemQuantity = useCallback(
    (productId: string) =>
      items.find((item) => item.productId === productId)?.quantity ?? 0,
    [items],
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      totalPrice,
      isOpen,
      setIsOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      incrementItem,
      decrementItem,
      clearCart,
      getItemQuantity,
    }),
    [
      items,
      totalItems,
      totalPrice,
      isOpen,
      addItem,
      removeItem,
      incrementItem,
      decrementItem,
      clearCart,
      getItemQuantity,
    ],
  );

  if (!hydrated) return null;

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }

  return ctx;
}
