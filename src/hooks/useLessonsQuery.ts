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
	const queryKey = ['lessons', 'list', params, page];

	const queryResult = useQuery<FetchLessonsResponse, Error>({
		queryKey,
		queryFn: () => fetchLessons(queryParams),
		enabled,
	});

	return { ...queryResult, queryKey };
};
