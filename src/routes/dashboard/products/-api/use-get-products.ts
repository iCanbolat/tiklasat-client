import {
  keepPreviousData,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
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

export const getProductsQueryOptions = (
  filters: Partial<ProductFilterQueryParams>
) => {
  return queryOptions({
    queryKey: productQueryKeys.list(filters),
    queryFn: () => queryFn(filters),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export const useGetProducts = (filters: Partial<ProductFilterQueryParams>) => {
  return useQuery(getProductsQueryOptions(filters));
};

export const useInfiniteProducts = (filters: {
  search?: string;
  category?: string;
  status?: string;
}) => {
  return useInfiniteQuery({
    queryKey: ["infinite-products", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { url, method, response } = productEndpoints.getAll({
        page: pageParam,
        pageSize: 10,
        search: filters.search,
        categorySlug: filters.category !== "all" ? filters.category : undefined,
        status: filters.status !== "all" ? [filters.status] : undefined,
      });

      const res = await axiosClient.request<typeof response>({
        method,
        url,
      });

      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(
        lastPage.pagination.totalRecords / lastPage.pagination.pageSize
      );
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
