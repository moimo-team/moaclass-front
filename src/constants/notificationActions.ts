import type { NotificationUiItem } from '@/models/notification.model';

export type NotificationNavigation = {
	path: string;
	state?: Record<string, number | string | undefined>;
};

export const resolveNotificationTitle = (notification: NotificationUiItem): string => {
	if (notification.type === 'NEW_CHAT') {
		const category = notification.linkType === 'MEETING' ? '모임 채팅' : '클래스 문의';
		const roomTitle = notification.lessonTitle ?? notification.meetingTitle ?? '채팅방';
		const sender = notification.senderNickname ? ` · ${notification.senderNickname}님` : '';
		return `[${category}] ${roomTitle}${sender} 새 메시지`;
	}

	if (notification.lessonTitle) return notification.lessonTitle;
	if (notification.meetingTitle) return notification.meetingTitle;
	return '새로운 알림';
};

export const resolveNotificationNavigation = (
	notification: NotificationUiItem,
): NotificationNavigation | null => {
	const { type, linkType, linkId } = notification;

	switch (type) {
		case 'PARTICIPATION_REQUEST':
			if (linkType === 'MEETING' && linkId) {
				return { path: `/mypage/meetings/hosting/${linkId}/participations` };
			}
			if (linkType === 'LESSON') return { path: '/classes-manage' };
			return { path: '/mypage' };

		case 'PARTICIPATION_ACCEPTED':
			if (linkType === 'MEETING' && linkId) return { path: `/meetings/${linkId}` };
			if (linkType === 'LESSON' && linkId) return { path: `/lessons/${linkId}` };
			return { path: '/mypage' };

		case 'PARTICIPATION_REJECTED':
			if (linkType === 'MEETING') return { path: '/mypage/meetings/join' };
			if (linkType === 'LESSON') return { path: '/mypage/class/orders' };
			return { path: '/mypage' };

		case 'PARTICIPATION_CANCELED':
			if (linkType === 'MEETING') return { path: '/mypage/meetings/hosting' };
			if (linkType === 'LESSON') return { path: '/classes-manage' };
			return { path: '/mypage' };

		case 'MEETING_DELETED':
			return { path: '/mypage/meetings/join' };

		case 'COMMENT_ON_LESSON':
		case 'REPLY_ON_COMMENT':
		case 'REMINDER_24H':
		case 'REMINDER_1H':
		case 'REVIEW_REQUEST':
			if (linkId) return { path: `/lessons/${linkId}` };
			return { path: '/mypage' };

		case 'PAYMENT_SUCCESS':
		case 'PAYMENT_CANCELED':
			return { path: '/mypage/class/profit' };

		case 'LESSON_CANCELED':
			return { path: '/mypage/class/orders' };

		default:
			if (linkType === 'MEETING' && linkId) return { path: `/meetings/${linkId}` };
			if (linkType === 'LESSON' && linkId) return { path: `/lessons/${linkId}` };
			return { path: '/mypage' };
	}
};
