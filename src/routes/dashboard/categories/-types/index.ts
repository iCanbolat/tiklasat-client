export interface ICategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  parentId?: string;
  subcategories: ICategory[];
}

export const categoryQueryKeys = {
  all: ["categories"],
  details: () => [...categoryQueryKeys.all, "detail"],
  detail: (id: number) => [...categoryQueryKeys.details(), id],
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
    response: {} as ICategory,
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
  delete: (id: string) => ({
    url: `categories/${id}`,
    method: "DELETE" as const,
    response: {} as ICategory,
  })
};
