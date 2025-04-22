export interface ICategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  imageUrl?: string | null;
  banner?: string | null;
  description?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  displayOrder: number;
  subcategories: ICategory[];
}

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  categoryId?: string;
}

export type GetCategoryResponse = {
  category: ICategory;
  products: IProduct[];
  parentCategories: ICategory[];
  subCategories: ICategory[];
};

export const categoryQueryKeys = {
  all: ["categories"],
  details: () => [...categoryQueryKeys.all, "detail"],
  detail: (id: string) => [...categoryQueryKeys.details(), id],
  pagination: (page: number) => [...categoryQueryKeys.all, "pagination", page],
  infinite: () => [...categoryQueryKeys.all, "infinite"],
} as const;

export const categoryEndpoints = {
  getAll: () => ({
    url: "categories",
    method: "GET" as const,
    response: [] as ICategory[],
  }),

  getOne: (id: string) => ({
    url: `categories/${id}`,
    method: "GET" as const,
    response: {} as GetCategoryResponse,
  }),
  create: () => ({
    url: "categories",
    method: "POST" as const,
    response: {} as ICategory,
  }),
  update: (id: string) => ({
    url: `categories/${id}`,
    method: "PATCH" as const,
    response: {} as ICategory,
  }),
  delete: (id: string, deleteProducts: boolean = false) => ({
    url: `categories/${id}?deleteProducts=${deleteProducts}`,
    method: "DELETE" as const,
    response: { message: "" } as { message: string },
  }),
};
