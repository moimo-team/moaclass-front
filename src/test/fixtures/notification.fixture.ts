import type {
	NotificationListItemDto,
	NotificationType,
	NotificationUiItem,
} from '@/models/notification.model';

type NotificationFixtureOverrides = Partial<NotificationUiItem>;

const BASE_CREATED_AT = '2026-02-20T10:00:00.000Z';

export const ALL_NOTIFICATION_TYPES: NotificationType[] = [
	'PARTICIPATION_REQUEST',
	'PARTICIPATION_ACCEPTED',
	'PARTICIPATION_REJECTED',
	'PARTICIPATION_CANCELED',
	'MEETING_DELETED',
	'COMMENT_ON_LESSON',
	'REPLY_ON_COMMENT',
	'PAYMENT_SUCCESS',
	'PAYMENT_CANCELED',
	'LESSON_CANCELED',
	'REMINDER_24H',
	'REMINDER_1H',
	'REVIEW_REQUEST',
	'NEW_CHAT',
];

export const BASE_NOTIFICATION_BY_TYPE: Record<NotificationType, NotificationUiItem> = {
	PARTICIPATION_REQUEST: {
		id: 1,
		type: 'PARTICIPATION_REQUEST',
		message: '새로운 참여 신청이 있습니다.',
		linkId: 10,
		linkType: 'LESSON',
		isRead: false,
		readAt: null,
		createdAt: BASE_CREATED_AT,
	},
	PARTICIPATION_ACCEPTED: {
		id: 2,
		type: 'PARTICIPATION_ACCEPTED',
		message: '참여 신청이 승인되었습니다.',
		linkId: 11,
		linkType: 'MEETING',
		isRead: false,
		readAt: null,
		createdAt: BASE_CREATED_AT,
	},
	PARTICIPATION_REJECTED: {
		id: 3,
		type: 'PARTICIPATION_REJECTED',
		message: '참여 신청이 거절되었습니다.',
		linkId: 12,
		linkType: 'LESSON',
		isRead: false,
		readAt: null,
		createdAt: BASE_CREATED_AT,
	},
	PARTICIPATION_CANCELED: {
		id: 4,
		type: 'PARTICIPATION_CANCELED',
		message: '참여가 취소되었습니다.',
		linkId: 13,
		linkType: 'MEETING',
		isRead: false,
		readAt: null,
		createdAt: BASE_CREATED_AT,
	},
	MEETING_DELETED: {
		id: 5,
		type: 'MEETING_DELETED',
		message: '모임이 삭제되었습니다.',
		linkId: 14,
		linkType: 'MEETING',
		isRead: false,
		readAt: null,
		createdAt: BASE_CREATED_AT,
	},
	COMMENT_ON_LESSON: {
		id: 6,
		type: 'COMMENT_ON_LESSON',
		message: '클래스에 문의가 등록되었습니다.',
		linkId: 15,
		linkType: 'LESSON',
		isRead: false,
		readAt: null,
		createdAt: BASE_CREATED_AT,
	},
	REPLY_ON_COMMENT: {
		id: 7,
		type: 'REPLY_ON_COMMENT',
		message: '내 문의에 답글이 달렸습니다.',
		linkId: 16,
		linkType: 'LESSON',
		isRead: false,
		readAt: null,
		createdAt: BASE_CREATED_AT,
	},
	PAYMENT_SUCCESS: {
		id: 8,
		type: 'PAYMENT_SUCCESS',
		message: '결제가 완료되었습니다.',
		linkId: 17,
		linkType: 'LESSON',
		isRead: false,
		readAt: null,
		createdAt: BASE_CREATED_AT,
	},
	PAYMENT_CANCELED: {
		id: 9,
		type: 'PAYMENT_CANCELED',
		message: '결제가 취소되었습니다.',
		linkId: 18,
		linkType: 'LESSON',
		isRead: false,
		readAt: null,
		createdAt: BASE_CREATED_AT,
	},
	LESSON_CANCELED: {
		id: 10,
		type: 'LESSON_CANCELED',
		message: '클래스가 취소되었습니다.',
		linkId: 19,
		linkType: 'LESSON',
		isRead: false,
		readAt: null,
		createdAt: BASE_CREATED_AT,
	},
	REMINDER_24H: {
		id: 11,
		type: 'REMINDER_24H',
		message: '클래스 시작 24시간 전입니다.',
		linkId: 20,
		linkType: 'LESSON',
		isRead: false,
		readAt: null,
		createdAt: BASE_CREATED_AT,
	},
	REMINDER_1H: {
		id: 12,
		type: 'REMINDER_1H',
		message: '클래스 시작 1시간 전입니다.',
		linkId: 21,
		linkType: 'LESSON',
		isRead: false,
		readAt: null,
		createdAt: BASE_CREATED_AT,
	},
	REVIEW_REQUEST: {
		id: 13,
		type: 'REVIEW_REQUEST',
		message: '리뷰 작성을 요청합니다.',
		linkId: 22,
		linkType: 'LESSON',
		isRead: false,
		readAt: null,
		createdAt: BASE_CREATED_AT,
	},
	NEW_CHAT: {
		id: 14,
		type: 'NEW_CHAT',
		message: '새로운 채팅 메시지가 있습니다.',
		linkId: 23,
		linkType: 'LESSON',
		roomId: 101,
		senderNickname: '모멘티',
		lessonTitle: '도예 입문 클래스',
		isRead: false,
		readAt: null,
		createdAt: BASE_CREATED_AT,
	},
};

export const createNotificationFixture = (
	type: NotificationType,
	overrides: NotificationFixtureOverrides = {},
): NotificationUiItem => {
	return {
		...BASE_NOTIFICATION_BY_TYPE[type],
		...overrides,
	};
};

export const createNewChatNotificationFixture = (
	overrides: NotificationFixtureOverrides = {},
): NotificationUiItem => {
	return createNotificationFixture('NEW_CHAT', {
		roomId: 101,
		linkId: 23,
		linkType: 'LESSON',
		senderNickname: '모멘티',
		...overrides,
	});
};

export const createNotificationDtoFixture = (
	type: NotificationType,
	overrides: Partial<NotificationListItemDto> = {},
): NotificationListItemDto => {
	const base = BASE_NOTIFICATION_BY_TYPE[type];
	return {
		notificationId: base.id,
		type: base.type,
		message: base.message,
		isRead: base.isRead,
		createdAt: base.createdAt,
		readAt: base.readAt,
		metadata: {
			meetingId: base.linkType === 'MEETING' ? base.linkId : undefined,
			lessonId: base.linkType === 'LESSON' ? base.linkId : undefined,
			roomId: base.roomId,
			meetingTitle: base.meetingTitle,
			lessonTitle: base.lessonTitle,
		},
		...overrides,
	};
};
