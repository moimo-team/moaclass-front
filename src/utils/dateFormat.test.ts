import { describe, it, expect } from 'vitest';

import { formatDateTime } from './dateFormat';

describe('formatDateTime', () => {
	it('should format UTC ISO string to Asia/Seoul time', () => {
		// UTC 00:00:00 -> Seoul 09:00:00
		const utcInput = '2024-02-23T00:00:00Z';
		expect(formatDateTime(utcInput, { type: 'date' })).toBe('24.02.23');
		expect(formatDateTime(utcInput, { type: 'time' })).toBe('09:00');
		expect(formatDateTime(utcInput, { type: 'full' })).toBe('2024-02-23 09:00:00');
	});

	it('should format KST (+09:00) ISO string correctly', () => {
		const kstInput = '2024-02-23T00:00:00+09:00';
		expect(formatDateTime(kstInput, { type: 'date' })).toBe('24.02.23');
		expect(formatDateTime(kstInput, { type: 'time' })).toBe('00:00');
	});

	it('should fallback for raw digit strings (YYYYMMDD)', () => {
		const rawInput = '20240223';
		// new Date('20240223') might be Invalid Date in some environments,
		// if so it should fallback to slicing.
		expect(formatDateTime(rawInput, { type: 'date' })).toBe('24.02.23');
	});

	it('should fallback for strings with digits only (YYYYMMDDHHMMSS)', () => {
		const rawInput = '20240223130000';
		expect(formatDateTime(rawInput, { type: 'time' })).toBe('13:00');
	});

	it('should handle custom separators', () => {
		const utcInput = '2024-02-23T00:00:00Z';
		expect(formatDateTime(utcInput, { type: 'date', separator: '-' })).toBe('24-02-23');
		expect(formatDateTime(utcInput, { type: 'time', separator: '.' })).toBe('09.00');
	});
});
