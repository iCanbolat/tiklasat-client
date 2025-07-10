import { CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  DeleteNotificationDto,
  MarkNotificationsReadDto,
} from "../-types";

interface NotificationsHeaderProps {
  onMarkAllAsRead: (data: MarkNotificationsReadDto) => void;
  onClearAll: (payload: DeleteNotificationDto) => void;
}

export function NotificationsHeader({
  onMarkAllAsRead,
  onClearAll,
}: NotificationsHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-3xl font-bold">Notifications</CardTitle>
          <CardDescription>
            Manage and view all your system notifications
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onMarkAllAsRead({
                all: true,
              })
            }
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onClearAll({ all: true })}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}
