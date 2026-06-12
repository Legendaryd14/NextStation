import { useApi } from "@/hooks/useAPI";
import type { Product } from "@/hooks/useProductsApi";

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  price?: number;
};

export type Cart = {
  id?: string;
  user?: string;
  items: CartItem[];
  totalPrice?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CartResponse = {
  success: boolean;
  message?: string;
  data: {
    cart: Cart;
  };
};

export type AddToCartPayload = {
  productId: string;
  quantity: number;
};

export type UpdateCartItemPayload = {
  quantity: number;
};

export function useCartApi() {
  const api = useApi();

  const getCart = () => {
    return api.get<CartResponse>("/cart");
  };

  const addToCart = (payload: AddToCartPayload) => {
    return api.post<CartResponse>("/cart", payload);
  };

  const updateCartItem = (itemId: string, payload: UpdateCartItemPayload) => {
    return api.put<CartResponse>(`/cart/${itemId}`, payload);
  };

  const removeFromCart = (itemId: string) => {
    return api.delete<CartResponse>(`/cart/${itemId}`);
  };

  const clearCart = () => {
    return api.delete<CartResponse>("/cart");
  };

  return {
    ...api,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
}
