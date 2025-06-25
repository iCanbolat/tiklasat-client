import { axiosClient } from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import {
  productEndpoints,
  productQueryKeys,
  type ProductResponseDto,
} from "../-types";
import { toast } from "sonner";
import { queryClient } from "@/main";
import { useParams } from "@tanstack/react-router";

const mutationFn = async (data: FormData) => {
  const { method, response, url, headers } = productEndpoints.create(data);
  const res = await axiosClient.request<typeof response>({
    method,
    url,
    data,
    headers,
  });

  return res.data;
};

export const useCreateProduct = () => {
  const { productId } = useParams({ strict: false });

  return useMutation({
    mutationFn,
    onSuccess: (updatedProduct) => {
      if (productId)
        queryClient.setQueryData<ProductResponseDto>(
          productQueryKeys.detail(productId),
          (old) => (old ? { ...old, ...updatedProduct } : updatedProduct)
        );

      queryClient.setQueryData<ProductResponseDto[]>(
        productQueryKeys.all,
        (oldProducts) => {
          if (!oldProducts) return oldProducts;
          return oldProducts.map((product) =>
            product.product.id === productId
              ? { ...product, ...updatedProduct }
              : product
          );
        }
      );

      toast.success("Product created!");
    },

    onSettled: () => {
      if (productId)
        queryClient.invalidateQueries({
          queryKey: productQueryKeys.detail(productId),
        });

      queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
};
