import { axiosClient } from "@/lib/axiosInstance";
import { productEndpoints } from "../-types";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { toast } from "sonner";

const mutationFn = async (productIds: string[]) => {
  const { method, response, url } = productEndpoints.delete();
  const res = await axiosClient.delete<typeof response>(url, {
    method,
    data: { ids: productIds },
  });

  return res.data;
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product(s) deleted!");
    },
    onError: (error) => {
      toast.error("Err: Product(s) cannot deleted");
      console.error("❌ Product delete failed:", error);
    },
  });
};
