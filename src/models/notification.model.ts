export type NotificationType =
  | "COMMENT_ON_LESSON" // 클래스에 새로운 문의 댓글 등록 (선생님 수신)
  | "REPLY_ON_COMMENT" // 내 댓글에 답글 등록 (작성자/선생님 수신)
  | "PAYMENT_SUCCESS" // 수강생 결제 완료 (선생님 수신)
  | "PAYMENT_CANCELLED" // 수강생 결제 취소 (선생님 수신)
  | "LESSON_CANCELLED" // 클래스 폐강/취소 (수강생 전체 수신)
  | "REMINDER_24H" // 클래스 시작 24시간 전 (수강생 수신)
  | "REMINDER_1H" // 클래스 시작 1시간 전 (수강생 수신)
  | "REVIEW_REQUEST" // 클래스 종료 후 리뷰 요청 (수강생 수신)
  | "NEW_CHAT"; // 채팅 알림 (상대방 수신)

export interface Notification {
  id: number;
  lessonId: number;
  receiverId: number;
  senderId: number;
  targetId: number;
  senderNickname: string;
  type: NotificationType;
  lessonTitle: string;
  description: string;
  createdAt: string;
  readAt: string | null;
  isRead: boolean;
  // TODO: 알림 클릭 시 이동할 경로 등의 추가 정보 입력
}
