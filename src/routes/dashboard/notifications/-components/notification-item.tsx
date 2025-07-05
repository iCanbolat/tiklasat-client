"use client";

import { Clock, Check, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NotificationType } from "../-types";

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  read: boolean;
  link?: string;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
  onClick: (id: string, link?: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "order":
      return (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-700"
        >
          Order
        </Badge>
      );
    case "inventory":
      return (
        <Badge
          variant="outline"
          className="border-amber-200 bg-amber-50 text-amber-700"
        >
          Inventory
        </Badge>
      );
    case "customer":
      return (
        <Badge
          variant="outline"
          className="border-green-200 bg-green-50 text-green-700"
        >
          Customer
        </Badge>
      );
    case "system":
      return (
        <Badge
          variant="outline"
          className="border-red-200 bg-red-50 text-red-700"
        >
          System
        </Badge>
      );
    case "payment":
      return (
        <Badge
          variant="outline"
          className="border-emerald-200 bg-emerald-50 text-emerald-700"
        >
          Payment
        </Badge>
      );
    default:
      return <Badge variant="outline">Other</Badge>;
  }
};

export function NotificationItem({
  id,
  title,
  message,
  type,
  date,
  read,
  link,
  onMarkAsRead,
  onRemove,
  onClick,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex cursor-pointer flex-col border-b p-4 transition-colors hover:bg-muted/50 last:border-b-0",
        !read && "border-l-4 border-l-primary bg-muted/30"
      )}
      onClick={() => onClick(id, link)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {getNotificationIcon(type)}
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </span>
          <div className="flex items-center gap-1">
            {!read && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(id);
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
