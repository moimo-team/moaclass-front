import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { fetchLesson } from '@/api/lesson.api';
import type { LessonDetail } from '@/models/lesson.model';

export const useLessonQuery = (
	lessonId?: number,
	options?: Omit<UseQueryOptions<LessonDetail, Error>, 'queryKey' | 'queryFn'>,
) => {
	return useQuery<LessonDetail, Error>({
		queryKey: ['lesson', lessonId],
		queryFn: async () => fetchLesson(lessonId!),
		enabled: !!lessonId,
		...options,
	});
};
