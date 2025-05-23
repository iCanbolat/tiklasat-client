import type { ProductFormValues } from "@/routes/dashboard/products/-components/product-form/validation-schema";
import { useForm, type UseFormReturn } from "react-hook-form";
import { create } from "zustand";

interface ProductStore {
  isCreateModalOpen: boolean;
  selectedCategoryId: string | null;
  form: UseFormReturn<ProductFormValues>

  openCreateModal: () => void;
  closeCreateModal: () => void;
  // View state
  viewCategoryDetails: (id: string) => void;
}

export const useCategoryStore = create<ProductStore>((set) => ({
  isCreateModalOpen: false,
  selectedCategoryId: null,
  form: useForm<ProductFormValues, any, ProductFormValues>({
      resolver: zodResolver(productFormSchema),
      defaultValues: {
        name: data?.product.name,
        slug: data?.product.slug,
        sku: data?.product.sku ?? "",
        price: data?.product.price,
        cost: data?.product.cost ?? 0,
        allowBackorders: data?.product.allowBackorders ?? false,
        manageStock: data?.product.manageStock ?? true,
        stockQuantity: data?.product.stockQuantity,
        stockUnderThreshold: data?.product.stockUnderThreshold ?? 10,
        category: data?.product.category,
        parentId: data?.product.parentId,
        description: data?.product.description,
        status: data?.product.status,
        isFeatured: data?.product.isFeatured ?? false,
        images: data?.product.images ?? [],
        metaTitle: data?.product.metaTitle,
        metaDescription: data?.product.metaDescription,
        metaKeywords: data?.product.metaKeywords,
      },
    }),
  openCreateModal: () => {
    set({ isCreateModalOpen: true });
  },

  closeCreateModal: () => {
    set({ isCreateModalOpen: false });
  },

  viewCategoryDetails: (id: string) => {
    set({ selectedCategoryId: id });
  },
}));
