import { axiosClient } from "@/lib/axiosInstance";
import {
  productEndpoints,
  productQueryKeys,
  type IProduct,
  type ProductResponseDto,
  type ProductServiceResponse,
} from "../-types";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { toast } from "sonner";

type DeleteProductsContext = {
  previousProductsList?: ProductServiceResponse[];
  previousParentProduct?: ProductResponseDto;
};
const mutationFn = async (productIds: string[]) => {
  const { method, response, url } = productEndpoints.delete();
  const res = await axiosClient.delete<typeof response>(url, {
    method,
    data: { ids: productIds },
  });

  return res.data;
};

export const useDeleteProduct = (parentProductId?: string) => {
  return useMutation({
    mutationFn,
    onMutate: async (productIds) => {
      await queryClient.cancelQueries({ queryKey: productQueryKeys.all });
      if (parentProductId) {
        await queryClient.cancelQueries({
          queryKey: productQueryKeys.detail(parentProductId),
        });
      }

      const previousProductsList = queryClient.getQueryData<
        ProductServiceResponse[]
      >(productQueryKeys.all);

      let previousParentProduct: ProductResponseDto | undefined;
      let previousVariantsList: IProduct[] | undefined;
      if (parentProductId) {
        previousParentProduct = queryClient.getQueryData<ProductResponseDto>(
          productQueryKeys.detail(parentProductId)
        );
        previousVariantsList = previousParentProduct?.variants;
      }

      queryClient.setQueryData<ProductServiceResponse[]>(
        productQueryKeys.all,
        (old) => old?.filter((p) => !productIds.includes(p.product.id)) ?? []
      );

      if (parentProductId && previousParentProduct) {
        queryClient.setQueryData<ProductResponseDto>(
          productQueryKeys.detail(parentProductId),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              variants:
                old.variants?.filter((v) => !productIds.includes(v.id)) ?? [],
            };
          }
        );
        return {
          previousProductsList,
          previousParentProduct,
          previousVariantsList,
        };
      }
    },

    onError: (
      error,
      productIds,
      context: DeleteProductsContext | undefined
    ) => {
      toast.error(
        `Failed to delete ${productIds.length > 1 ? "products" : "product"}`
      );
      console.error("Deletion error:", error);

      if (context?.previousProductsList) {
        queryClient.setQueryData(
          productQueryKeys.all,
          context.previousProductsList
        );
      }

      if (parentProductId && context?.previousParentProduct) {
        queryClient.setQueryData(
          productQueryKeys.detail(parentProductId),
          context.previousParentProduct
        );
      }
    },

    onSuccess: (_, productIds) => {
      toast.success(
        `${productIds.length > 1 ? "Products" : "Product"} deleted successfully!`
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.detail(parentProductId ?? ""),
      });
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      });
    },
  });
};
