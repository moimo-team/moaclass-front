import { describe, expect, it } from 'vitest';

import {
	resolveNotificationNavigation,
	resolveNotificationTitle,
} from '@/constants/notificationActions';
import {
	ALL_NOTIFICATION_TYPES,
	createNewChatNotificationFixture,
	createNotificationFixture,
} from '@/test/fixtures/notification.fixture';

// 타입별 제목/이동 정책이 명세대로 유지되는지 검증

describe('notificationActions', () => {
	it('formats NEW_CHAT title with room info and sender', () => {
		const notification = createNewChatNotificationFixture({
			linkType: 'LESSON',
			lessonTitle: '목공 원데이',
			senderNickname: '모멘티',
		});

		const title = resolveNotificationTitle(notification);
		expect(title.startsWith('[')).toBe(true);
		expect(title.includes('목공 원데이')).toBe(true);
		expect(title.includes('모멘티')).toBe(true);
	});

	it('returns lessonTitle for non-chat types when present', () => {
		const notification = createNotificationFixture('PARTICIPATION_REQUEST', {
			lessonTitle: '레슨 제목',
		});

		expect(resolveNotificationTitle(notification)).toBe('레슨 제목');
	});

	it('returns fallback title when no title exists', () => {
		const notification = createNotificationFixture('PAYMENT_SUCCESS', {
			lessonTitle: undefined,
			meetingTitle: undefined,
		});

		expect(resolveNotificationTitle(notification).length).toBeGreaterThan(0);
	});

	it.each([
		['PARTICIPATION_REQUEST', 'MEETING', 1, '/mypage/meetings/hosting/1/participations'],
		['PARTICIPATION_REQUEST', 'LESSON', 1, '/classes-manage'],
		['PARTICIPATION_ACCEPTED', 'MEETING', 1, '/meetings/1'],
		['PARTICIPATION_ACCEPTED', 'LESSON', 1, '/lessons/1'],
		['PARTICIPATION_REJECTED', 'MEETING', 1, '/mypage/meetings/join'],
		['PARTICIPATION_REJECTED', 'LESSON', 1, '/mypage/class/orders'],
		['PARTICIPATION_CANCELED', 'MEETING', 1, '/mypage/meetings/hosting'],
		['PARTICIPATION_CANCELED', 'LESSON', 1, '/classes-manage'],
		['MEETING_DELETED', 'MEETING', 1, '/mypage/meetings/join'],
		['COMMENT_ON_LESSON', 'LESSON', 1, '/lessons/1'],
		['REPLY_ON_COMMENT', 'LESSON', 1, '/lessons/1'],
		['PAYMENT_SUCCESS', 'LESSON', 1, '/mypage/class/profit'],
		['PAYMENT_CANCELED', 'LESSON', 1, '/mypage/class/profit'],
		['LESSON_CANCELED', 'LESSON', 1, '/mypage/class/orders'],
		['REMINDER_24H', 'LESSON', 1, '/lessons/1'],
		['REMINDER_1H', 'LESSON', 1, '/lessons/1'],
		['REVIEW_REQUEST', 'LESSON', 1, '/lessons/1'],
	] as const)('resolves navigation: %s %s', (type, linkType, linkId, expectedPath) => {
		const notification = createNotificationFixture(type, {
			linkType,
			linkId,
		});

		expect(resolveNotificationNavigation(notification)).toEqual({ path: expectedPath });
	});

	it.each(ALL_NOTIFICATION_TYPES)(
		'returns navigation object when link data is missing: %s',
		(type) => {
			const notification = createNotificationFixture(type, {
				linkType: undefined,
				linkId: undefined,
			});

			const navigation = resolveNotificationNavigation(notification);
			expect(navigation).not.toBeNull();
			expect(navigation?.path.length).toBeGreaterThan(0);
		},
	);
});
