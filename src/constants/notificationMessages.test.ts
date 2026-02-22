import { describe, expect, it } from 'vitest';

import {
	getDefaultNotificationMessage,
	resolveNotificationMessage,
} from '@/constants/notificationMessages';
import {
	ALL_NOTIFICATION_TYPES,
	createNotificationFixture,
} from '@/test/fixtures/notification.fixture';

describe('notificationMessages', () => {
	it.each(ALL_NOTIFICATION_TYPES)('returns default message for %s', (type) => {
		const message = getDefaultNotificationMessage(type);
		expect(typeof message).toBe('string');
		expect(message.length).toBeGreaterThan(0);
	});

	it('uses message first', () => {
		const item = createNotificationFixture('PARTICIPATION_REQUEST', {
			message: 'message first',
			description: 'description second',
		});
		expect(resolveNotificationMessage(item)).toBe('message first');
	});

	it('uses description when message is empty', () => {
		const item = createNotificationFixture('PARTICIPATION_ACCEPTED', {
			message: undefined,
			description: 'description fallback',
		});
		expect(resolveNotificationMessage(item)).toBe('description fallback');
	});

	it.each(ALL_NOTIFICATION_TYPES)('falls back to default message for %s', (type) => {
		const item = createNotificationFixture(type, {
			message: undefined,
			description: undefined,
		});
		expect(resolveNotificationMessage(item)).toBe(getDefaultNotificationMessage(type));
	});
});
