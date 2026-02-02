import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosNotifications } from "react-icons/io";
import { Button } from "../ui/button";
import {
  type Notification,
  NotificationItem,
} from "@/components/features/notification/NotificationItem";
import { useState } from "react";

export const NotificationDropdown = () => {
  // TODO: 하드코딩된 알림 데이터 삭제
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      lessonId: 101,
      receiverId: 2,
      senderId: 3,
      senderNickname: "김강사",
      type: "COMMENT_ON_LESSON",
      meetingTitle: "초보자를 위한 강아지 훈련 교실",
      description:
        "새로운 문의 댓글이 등록되었습니다: '강아지 나이 제한이 있나요?'",
      createdAt: "2026-07-20T10:00:00Z",
      isUnread: true,
    },
    {
      id: 2,
      lessonId: 102,
      receiverId: 1,
      senderId: 4,
      senderNickname: "박수강",
      type: "PAYMENT_SUCCESS",
      meetingTitle: "여름맞이 비건 베이킹 클래스",
      description: "박수강님이 클래스 결제를 완료했습니다.",
      createdAt: "2026-07-19T14:30:00Z",
      isUnread: true,
    },
    {
      id: 3,
      lessonId: 103,
      receiverId: 5,
      senderId: 1,
      senderNickname: "최선생",
      type: "REPLY_ON_COMMENT",
      meetingTitle: "프로처럼 사진 찍는 법",
      description: "최선생님이 댓글에 답글을 남겼습니다.",
      createdAt: "2026-07-18T09:15:00Z",
      isUnread: false,
    },
    {
      id: 4,
      lessonId: 104,
      receiverId: 1,
      senderId: 6,
      senderNickname: "이강사",
      type: "REMINDER_24H",
      meetingTitle: "코딩 부트캠프 시작!",
      description:
        "내일 '코딩 부트캠프 시작!' 클래스가 시작됩니다. 준비물을 확인하세요!",
      createdAt: "2026-07-17T20:00:00Z",
      isUnread: true,
    },
  ]);

  const handleReadAll = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isUnread: false })),
    );
    console.log("모든 알림을 읽음 처리했습니다.");
  };

  const handleNotificationClick = (notificationId: number) => {
    // 알림 클릭 시 로직 실행
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isUnread: false } : notif,
      ),
    );
    // TODO: 알림 종류에 따라 특정 페이지로 이동하는 로직 추가 (useNavigate)
  };

  const handleMarkAsRead = (notificationId: number) => {
    // 읽음 버튼 눌러 특정 알림을 읽음 상태로 변경
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isUnread: false } : notif,
      ),
    );
  };

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  // TODO: 최신 알림 5 ~ 7개만 가져오고, 그 이전의 알림은 보이지 않게 하기
  // TODO: 전체 알림 페이지 만들어서 모든 알림 확인 가능한 기능도 만들지 고민하기

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
          <Avatar className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors border-none bg-medium">
            <AvatarImage alt="Notification Avatar" />
            <AvatarFallback className="bg-medium">
              <IoIosNotifications className="w-7 h-7 text-foreground/80" />
            </AvatarFallback>
          </Avatar>
          {unreadCount > 0 && (
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
            disabled={unreadCount === 0}
          >
            전체 읽음
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
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
