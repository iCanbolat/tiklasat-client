import { z } from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters" }),
  slug: z.string().min(2, { message: "Slug is required" }),
  sku: z.string().min(2, { message: "SKU is required" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  images: z
    .array(
      z.object({
        url: z.string(),
      })
    )
    .optional(),
  parentId: z.string().optional(),
  category: z.string().min(1, { message: "Category is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  isFeatured: z.boolean().default(false).optional(),
  stock: z.coerce
    .number()
    .int({ message: "Stock must be an integer" })
    .nonnegative({ message: "Stock cannot be negative" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  metaTitle: z
    .string()
    .max(60, { message: "Meta title must be less than 60 characters" })
    .optional(),
  metaDescription: z
    .string()
    .max(160, { message: "Meta description must be less than 160 characters" })
    .optional(),
  metaKeywords: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
