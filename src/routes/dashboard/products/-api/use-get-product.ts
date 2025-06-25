import { queryOptions, useQuery } from "@tanstack/react-query";
import { productEndpoints, productQueryKeys } from "../-types";
import { axiosClient } from "@/lib/axiosInstance";

const queryFn = async (id: string) => {
  const { url, method, response } = productEndpoints.getOne(id);
  return (await axiosClient.request<typeof response>({ url, method })).data;
};

export const getProductByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => queryFn(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    // refetchOnWindowFocus: false,
    // retry: false,
  });

export const useGetProduct = (id: string) => {
  return useQuery(getProductByIdQueryOptions(id));
};
