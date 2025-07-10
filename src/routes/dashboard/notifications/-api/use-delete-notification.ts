import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axiosInstance";
import { queryClient } from "@/main";
import {
  notificationEndpoints,
  notificationQueryKeys,
  type DeleteNotificationDto,
  type NotificationQueryParams,
  type INotification,
} from "../-types";

export const useDeleteNotification = (filters: NotificationQueryParams) => {
  const queryKey = notificationQueryKeys.infinite(filters);

  return useMutation({
    mutationFn: async (payload: DeleteNotificationDto) => {
      const { method, url, response } = notificationEndpoints.delete(
        payload.id
      );
      const res = await axiosClient.request<typeof response>({
        method,
        url,
        data: { all: payload.all },
      });

      return res.data;
    },

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<
        {
          data: INotification[];
          pagination: any;
        }[]
      >(queryKey);

      queryClient.setQueryData(queryKey, (pages: any) => {
        if (!pages || !Array.isArray(pages)) return pages;

        return pages.map((page) => ({
          ...page,
          data: page.data.filter((n: INotification) => {
            if (payload.all) {
              return false;
            } else if (payload.id) {
              return n.id !== payload.id;
            }
            return true;
          }),
        }));
      });

      return { previous };
    },

    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
