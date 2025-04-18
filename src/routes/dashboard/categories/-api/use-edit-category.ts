import { axiosClient } from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { categoryEndpoints, categoryQueryKeys, type ICategory } from "../-types";
import type { CategoryFormValues } from "../-components/create-category-modal/validation-schema";
import { queryClient } from "@/main";

export const useEditCategory = (id: string, options?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  return useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const { url, method, response } = categoryEndpoints.update(id);
      const res = await axiosClient.request<typeof response>({
        url,
        method,
        data,
      });
      return res.data;
    },
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData<ICategory>(categoryQueryKeys.detail(id), (old) =>
        old ? { ...old, ...updatedCategory } : updatedCategory
      );

      queryClient.setQueryData<ICategory[]>(categoryQueryKeys.all, (oldCategories) => {
        if (!oldCategories) return oldCategories;
        return oldCategories.map((category) =>
          category.id === id ? { ...category, ...updatedCategory } : category
        );
      });

      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });

      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      options?.onError?.();
    },
  });
};

