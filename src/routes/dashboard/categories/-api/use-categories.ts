import { axiosClient } from "@/lib/axiosInstance";
import { queryOptions } from "@tanstack/react-query";
import { categoryEndpoints, categoryQueryKeys } from "../-types";

export const getCategoriesFn = async () => {
  const { url, method, response } = categoryEndpoints.getAll();
  return (await axiosClient.request<typeof response>({ url, method })).data;
};

export const useCategories = queryOptions({
  queryKey: categoryQueryKeys.all,
  queryFn: getCategoriesFn,
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
  retry: false,
});

