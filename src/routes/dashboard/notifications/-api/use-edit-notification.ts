import { useMutation } from "@tanstack/react-query";
import {
  notificationEndpoints,
  notificationQueryKeys,
  type INotification,
  type MarkNotificationsReadDto,
  type NotificationQueryParams,
} from "../-types";
import { axiosClient } from "@/lib/axiosInstance";
import { queryClient } from "@/main";

export const useEditNotification = (filters: NotificationQueryParams) => {
  const queryKey = notificationQueryKeys.infinite(filters);

  return useMutation({
    mutationFn: async (payload: MarkNotificationsReadDto) => {
      const { method, url, response } = notificationEndpoints.update(
        payload.id
      );
      const res = await axiosClient.request<typeof response>({
        method,
        url,
        data: { all: payload.all },
      });

      return res.data as INotification;
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
          data: page.data.map((n: INotification) =>
            payload.all || (payload.id && payload.id === n.id)
              ? { ...n, isRead: true }
              : n
          ),
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
