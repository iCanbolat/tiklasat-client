import { useMutation } from "@tanstack/react-query";
import { categoryEndpoints, categoryQueryKeys } from "../-types";
import { axiosClient } from "@/lib/axiosInstance";
import type { CategoryFormValues } from "../-components/create-category-modal/validation-schema";
import type { ICategory } from "../-types";
import { queryClient } from "@/main";
import { toast } from "sonner";
import { nanoid } from "nanoid";

const mutationFn = async (data: CategoryFormValues) => {
  const { url, method, response } = categoryEndpoints.create(data);
  const res = await axiosClient.request<typeof response>({
    url,
    method,
    data,
  });
  return res.data;
};

export const useCreateCategory = () => {
  return useMutation({
    mutationFn,

    onMutate: async (newCategoryData) => {
      await queryClient.cancelQueries({ queryKey: categoryQueryKeys.all });

      const previousCategories = queryClient.getQueryData<ICategory[]>(
        categoryQueryKeys.all
      );

      const optimisticCategory: ICategory = {
        ...newCategoryData,
        id: nanoid(),
        subcategories: [],
      };

      queryClient.setQueryData<ICategory[]>(categoryQueryKeys.all, (old) => [
        ...(old || []),
        optimisticCategory,
      ]);

      return { previousCategories };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(
          categoryQueryKeys.all,
          context.previousCategories
        );
      }
      toast.error("Failed to create category");
    },

    onSuccess: () => {
      toast.success("Category created!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
    },
  });
};
