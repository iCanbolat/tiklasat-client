import type { ICategory } from "../../categories/-types";
import qs from "qs";

export enum ProductStatusEnum {
  ACTIVE = "ACTIVE",
  LOW_STOCK = "LOW_STOCK",
  ARCHIVED = "ARCHIVED",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}
export type ProductStatusType = `${ProductStatusEnum}`;

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  sku: string;
  status: ProductStatusType;
  stockUnderThreshold: number;
  isFeatured: boolean;
  isVariant: boolean;
  parentId: string;
  stockQuantity: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductImages {
  url: string;
}

export interface IProductAttributes {
  variantType: string;
  value: string;
}

export type ProductFilterQueryParams = {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  attributes?: { type: string; value: string }[];
  page?: number;
  pageSize?: number;
};

export type ProductServiceResponse = {
  product: IProduct;
  attributes?: IProductAttributes[];
  images?: IProductImages[];
  category?: ICategory;
};

export const productQueryKeys = {
  all: ["products"],
  list: (filters: Partial<ProductFilterQueryParams>) => ["products", filters],
  details: () => [...productQueryKeys.all, "detail"],
  detail: (id: string) => [...productQueryKeys.details(), id],
  pagination: (page: number) => [...productQueryKeys.all, "pagination", page],
  infinite: () => [...productQueryKeys.all, "infinite"],
} as const;

export const productEndpoints = {
  getAll: ({
    page = 1,
    pageSize = 10,
    ...rest
  }: Partial<ProductFilterQueryParams>) => {
    const query = qs.stringify(
      { page, pageSize, ...rest },
      { arrayFormat: "brackets" }
    );
    return {
      url: `products${query ? `?${query}` : ""}`,
      method: "GET" as const,
      response: {} as {
        data: ProductServiceResponse[];
        pagination: { total: number; page: any };
      },
    };
  },

  getOne: (id: string) => ({
    url: `products/${id}`,
    method: "GET" as const,
    response: {} as IProduct,
  }),
  create: (data: any) => ({
    url: "products",
    method: "POST" as const,
    response: {} as ICategory,
  }),
  update: (id: string) => ({
    url: `products/${id}`,
    method: "PATCH" as const,
    response: {} as IProduct,
  }),
  //   delete: (id: string, deleteProducts: boolean = false) => ({
  //     url: `products/${id}?deleteProducts=${deleteProducts}`,
  //     method: "DELETE" as const,
  //     response: { message: "" } as { message: string },
  //   }),
};
