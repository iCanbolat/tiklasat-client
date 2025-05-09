import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  productEndpoints,
  productQueryKeys,
  type ProductFilterQueryParams,
} from "../-types";
import { axiosClient } from "@/lib/axiosInstance";

export const queryFn = async (params: Partial<ProductFilterQueryParams>) => {
  const { url, method, response } = productEndpoints.getAll(params);
  return (await axiosClient.request<typeof response>({ url, method })).data;
};

export const useGetProducts = (filters: Partial<ProductFilterQueryParams>) => {
  return useQuery({
    queryKey: productQueryKeys.list(filters), // e.g. ['products', { categorySlug: 'shoes' }]
    queryFn: () => queryFn(filters),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
