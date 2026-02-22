import { describe, expect, it } from 'vitest';

import { resolveNotificationNavigation } from '@/constants/notificationActions';
import { getDefaultNotificationMessage } from '@/constants/notificationMessages';
import {
	ALL_NOTIFICATION_TYPES,
	createNotificationFixture,
} from '@/test/fixtures/notification.fixture';

// NotificationType 전체가 테스트에서 누락되지 않도록 보장
// 각 타입에 기본 메세지가 존재하는지, 각 타입이 최소한 유효한 네비게이션 결과를 반환하는지 검사
// 타입이 새로 추가되거나 변경될 때 테스트가 바로 깨져서 누락을 빠르게 잡을 수 있음
describe('notification type matrix', () => {
	it.each(ALL_NOTIFICATION_TYPES)('has default message: %s', (type) => {
		const message = getDefaultNotificationMessage(type);
		expect(message.length).toBeGreaterThan(0);
	});

	it.each(ALL_NOTIFICATION_TYPES)('has fallback navigation: %s', (type) => {
		const notification = createNotificationFixture(type, {
			linkType: undefined,
			linkId: undefined,
		});

		const navigation = resolveNotificationNavigation(notification);
		expect(navigation).not.toBeNull();
		expect(navigation?.path.length).toBeGreaterThan(0);
	});
});
