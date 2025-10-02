import qs from "qs";

export enum OrderStatusEnum {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatusEnum {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export type OrderStatusType = `${OrderStatusEnum}`;
export type PaymentStatusType = `${PaymentStatusEnum}`;

export interface IOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatusType;
  customerName: string;
  customerEmail: string;
  totalItems: string;
  totalPrice: string;
  paymentStatus: PaymentStatusType;
}

export interface OrderAnalytics {
  totalRevenue: number;
  totalOrders: number;
  cancellationRate: number;
  completionRate: number;
}

export interface OrderCountsByStatus {
  [key: string]: number;
}

export interface OrderPagination {
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrdersResponse {
  data: IOrder[];
  pagination: OrderPagination;
  orderCountsByStatus: OrderCountsByStatus;
  analytics: OrderAnalytics;
}

export type OrderFilterQueryParams = {
  page?: number;
  pageSize?: number;
  sortOrder?: "asc" | "desc";
  status?: OrderStatusType;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export const orderQueryKeys = {
  all: ["orders"],
  list: (filters: Partial<OrderFilterQueryParams>) => ["orders", filters],
  details: () => [...orderQueryKeys.all, "detail"],
  detail: (id: string) => [...orderQueryKeys.details(), id],
  pagination: (page: number) => [...orderQueryKeys.all, "pagination", page],
} as const;

export const orderEndpoints = {
  getAll: ({
    page = 1,
    pageSize = 10,
    sortOrder = "desc",
    ...rest
  }: Partial<OrderFilterQueryParams>) => {
    const query = qs.stringify(
      { page, pageSize, sortOrder, ...rest },
      { arrayFormat: "brackets" }
    );
    return {
      url: `orders${query ? `?${query}` : ""}`,
      method: "GET" as const,
      response: {} as OrdersResponse,
    };
  },

  getOne: (id: string) => ({
    url: `orders/${id}`,
    method: "GET" as const,
    response: {} as IOrder,
  }),

  update: (id: string) => ({
    url: `orders/${id}`,
    method: "PATCH" as const,
    response: {} as IOrder,
  }),

  delete: (id: string) => ({
    url: `orders/${id}`,
    method: "DELETE" as const,
    response: { message: "" } as { message: string },
  }),
};

export const orderStatusOptions = [
  { value: "all", label: "All Statuses" },
  { value: OrderStatusEnum.PENDING, label: "Pending" },
  { value: OrderStatusEnum.PROCESSING, label: "Processing" },
  { value: OrderStatusEnum.SHIPPED, label: "Shipped" },
  { value: OrderStatusEnum.DELIVERED, label: "Delivered" },
  { value: OrderStatusEnum.CANCELLED, label: "Cancelled" },
];
