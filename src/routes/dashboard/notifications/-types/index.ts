export type NotificationType =
  | "order"
  | "inventory"
  | "customer"
  | "system"
  | "payment";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  date: string;
  link?: string;
  icon?: string;
}
