import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaCircle } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/dateFormat";
import type { Notification } from "@/models/notification.model";

export interface NotificationItemProps {
  notification: Notification;
  onClick: (notificationId: number) => void;
  onMarkAsRead: (notificationId: number) => void;
}

export const NotificationItem = ({
  notification,
  onClick,
  onMarkAsRead,
}: NotificationItemProps) => {
  return (
    <DropdownMenuItem
      onClick={() => onClick(notification.id)}
      className={cn("flex items-start gap-3 p-3 cursor-pointer w-full")}
    >
      {/* 붉은 점 */}
      <div className="w-2 h-2 mt-1">
        {!notification.isRead && (
          <FaCircle className="w-full h-full text-red-500" />
        )}
      </div>

      {/* 메세지 섹션 */}
      <div className="flex-grow flex flex-col gap-1">
        <div className="flex justify-between items-baseline">
          <span
            className={cn(
              "font-semibold text-sm line-clamp-1",
              notification.isRead ? "text-gray-500" : "text-foreground",
            )}
          >
            {notification.lessonTitle}
          </span>
          <span
            className={cn(
              "text-xs flex-shrink-0 ml-2",
              notification.isRead ? "text-gray-500" : "text-gray-400",
            )}
          >
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        <p
          className={cn(
            "text-xs line-clamp-2",
            notification.isRead ? "text-gray-500" : "text-gray-600",
          )}
        >
          {notification.description}
        </p>
      </div>

      {/* 읽음 버튼 */}
      <div className="w-10 flex-shrink-0 flex justify-end self-center">
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
          >
            읽음
          </Button>
        )}
      </div>
    </DropdownMenuItem>
  );
};

export default NotificationItem;
