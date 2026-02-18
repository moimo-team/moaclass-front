export type NotificationType =
	| 'PARTICIPATION_REQUEST' // 참가 신청
	| 'PARTICIPATION_ACCEPTED' // 참가 수락
	| 'PARTICIPATION_REJECTED' // 참가 거절
	| 'PARTICIPATION_CANCELLED' //참가취소
	| 'MEETING_DELETED' //미팅삭제
	| 'COMMENT_ON_LESSON' // 클래스에 새로운 문의 댓글 등록 (선생님 수신)
	| 'REPLY_ON_COMMENT' // 내 댓글에 답글 등록 (작성자/선생님 수신)
	| 'PAYMENT_SUCCESS' // 수강생 결제 완료 (선생님 수신)
	| 'PAYMENT_CANCELLED' // 수강생 결제 취소 (선생님 수신)
	| 'LESSON_CANCELLED' // 클래스 폐강/취소 (수강생 전체 수신)
	| 'REMINDER_24H' // 클래스 시작 24시간 전 (수강생 수신)
	| 'REMINDER_1H' // 클래스 시작 1시간 전 (수강생 수신)
	| 'REVIEW_REQUEST' // 클래스 종료 후 리뷰 요청 (수강생 수신)
	| 'NEW_CHAT'; // 채팅 알림 (상대방 수신)

export type NotificationLinkType = 'MEETING' | 'LESSON';

// REST 알림 목록 응답과 socket 실시간 알림 payload를 함께 표현하는 통합 타입
export interface Notification {
	id: number;
	type: NotificationType;
	message?: string;
	roomId?: number;
	linkId?: number;
	linkType?: NotificationLinkType;

	// 동시 호환을 위한 옵셔널
	lessonId?: number;
	receiverId?: number;
	senderId?: number;
	targetId?: number;
	senderNickname?: string;
	lessonTitle?: string;
	description?: string;

	createdAt: string;
	readAt: string | null;
	isRead: boolean;
}
