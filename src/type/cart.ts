export type CartProduct = {
  _id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  brand?: string;
  category?: string;
};

export type CartItem = CartProduct & {
  quantity: number;
};

export type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
};
