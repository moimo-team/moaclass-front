import type { FetchLessonsParams } from '@/models/lesson.model';

export interface SearchParamsLike {
	get: (key: string) => string | null;
	getAll: (key: string) => string[];
}

// URL 쿼리 포맷 파싱 공통화
export const parseMultiValueParam = (searchParams: SearchParamsLike, key: string): string[] => {
	const values = searchParams.getAll(key);
	if (values.length > 0) {
		return values
			.flatMap((value) => value.split(','))
			.map((value) => value.trim())
			.filter(Boolean);
	}

	const single = searchParams.get(key);
	if (!single) {
		return [];
	}

	return single
		.split(',')
		.map((value) => value.trim())
		.filter(Boolean);
};

// 직렬화 공통화
export const appendParam = (
	params: URLSearchParams,
	key: string,
	value: string | number | Array<string | number>,
) => {
	if (Array.isArray(value)) {
		if (value.length === 0) {
			return;
		}
		params.set(key, value.map(String).join(','));
		return;
	}

	params.set(key, String(value));
};

export const buildLessonFilterSearchParams = (filters: FetchLessonsParams): URLSearchParams => {
	const params = new URLSearchParams();

	Object.entries(filters).forEach(([key, value]) => {
		if (value === undefined || value === null || value === '') {
			return;
		}

		appendParam(params, key, value as string | number | Array<string | number>);
	});

	return params;
};
