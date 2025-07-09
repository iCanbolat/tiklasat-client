import qs from "qs";

export enum NotificationType {
  ORDER = "ORDER",
  INVENTORY = "INVENTORY",
  CUSTOMER = "CUSTOMER",
  SYSTEM = "SYSTEM",
  PAYMENT = "PAYMENT",
}
// | "ORDER"
// | "INVENTORY"
// | "CUSTOMER"
// | "SYSTEM"
// | "PAYMENT";

export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  icon?: string;
}

export type NotificationQueryParams = {
  search?: string;
  page?: number;
  pageSize?: number;
  isRead?: boolean;
  types?: NotificationType[];
};

export type MarkNotificationsReadDto = {
  id?: string;
  all?: boolean;
};

export const notificationQueryKeys = {
  all: ["notifications"],
  list: (filters: Partial<NotificationQueryParams>) => [
    "notifications",
    filters,
  ],
  infinite: (filters: NotificationQueryParams) => [
    ...notificationQueryKeys.all,
    "infinite",
    filters,
  ],
} as const;

export const notificationEndpoints = {
  getAll: ({
    page = 1,
    pageSize = 10,
    ...rest
  }: Partial<NotificationQueryParams>) => {
    const query = qs.stringify(
      { page, pageSize, ...rest },
      { arrayFormat: "brackets" }
    );
    return {
      url: `notifications${query ? `?${query}` : ""}`,
      method: "GET" as const,
      response: {} as {
        data: INotification[];
        pagination: { totalRecords: number; page: number; pageSize: number };
      },
    };
  },

  update: (id?: string) => ({
    url: `notifications/${id}`,
    method: "PATCH" as const,
    response: {} as INotification,
  }),

  delete: () => ({
    url: `products`,
    method: "DELETE" as const,
    response: { message: "" } as { message: string },
  }),
};
