import { useInfiniteQuery } from "@tanstack/react-query";
import { notificationEndpoints, type NotificationQueryParams } from "../-types";
import { axiosClient } from "@/lib/axiosInstance";

export const useInfiniteNotifications = (filters: NotificationQueryParams) => {
  return useInfiniteQuery({
    queryKey: ["infinite-notifications", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { url, method, response } = notificationEndpoints.getAll({
        page: pageParam,
        pageSize: 3,
        search: filters.search,
        isRead: filters.isRead,
        types: filters.types,
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
