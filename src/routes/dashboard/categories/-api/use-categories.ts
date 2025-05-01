import { axiosClient } from "@/lib/axiosInstance";
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { categoryEndpoints, categoryQueryKeys } from "../-types";

export const getCategoriesFn = async () => {
  const { url, method, response } = categoryEndpoints.getAll();
  return (await axiosClient.request<typeof response>({ url, method })).data;
};

export const categoryOptions = queryOptions({
  queryKey: categoryQueryKeys.all,
  queryFn: getCategoriesFn,
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
  retry: false,
});

export const useCategories = () => {
  return useQuery(categoryOptions);
};

export const useCategoriesSuspense = () => {
  return useSuspenseQuery(categoryOptions);
};
