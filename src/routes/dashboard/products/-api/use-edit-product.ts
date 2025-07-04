import { useMutation } from "@tanstack/react-query";
import type { ProductFormValues } from "../-components/product-form/validation-schema";
import {
  productEndpoints,
  productQueryKeys,
  type ProductResponseDto,
} from "../-types";
import { axiosClient } from "@/lib/axiosInstance";
import { toast } from "sonner";
import { queryClient } from "@/main";
import type { UseFormReturn } from "react-hook-form";

export const useEditProduct = (
  id: string,
  form: UseFormReturn<ProductFormValues>
) => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const { method, response, url, headers } = productEndpoints.update();
      const res = await axiosClient.request<typeof response>({
        method,
        url,
        data,
        headers,
      });

      console.log("axiosresdata", res.data);

      return res.data[0];
    },
    onSuccess: (updatedProduct) => {
      toast.success("Product updated!");

      console.log("hookpaylo", updatedProduct);
      
      const current = form.getValues();
      console.log("hookcateg", current);
      const {
        product: { category, attributes, images },
        ...rest
      } = updatedProduct;


      const mapped = {
        ...current,
        ...rest,
        category: category ? category : [],
        attributes:
          attributes?.map((attr: any) => ({
            id: attr.id,
            value: attr.value,
            variantType: attr.variantType,
          })) ?? [],
        images: images ?? [],
        relatedProducts: rest.relatedProducts?.map((p) => p.id),
      };
      form.reset(mapped);

      queryClient.setQueryData<ProductResponseDto>(
        productQueryKeys.detail(id),
        (old) => (old ? { ...old, ...updatedProduct } : updatedProduct)
      );

      queryClient.setQueryData<ProductResponseDto[]>(
        productQueryKeys.all,
        (oldProducts) => {
          if (!oldProducts) return oldProducts;
          return oldProducts.map((product) =>
            product.product.id === id
              ? { ...product, ...updatedProduct }
              : product
          );
        }
      );

      queryClient.invalidateQueries({ queryKey: productQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
    onError: (error) => {
      toast.error("An Error occured!");

      console.error("Error updating category:", error);
    },
  });
};
