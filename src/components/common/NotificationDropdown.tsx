import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosNotifications } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/components/features/notification/NotificationItem";
import { useNotificationQuery } from "@/hooks/useNotificationQuery";
import {
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "@/hooks/useNotificationMutations";
import { Skeleton } from "@/components/ui/skeleton";

export const NotificationDropdown = () => {
  const { data: notifications, isLoading, isError } = useNotificationQuery();

  const markAsReadMutation = useMarkAsReadMutation();
  const markAllAsReadMutation = useMarkAllAsReadMutation();

  const handleNotificationClick = (notificationId: number) => {
    markAsReadMutation.mutate(notificationId);
    // TODO: 알림 종류에 따라 특정 페이지로 이동하는 로직 추가 (useNavigate)
  };

  const handleMarkAsRead = (notificationId: number) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleReadAll = () => {
    markAllAsReadMutation.mutate();
  };

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  if (isLoading) {
    return (
      <button className="relative">
        <Skeleton className="h-10 w-10 rounded-full" />
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
          <Avatar className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors border-none bg-medium">
            <AvatarImage alt="Notification Avatar" />
            <AvatarFallback className="bg-medium">
              <IoIosNotifications
                className={`w-7 h-7 ${isError ? "text-red-500" : "text-foreground/80"}`}
              />
            </AvatarFallback>
          </Avatar>
          {unreadCount > 0 && !isError && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white ring-2 ring-background">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>최근 알림</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 text-xs"
            onClick={handleReadAll}
            disabled={
              unreadCount === 0 || markAllAsReadMutation.isPending || isError
            }
          >
            전체 읽음
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isError ? (
          <DropdownMenuLabel className="text-center text-red-500">
            알림을 불러오는 데 실패했습니다.
          </DropdownMenuLabel>
        ) : notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        ) : (
          <DropdownMenuLabel className="text-center text-gray-500">
            새로운 알림이 없습니다.
          </DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
