import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNotificationsStore } from "@/lib/notification-store";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import type { NotificationType } from "./-types";
import { NotificationsFilters } from "./-components/notification-filters";
import { NotificationsHeader } from "./-components/notification-header";
import { NotificationItem } from "./-components/notification-item";

export const Route = createFileRoute("/dashboard/notifications/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<NotificationType[]>([
    "order",
    "inventory",
    "customer",
    "system",
    "payment",
  ]);

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      navigate({ to: link });
    }
  };

  const toggleNotificationType = (type: NotificationType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredNotifications = notifications.filter(
    (notification) =>
      selectedTypes.includes(notification.type) &&
      (notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const unreadNotifications = filteredNotifications.filter((n) => !n.read);
  const readNotifications = filteredNotifications.filter((n) => n.read);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <NotificationsHeader
            onMarkAllAsRead={markAllAsRead}
            onClearAll={clearAll}
          />
        </CardHeader>
        <CardContent>
          <NotificationsFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTypes={selectedTypes}
            onToggleType={toggleNotificationType}
          />

          <Tabs defaultValue="all" className="w-full">
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

            <TabsContent value="all">
              <Card>
                <CardContent className="p-0">
                  {filteredNotifications.length > 0 ? (
                    <ScrollArea className="h-[400px] w-full">
                      <div className="space-y-0">
                        {filteredNotifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            id={notification.id}
                            title={notification.title}
                            message={notification.message}
                            type={notification.type}
                            date={notification.date}
                            read={notification.read}
                            link={notification.link}
                            onMarkAsRead={markAsRead}
                            onRemove={removeNotification}
                            onClick={handleNotificationClick}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <Bell className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-medium">
                        No notifications found
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery
                          ? "Try adjusting your search or filter criteria"
                          : "You don't have any notifications yet"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unread">
              <Card>
                <CardContent className="p-0">
                  {unreadNotifications.length > 0 ? (
                    <ScrollArea className="h-[400px] w-full">
                      <div className="space-y-0">
                        {unreadNotifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            id={notification.id}
                            title={notification.title}
                            message={notification.message}
                            type={notification.type}
                            date={notification.date}
                            read={notification.read}
                            link={notification.link}
                            onMarkAsRead={markAsRead}
                            onRemove={removeNotification}
                            onClick={handleNotificationClick}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <CheckCheck className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-medium">
                        No unread notifications
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You're all caught up!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="read">
              <Card>
                <CardContent className="p-0">
                  {readNotifications.length > 0 ? (
                    <ScrollArea className="h-[400px] w-full">
                      <div className="space-y-0">
                        {readNotifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            id={notification.id}
                            title={notification.title}
                            message={notification.message}
                            type={notification.type}
                            date={notification.date}
                            read={notification.read}
                            link={notification.link}
                            onMarkAsRead={markAsRead}
                            onRemove={removeNotification}
                            onClick={handleNotificationClick}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <Bell className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-medium">
                        No read notifications
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You haven't read any notifications yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
