import { axiosClient } from "@/lib/axiosInstance";
import { categoryEndpoints, type ICategory } from "../-types";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { categoryQueryKeys } from "../-types";
import { toast } from "sonner";

type DeleteCategoryArgs = {
  id: string;
  deleteProducts?: boolean;
};

export const deleteCategoryById = async ({
  id,
  deleteProducts = false,
}: DeleteCategoryArgs) => {
  const { url, method, response } = categoryEndpoints.delete(
    id,
    deleteProducts
  );

  const res = await axiosClient.request<typeof response>({
    url,
    method,
  });

  return res.data;
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: deleteCategoryById,

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: categoryQueryKeys.all });

      const previousCategories = queryClient.getQueryData<ICategory[]>(
        categoryQueryKeys.all
      );

      queryClient.setQueryData<ICategory[]>(
        categoryQueryKeys.all,
        (old) => old?.filter((category) => category.id !== id) ?? []
      );

      return { previousCategories, id };
    },

    onError: (error, _variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(
          categoryQueryKeys.all,
          context.previousCategories
        );
      }
      toast.error("Failed to delete category");
      console.error("Delete error:", error);
    },

    onSuccess: (_data, { id }) => {
      toast.success("Category deleted!");
      queryClient.removeQueries({ queryKey: categoryQueryKeys.detail(id) });
    },

    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.detail(id) });
    },
  });
};
