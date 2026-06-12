export type ProductPayload = {
  name: string;
  description: string;
  price: number;
  images: (File | string)[];
  category: string;
  stock: number;
  brand: string;
  rating?: number;
  numReviews?: number;
  isActive: boolean;
};

export type ProductResponse = {
  success: boolean;
  data: {
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
  };
};

export type ApiPaginatedResponse<T> = {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
};

export type ApiSingleResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type ApiMessageResponse = {
  success: boolean;
  message?: string;
};
