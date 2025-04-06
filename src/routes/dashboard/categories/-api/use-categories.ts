import { axiosClient } from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { categoryEndpoints, categoryQueryKeys } from "../-types";

export const getCategoriesFn = async () => {
  const { url, method, response } = categoryEndpoints.getAll();
  return (await axiosClient.request<typeof response>({ url, method })).data;
};

export const useCategories = () => {
  return useQuery({
    queryKey: [categoryQueryKeys.all],
    queryFn: getCategoriesFn,
  });
};
