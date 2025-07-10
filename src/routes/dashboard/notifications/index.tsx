import React, { useRef, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { NotificationType } from "./-types";
import { NotificationsFilters } from "./-components/notification-filters";
import { NotificationsHeader } from "./-components/notification-header";
import { NotificationItem } from "./-components/notification-item";
import { useInfiniteNotifications } from "./-api/use-get-notifications";
import { useDebounce } from "@/hooks/use-debounce";
import { useEditNotification } from "./-api/use-edit-notification";
import { useDeleteNotification } from "./-api/use-delete-notification";

export const Route = createFileRoute("/dashboard/notifications/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  // const socket = io("http://localhost:8080");
  // socket.on("connect", () => {
  //   console.log("✅ Connected to notification socket");
  // });

  // socket.on("notification", (data) => {
  //   console.log("🔔 New notification:", data);
  // });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");

  const [selectedTypes, setSelectedTypes] = useState<NotificationType[]>([
    NotificationType.CUSTOMER,
    NotificationType.INVENTORY,
    NotificationType.ORDER,
    NotificationType.PAYMENT,
  ]);

  const scrollRef = useRef(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const filters = {
    search: debouncedSearchQuery.length >= 2 ? debouncedSearchQuery : undefined,
    isRead:
      activeTab === "all" ? undefined : activeTab === "read" ? true : false,
    types: selectedTypes,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteNotifications(filters);

  const { mutateAsync: markAsRead } = useEditNotification(filters);

  const { mutateAsync: removeNotification } = useDeleteNotification(filters);

  const notifications = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead({ id });
    if (link) {
      navigate({ to: link });
    }
  };

  const toggleNotificationType = (type: NotificationType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const tabs = [
    {
      value: "all",
      emptyStateRender: () => (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Bell className="mb-2 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-medium">No notifications found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search or filter criteria"
              : "You don't have any notifications yet"}
          </p>
        </div>
      ),
    },
    {
      value: "unread",
      emptyStateRender: () => (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <CheckCheck className="mb-2 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-medium">No unread notifications</h3>
          <p className="text-sm text-muted-foreground">You're all caught up!</p>
        </div>
      ),
    },
    {
      value: "read",
      emptyStateRender: () => (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Bell className="mb-2 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-medium">No read notifications</h3>
          <p className="text-sm text-muted-foreground">
            You haven't read any notifications yet
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <NotificationsHeader
            onMarkAllAsRead={markAsRead}
            onClearAll={removeNotification}
          />
        </CardHeader>
        <CardContent>
          <NotificationsFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTypes={selectedTypes}
            onToggleType={toggleNotificationType}
          />

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "all" | "unread" | "read")
            }
            className="w-full"
          >
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread" className="flex items-center gap-2">
                Unread
                {unreadNotifications.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {unreadNotifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {notifications.length > 0 ? (
                  <ScrollArea className="h-[400px] w-full" ref={scrollRef}>
                    <div className="space-y-0">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={markAsRead}
                            onRemove={removeNotification}
                            onClick={handleNotificationClick}
                          />
                        </motion.div>
                      ))}
                      <motion.div
                        onViewportEnter={() => {
                          if (hasNextPage && !isFetchingNextPage)
                            fetchNextPage();
                        }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ root: scrollRef, once: true }}
                        className="flex justify-center p-4"
                      >
                        {isFetchingNextPage && (
                          <Loader2 className="animate-spin" />
                        )}
                      </motion.div>
                    </div>
                  </ScrollArea>
                ) : (
                  tab.emptyStateRender()
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
