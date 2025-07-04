import {
  ArchiveIcon,
  CheckCircle2Icon,
  CircleXIcon,
  TriangleAlertIcon,
  type LucideProps,
} from "lucide-react";
import type { ICategory } from "../../categories/-types";
import qs from "qs";

export enum ProductStatusEnum {
  ACTIVE = "ACTIVE",
  LOW_STOCK = "LOW_STOCK",
  ARCHIVED = "ARCHIVED",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export type ProductStatusType = `${ProductStatusEnum}` | {};

type ProductStatusConfig = {
  label: string;
  color: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

export const ProductStatusConfigs: Record<
  ProductStatusEnum,
  ProductStatusConfig
> = {
  [ProductStatusEnum.ACTIVE]: {
    label: "Active",
    color: "success",
    icon: CheckCircle2Icon,
  },
  [ProductStatusEnum.LOW_STOCK]: {
    label: "Low Stock",
    color: "warning",
    icon: TriangleAlertIcon,
  },
  [ProductStatusEnum.ARCHIVED]: {
    label: "Archived",
    color: "info",
    icon: ArchiveIcon,
  },
  [ProductStatusEnum.OUT_OF_STOCK]: {
    label: "Out of Stock",
    color: "destructive",
    icon: CircleXIcon,
  },
};

export const productStatusOptions = [
  { value: "all", label: "All Statuses", icon: null },
  ...Object.values(ProductStatusEnum).map((value) => ({
    value,
    ...ProductStatusConfigs[value],
  })),
];

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  cost?: number;
  currency: string;
  sku?: string;
  attributes: { id: string; variantType: string; value: string }[];
  status: ProductStatusType;
  manageStock: boolean;
  allowBackorders: boolean;
  stockUnderThreshold?: number;
  isFeatured: boolean;
  isVariant: boolean;
  parentId?: string;
  stockQuantity: number;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductImages {
  url: string;
  displayOrder: number;
  cloudinaryId?: string;
}

export interface IProductAttributes {
  id: string;
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
  status?: ProductStatusType;
  search?: string;
};

export type ProductServiceResponse = {
  product: IProduct;
  attributes?: IProductAttributes[];
  images?: IProductImages[];
  category?: ICategory[];
};

export type IRelatedProduct = Pick<
  IProduct,
  "id" | "name" | "stockQuantity" | "price" | "isFeatured" | "status" | "sku"
> & {
  images?: IProductImages[];
  category?: ICategory[];
};

export type ProductResponseDto = {
  product: IProduct & {
    attributes: IProductAttributes[];
    images: IProductImages[];
    category?: ICategory[];
  };
  variants?: IProduct[];
  relatedProducts?: IRelatedProduct[];
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
        pagination: { totalRecords: number; page: number; pageSize: number };
      },
    };
  },
  uploadImage: () => ({
    url: `cloudinary/upload`,
    method: "POST" as const,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    response: {} as {
      url: string;
      public_id: string;
    },
  }),

  deleteImage: (publicId: string) => ({
    url: `cloudinary/${publicId}`,
    method: "DELETE" as const,
    response: {} as { success: boolean; message: string },
  }),

  getOne: (id: string) => ({
    url: `products/${id}`,
    method: "GET" as const,
    response: {} as ProductResponseDto,
  }),
  create: () => ({
    url: "products",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST" as const,
    response: {} as ProductResponseDto,
  }),
  update: () => ({
    url: `products`,
    method: "PATCH" as const,
    response: {} as ProductResponseDto[],
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
  delete: () => ({
    url: `products`,
    method: "DELETE" as const,
    response: { message: "" } as { message: string },
  }),
};
