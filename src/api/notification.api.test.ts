import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/api/client';
import { fetchNotifications, mapNotificationDtoToUiItem } from '@/api/notification.api';
import {
	createNotificationDtoFixture,
	createNotificationFixture,
} from '@/test/fixtures/notification.fixture';

// 백엔드 응답 DTO를 UI 모델로 변환하는 매핑 로직 검증
// REST 응답 구조 변경 시 프론트 매핑 깨짐을 조기에 발견

vi.mock('@/api/client', () => ({
	apiClient: {
		get: vi.fn(),
	},
}));

describe('notification.api', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('maps dto to ui item with lesson metadata', () => {
		const dto = createNotificationDtoFixture('COMMENT_ON_LESSON', {
			notificationId: 123,
			metadata: {
				lessonId: 45,
				lessonTitle: '도예 클래스',
				roomId: 77,
			},
			readAt: undefined,
		});

		const mapped = mapNotificationDtoToUiItem(dto);
		expect(mapped.id).toBe(123);
		expect(mapped.linkId).toBe(45);
		expect(mapped.linkType).toBe('LESSON');
		expect(mapped.roomId).toBe(77);
		expect(mapped.readAt).toBeNull();
		expect(mapped.lessonTitle).toBe('도예 클래스');
	});

	it('maps dto to ui item with meeting metadata', () => {
		const dto = createNotificationDtoFixture('PARTICIPATION_ACCEPTED', {
			metadata: {
				meetingId: 11,
				meetingTitle: '주말 독서 모임',
			},
		});

		const mapped = mapNotificationDtoToUiItem(dto);
		expect(mapped.linkId).toBe(11);
		expect(mapped.linkType).toBe('MEETING');
		expect(mapped.meetingTitle).toBe('주말 독서 모임');
	});

	it('returns ui item as-is when ui shape is passed', () => {
		const uiItem = createNotificationFixture('PAYMENT_SUCCESS', {
			id: 999,
		});

		const mapped = mapNotificationDtoToUiItem(uiItem);
		expect(mapped).toEqual(uiItem);
	});

	it('fetchNotifications maps list payload to ui shape', async () => {
		const dto = createNotificationDtoFixture('REMINDER_24H', {
			notificationId: 50,
			metadata: { lessonId: 101 },
		});

		vi.mocked(apiClient.get).mockResolvedValue({
			data: {
				data: [dto],
				meta: { page: 1, limit: 10, totalCount: 1, totalPages: 1 },
			},
		});

		const response = await fetchNotifications({ page: 1, limit: 10 });
		expect(apiClient.get).toHaveBeenCalledWith('/notifications', {
			params: { page: 1, limit: 10 },
		});
		expect(response.data[0].id).toBe(50);
		expect(response.data[0].linkId).toBe(101);
		expect(response.meta.totalCount).toBe(1);
	});
});
