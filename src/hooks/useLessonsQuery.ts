import { useQuery } from '@tanstack/react-query';

import { fetchLatestLessons, fetchLessons } from '@/api/lesson.api';
import type { FetchLessonsParams, FetchLessonsResponse, Lesson } from '@/models/lesson.model';

export const useLatestLessonsQuery = () => {
	return useQuery<Lesson[], Error>({
		queryKey: ['lessons', 'latest', { limit: 10, sort: 'LATEST', page: 1 }],
		queryFn: fetchLatestLessons,
	});
};

export const useLessonsQuery = (params: FetchLessonsParams, page: number, enabled: boolean) => {
	const queryParams = { ...params, page };
	const queryKey = ['lessons', 'list', queryParams];

	const queryResult = useQuery<FetchLessonsResponse, Error>({
		queryKey,
		queryFn: () => fetchLessons(queryParams),
		enabled,
	});

	return { ...queryResult, queryKey };
};

interface UseHomeLessonSectionQueryOptions {
	limit?: number;
	enabled?: boolean;
}

export const useHomeLessonSectionQuery = (
	params: FetchLessonsParams,
	options: UseHomeLessonSectionQueryOptions = {},
) => {
	const { limit = 10, enabled = true } = options;
	const queryParams: FetchLessonsParams & { limit: number; page: number } = {
		...params,
		limit,
		page: 1,
		status: 'ACTIVE',
		sort: params.sort ?? 'LATEST',
	};

	return useQuery<Lesson[], Error>({
		queryKey: ['lessons', 'home-section', queryParams],
		queryFn: async () => {
			const response = await fetchLessons(queryParams);
			return response.data;
		},
		enabled,
	});
};
