import { axiosClient } from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import {
  productEndpoints,
  productQueryKeys,
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

    // onMutate: async (newProductData) => {
    //   await queryClient.cancelQueries({ queryKey: productQueryKeys.all });

    //   const previousCategories = queryClient.getQueryData<ProductResponseDto[]>(
    //     productQueryKeys.all
    //   );

    //   const optimisticProduct: ProductResponseDto = {
    //     product: {
    //       ...newProductData,
    //       id: crypto.randomUUID(),
    //       parentId: productId,
    //       currency: "",
    //       isVariant: false,
    //       isFeatured: newProductData.isFeatured ?? false,
    //       category: undefined,
    //       images: newProductData.images
    //         ? newProductData.images.map((image, idx) => ({
    //             url: image.url,
    //             displayOrder: idx,
    //             ...(image.cloudinaryId ? { cloudinaryId: image.cloudinaryId } : {})
    //           }))
    //         : []
    //     },
    //     variants: [],
    //   };

    //   queryClient.setQueryData<ProductResponseDto[]>(
    //     productQueryKeys.all,
    //     (old) => [...(old || []), optimisticProduct]
    //   );

    //   return { previousCategories };
    // },

    onSuccess: () => {
      toast.success("Product created!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
};
