import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Category name must be at least 2 characters" })
    .max(50, { message: "Category name must be less than 50 characters" }),
  slug: z
    .string()
    .min(2, { message: "Slug must be at least 2 characters" })
    .max(50, { message: "Slug must be less than 50 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),
  parentId: z.string().nullable(),
  productsCount: z.number().default(0).optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  image: z.string().nullable(),
  metaTitle: z
    .string()
    .max(60, { message: "Meta title must be less than 60 characters" })
    .optional(),
  metaDescription: z
    .string()
    .max(160, { message: "Meta description must be less than 160 characters" })
    .optional(),
  metaKeywords: z
    .string()
    .max(200, { message: "Meta keywords must be less than 200 characters" })
    .optional(),
  displayOrder: z.number().int(),
  banner: z.string().nullable().optional(),
});

export const tabSchema = z.object({
  tab: z
    .enum(["subcategories", "products", "details", "seo", "display"])
    .default("details"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
