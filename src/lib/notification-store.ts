import type { Notification } from "@/routes/dashboard/notifications/-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "date" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      notifications: [
        {
          id: "1",
          type: "order",
          title: "New Order Received",
          message: "Order #1234 has been placed for $129.99",
          read: false,
          date: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          link: "/orders/1234",
        },
        {
          id: "2",
          type: "inventory",
          title: "Low Stock Alert",
          message:
            "Product 'Wireless Headphones' is running low on stock (3 remaining)",
          read: false,
          date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          link: "/products/wireless-headphones",
        },
        {
          id: "3",
          type: "customer",
          title: "New Customer Registration",
          message: "John Doe has created a new account",
          read: true,
          date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          link: "/customers/john-doe",
        },
        {
          id: "4",
          type: "payment",
          title: "Payment Received",
          message: "Payment of $129.99 received for Order #1234",
          read: true,
          date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          link: "/payments/p-5678",
        },
        {
          id: "5",
          type: "system",
          title: "System Update",
          message: "The system will undergo maintenance in 24 hours",
          read: true,
          date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        },
      ],
      unreadCount: 2,
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: Math.random().toString(36).substring(2, 9),
          date: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },
      markAsRead: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.map(
            (notification) =>
              notification.id === id
                ? { ...notification, read: true }
                : notification
          );
          const unreadCount = updatedNotifications.filter(
            (n) => !n.read
          ).length;
          return { notifications: updatedNotifications, unreadCount };
        });
      },
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
          unreadCount: 0,
        }));
      },
      removeNotification: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.filter(
            (notification) => notification.id !== id
          );
          const unreadCount = updatedNotifications.filter(
            (n) => !n.read
          ).length;
          return { notifications: updatedNotifications, unreadCount };
        });
      },
      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },
    }),
    {
      name: "notifications-storage",
    }
  )
);
