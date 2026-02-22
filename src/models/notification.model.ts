import type { PaginationMeta } from '@/models/pagination.model';

export type NotificationType =
	| 'PARTICIPATION_REQUEST' // 참가 신청
	| 'PARTICIPATION_ACCEPTED' // 참가 수락
	| 'PARTICIPATION_REJECTED' // 참가 거절
	| 'PARTICIPATION_CANCELED' //참가취소
	| 'MEETING_DELETED' //미팅삭제
	| 'COMMENT_ON_LESSON' // 클래스에 새로운 문의 댓글 등록 (선생님 수신)
	| 'REPLY_ON_COMMENT' // 내 댓글에 답글 등록 (작성자/선생님 수신)
	| 'PAYMENT_SUCCESS' // 수강생 결제 완료 (선생님 수신)
	| 'PAYMENT_CANCELED' // 수강생 결제 취소 (선생님 수신)
	| 'LESSON_CANCELED' // 클래스 폐강/취소 (수강생 전체 수신)
	| 'REMINDER_24H' // 클래스 시작 24시간 전 (수강생 수신)
	| 'REMINDER_1H' // 클래스 시작 1시간 전 (수강생 수신)
	| 'REVIEW_REQUEST' // 클래스 종료 후 리뷰 요청 (수강생 수신)
	| 'NEW_CHAT'; // 채팅 알림 (상대방 수신)

export type NotificationLinkType = 'MEETING' | 'LESSON';

export interface NotificationUiItem {
	id: number;
	type: NotificationType;
	message?: string;
	roomId?: number;
	linkId?: number;
	linkType?: NotificationLinkType;

	lessonId?: number;
	receiverId?: number;
	senderId?: number;
	targetId?: number;
	senderNickname?: string;
	lessonTitle?: string;
	meetingTitle?: string;
	description?: string;

	createdAt: string;
	readAt: string | null;
	isRead: boolean;
}

export interface NotificationSocketPayload {
	id: number;
	type: NotificationType;
	message?: string;
	linkId?: number;
	linkType?: NotificationLinkType;
	roomId?: number;
	senderNickname?: string;
	lessonTitle?: string;
	meetingTitle?: string;
	description?: string;
}

export interface NotificationMetadata {
	meetingId?: number;
	meetingTitle?: string;
	lessonId?: number;
	lessonTitle?: string;
	roomId?: number;
}

// REST Type
export interface NotificationListItemDto {
	notificationId: number;
	type: NotificationType;
	message?: string;
	isRead: boolean;
	createdAt: string;
	readAt?: string | null;
	metadata?: NotificationMetadata;
}

export type Notification = NotificationUiItem;

export type NewChatNotification = NotificationUiItem & {
	type: 'NEW_CHAT';
	roomId: number;
};

export const isNewChatNotification = (
	notification: NotificationUiItem,
): notification is NewChatNotification => {
	return notification.type === 'NEW_CHAT' && typeof notification.roomId === 'number';
};

export interface FetchNotificationsResponse {
	data: NotificationUiItem[];
	meta: PaginationMeta;
}
