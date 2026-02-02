import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaCircle } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/dateFormat";

type NotificationType =
  | "COMMENT_ON_LESSON" // 클래스에 새로운 문의 댓글 등록 (선생님 수신)
  | "REPLY_ON_COMMENT" // 내 댓글에 답글 등록 (작성자/선생님 수신)
  | "PAYMENT_SUCCESS" // 수강생 결제 완료 (선생님 수신)
  | "PAYMENT_CANCELLED" // 수강생 결제 취소 (선생님 수신)
  | "LESSON_CANCELLED" // 클래스 폐강/취소 (수강생 전체 수신)
  | "REMINDER_24H" // 클래스 시작 24시간 전 (수강생 수신)
  | "REMINDER_1H" // 클래스 시작 1시간 전 (수강생 수신)
  | "REVIEW_REQUEST" // 클래스 종료 후 리뷰 요청 (수강생 수신)
  | "NEW_CHAT"; // 채팅 알림 (상대방 수신)

// TODO: 실제 알림 API에 맞춰 수정하기
export interface Notification {
  id: number;
  lessonId: number;
  receiverId: number;
  senderId: number;
  senderNickname: string;
  type: NotificationType;
  meetingTitle: string;
  description: string;
  createdAt: string;
  isUnread: boolean;
  // TODO: 알림 클릭 시 이동할 경로 등의 추가 정보 입력
}

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
        {notification.isUnread && (
          <FaCircle className="w-full h-full text-red-500" />
        )}
      </div>

      {/* 메세지 섹션 */}
      <div className="flex-grow flex flex-col gap-1">
        <div className="flex justify-between items-baseline">
          <span
            className={cn(
              "font-semibold text-sm line-clamp-1",
              notification.isUnread ? "text-foreground" : "text-gray-500",
            )}
          >
            {notification.meetingTitle}
          </span>
          <span
            className={cn(
              "text-xs flex-shrink-0 ml-2",
              notification.isUnread ? "text-gray-400" : "text-gray-500",
            )}
          >
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        <p
          className={cn(
            "text-xs line-clamp-2",
            notification.isUnread ? "text-gray-600" : "text-gray-500",
          )}
        >
          {notification.description}
        </p>
      </div>

      {/* 읽음 버튼 */}
      <div className="w-10 flex-shrink-0 flex justify-end self-center">
        {notification.isUnread && (
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
