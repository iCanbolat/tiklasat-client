import { z } from "zod";

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const imageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Image must be less than 2MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, and .png formats are supported",
    }),
  url: z.string().url("Invalid URL format"),
  displayOrder: z.number().min(0),
  cloudinaryId: z.string().optional(),
});

export const productFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters" }),
  slug: z.string().min(2, { message: "Slug is required" }),
  sku: z.string().min(2, { message: "SKU is required" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  cost: z.coerce.number().positive({ message: "Price must be positive" }),
  images: z.array(imageSchema).optional(),
  parentId: z.string().optional(),
  category: categorySchema,
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

export type ProductCategoryValues = z.infer<typeof categorySchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;
