import { useQuery, queryOptions } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosInstance";
import { categoryEndpoints, categoryQueryKeys } from "../-types";
 
export const getCategoryByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: categoryQueryKeys.detail(id),
    queryFn: async () => {
      const { url, method, response } = categoryEndpoints.getOne(id);
      const res = await axiosClient.request<typeof response>({
        url,
        method,
      });
      return res.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
  });

export const useGetCategoryById = (id: string) => {
  return useQuery(getCategoryByIdQueryOptions(id));
};
