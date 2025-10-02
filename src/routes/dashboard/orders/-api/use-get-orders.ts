import {
  useQuery,
  keepPreviousData,
  queryOptions,
} from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosInstance";
import {
  orderEndpoints,
  orderQueryKeys,
  type OrdersResponse,
  type OrderFilterQueryParams,
} from "../-types";

export const getOrdersQueryOptions = (
  params: Partial<OrderFilterQueryParams>
) =>
  queryOptions({
    queryKey: orderQueryKeys.list(params),
    queryFn: async (): Promise<OrdersResponse> => {
      const endpoint = orderEndpoints.getAll(params);
      const { data } = await axiosClient.get<OrdersResponse>(endpoint.url);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData, // Keep previous data while fetching new data
  });

export const useGetOrders = (params: Partial<OrderFilterQueryParams> = {}) => {
  return useQuery(getOrdersQueryOptions(params));
};
