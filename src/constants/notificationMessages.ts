import type { NotificationType, NotificationUiItem } from '@/models/notification.model';

const DEFAULT_MESSAGE_BY_TYPE: Record<NotificationType, string> = {
	PARTICIPATION_REQUEST: '새로운 참여 신청이 있습니다.',
	PARTICIPATION_ACCEPTED: '참여 신청이 승인되었습니다.',
	PARTICIPATION_REJECTED: '참여 신청이 거절되었습니다.',
	PARTICIPATION_CANCELED: '참여가 취소되었습니다.',
	MEETING_DELETED: '모임이 삭제되었습니다.',
	COMMENT_ON_LESSON: '클래스에 새로운 문의가 등록되었습니다.',
	REPLY_ON_COMMENT: '내 문의에 답글이 등록되었습니다.',
	PAYMENT_SUCCESS: '결제가 완료되었습니다.',
	PAYMENT_CANCELED: '결제가 취소되었습니다.',
	LESSON_CANCELED: '클래스가 취소되었습니다.',
	REMINDER_24H: '클래스 시작 24시간 전입니다.',
	REMINDER_1H: '클래스 시작 1시간 전입니다.',
	REVIEW_REQUEST: '리뷰 작성 요청이 도착했습니다.',
	NEW_CHAT: '새로운 채팅 메시지가 있습니다.',
};

export const getDefaultNotificationMessage = (type: NotificationType): string => {
	return DEFAULT_MESSAGE_BY_TYPE[type] ?? '새로운 알림이 도착했습니다.';
};

export const resolveNotificationMessage = (
	item: Pick<NotificationUiItem, 'type' | 'message' | 'description'>,
): string => {
	return item.message ?? item.description ?? getDefaultNotificationMessage(item.type);
};
