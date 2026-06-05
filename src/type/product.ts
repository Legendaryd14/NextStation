// types/product.ts
export interface ProductResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Product[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  brand: string;
  rating: number;
  numReviews: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type GetProductsParams = {
  search?: string;
  category?: string;
  brand?: string;
  id?: string;
  limit?: string;
  page?: string;
};
export type Param = {
  category?: string;
  brand?: string;
  search?: string;
  page?: string;
};
