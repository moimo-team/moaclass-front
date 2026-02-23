import { describe, expect, it } from 'vitest';

import {
	appendParam,
	buildLessonFilterSearchParams,
	parseMultiValueParam,
} from '@/utils/lessonFilterQuery';

describe('lessonFilterQuery', () => {
	it('parses repeated query params', () => {
		const params = new URLSearchParams('regionId=1&regionId=2&regionId=3');

		expect(parseMultiValueParam(params, 'regionId')).toEqual(['1', '2', '3']);
	});

	it('parses comma-separated query params', () => {
		const params = new URLSearchParams('regionId=1,2,3');

		expect(parseMultiValueParam(params, 'regionId')).toEqual(['1', '2', '3']);
	});

	it('builds comma-separated params for arrays', () => {
		const params = new URLSearchParams();
		appendParam(params, 'regionId', [1, 2, 3]);

		expect(params.toString()).toBe('regionId=1%2C2%2C3');
		expect(params.get('regionId')).toBe('1,2,3');
	});

	it('builds lesson filter search params with comma-separated arrays', () => {
		const params = buildLessonFilterSearchParams({
			regionId: [1, 2],
			subCategoryId: [10, 11],
			sort: 'LATEST',
		});

		expect(params.get('regionId')).toBe('1,2');
		expect(params.get('subCategoryId')).toBe('10,11');
		expect(params.get('sort')).toBe('LATEST');
	});
});
